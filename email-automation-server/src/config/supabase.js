const { createClient } = require('@supabase/supabase-js');

const getSupabase = () => {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_KEY?.trim();

  if (!url || !key) return null;

  return createClient(url, key);
};

module.exports = { getSupabase };

