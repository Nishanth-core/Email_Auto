const { getSupabase } = require('../config/supabase');

const requireSupabase = () => {
  const supabase = getSupabase();
  if (!supabase) {
    const err = new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_KEY in .env');
    err.statusCode = 503;
    throw err;
  }
  return supabase;
};

const saveEmailLog = async ({
  intern_name,
  email,
  email_type,
  status,
  error_message = null,
  retry_count = 0
}) => {
  const supabase = getSupabase();
  if (!supabase) {
    return { saved: false, reason: 'Supabase not configured' };
  }

  const { data, error } = await supabase
    .from('email_logs')
    .insert([
      {
        intern_name,
        email,
        email_type,
        status,
        error_message,
        retry_count
      }
    ])
    .select('id, status, sent_at, retry_count')
    .single();

  if (error) {
    throw error;
  }

  return { saved: true, log: data };
};

const updateEmailLog = async (id, { status, error_message = null, retry_count }) => {
  const supabase = getSupabase();
  if (!supabase || !id) {
    return { updated: false };
  }

  const updates = { status, error_message };
  if (retry_count !== undefined) {
    updates.retry_count = retry_count;
  }

  const { data, error } = await supabase
    .from('email_logs')
    .update(updates)
    .eq('id', id)
    .select('id, status, sent_at, retry_count, error_message')
    .single();

  if (error) {
    throw error;
  }

  return { updated: true, log: data };
};

const getEmailStats = async () => {
  const supabase = requireSupabase();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [totalRes, sentRes, failedRes, todayRes] = await Promise.all([
    supabase.from('email_logs').select('*', { count: 'exact', head: true }),
    supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'Sent'),
    supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('status', 'Failed'),
    supabase
      .from('email_logs')
      .select('*', { count: 'exact', head: true })
      .gte('sent_at', startOfDay.toISOString())
  ]);

  if (totalRes.error) throw totalRes.error;
  if (sentRes.error) throw sentRes.error;
  if (failedRes.error) throw failedRes.error;
  if (todayRes.error) throw todayRes.error;

  return {
    total: totalRes.count ?? 0,
    sent: sentRes.count ?? 0,
    failed: failedRes.count ?? 0,
    today: todayRes.count ?? 0
  };
};

const getEmailLogsPaginated = async ({ page = 1, limit = 20 }) => {
  const supabase = requireSupabase();

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  const { data, error, count } = await supabase
    .from('email_logs')
    .select('*', { count: 'exact' })
    .order('sent_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    logs: data ?? [],
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / safeLimit) || 1
    }
  };
};

const searchEmailLogs = async (query, { page = 1, limit = 20 } = {}) => {
  const supabase = requireSupabase();

  const q = String(query || '').trim();
  if (!q) {
    return getEmailLogsPaginated({ page, limit });
  }

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;
  const safeQ = q.replace(/[%_,.()]/g, '');
  const pattern = `%${safeQ}%`;

  const { data, error, count } = await supabase
    .from('email_logs')
    .select('*', { count: 'exact' })
    .or(`intern_name.ilike.${pattern},email.ilike.${pattern}`)
    .order('sent_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    logs: data ?? [],
    query: q,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / safeLimit) || 1
    }
  };
};

const getEmailLogById = async (id) => {
  const supabase = requireSupabase();

  const { data, error } = await supabase.from('email_logs').select('*').eq('id', id).single();

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  saveEmailLog,
  updateEmailLog,
  getEmailStats,
  getEmailLogsPaginated,
  searchEmailLogs,
  getEmailLogById
};
