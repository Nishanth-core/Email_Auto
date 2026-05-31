# Deployment guide — HR Email Automation

Deploy in two parts: **backend** (Node API) + **frontend** (static HTML/JS). **Supabase** is already cloud-hosted.

---

## Before you deploy

### 1. Never commit secrets

- `.env` stays local only (already in `.gitignore`)
- Set secrets in the hosting dashboard (Render, Railway, etc.)

### 2. Use a production email provider

Gmail SMTP often **fails on cloud servers** (IP blocks). Prefer:

- [Resend](https://resend.com) (SMTP or API)
- SendGrid / Mailgun / Brevo

For Resend SMTP in `.env`:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxx
EMAIL_FROM=hr@yourverifieddomain.com
```

(If your code still uses Gmail-only `smtp.js`, use Gmail App Password only for demos or switch transport to Resend.)

### 3. Supabase production

- Use **Project URL** + **anon key** in production env vars
- Run `supabase/email_logs.sql` and `supabase/add_retry_count.sql` on your project
- Optional: tighten RLS policies for production

---

## Backend deploy (recommended: Render)

### Step A — Push code to GitHub

```bash
cd email-automation-server
git init
git add .
git commit -m "Email automation API"
git remote add origin https://github.com/YOUR_USER/email-automation-server.git
git push -u origin main
```

### Step B — Create Web Service on Render

1. [render.com](https://render.com) → **New** → **Web Service**
2. Connect your repo, root directory: `email-automation-server` (or repo root if only backend)
3. Settings:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Instance:** Free or paid

### Step C — Environment variables (Render → Environment)

| Variable | Example |
|----------|---------|
| `PORT` | `5000` (Render sets `PORT` automatically — optional) |
| `NODE_ENV` | `production` |
| `EMAIL_USER` | your sender email |
| `EMAIL_PASS` | app password or SMTP password |
| `SUPABASE_URL` | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | anon public key |
| `FRONTEND_URL` | `https://your-frontend.onrender.com` |

4. Deploy → copy your URL, e.g. `https://email-api-xxxx.onrender.com`

### Step D — Verify

- `GET https://your-api.onrender.com/health`
- `GET https://your-api.onrender.com/api/emails/stats`

---

## Alternative backends

| Platform | Start command | Notes |
|----------|---------------|--------|
| **Railway** | `npm start` | Add env vars in Variables tab |
| **Fly.io** | Use `Dockerfile` | `fly launch` |
| **Azure App Service** | `npm start` | Linux Node runtime |
| **VPS** (DigitalOcean) | `pm2 start server.js` | Install Node 20+, nginx reverse proxy |

---

## Frontend deploy (static hosting)

Your frontend is plain HTML/JS — host on **Netlify**, **Vercel**, **GitHub Pages**, or **Render Static Site**.

### Step 1 — Central API URL

Use `js/config.js` (created for you):

```javascript
window.APP_CONFIG = {
  API_BASE_URL: "https://your-api.onrender.com"
};
```

Load it **before** other scripts in each HTML file:

```html
<script src="../js/config.js"></script>
```

### Step 2 — Update JS files

Replace hardcoded `http://localhost:5000` with:

```javascript
const BASE_URL = window.APP_CONFIG?.API_BASE_URL || "http://localhost:5000";
```

(Already done in key files if you applied the integration update.)

### Step 3 — Deploy folder

Deploy root: `Frontend-emil_automation/Frontend-emil_automation/`

On Netlify: drag folder or connect repo, publish directory = that folder.

### Step 4 — CORS

Backend reads `FRONTEND_URL` and allows that origin. Set it to your live frontend URL (no trailing slash).

---

## Production checklist

| Item | Done? |
|------|--------|
| Backend on HTTPS URL | |
| Frontend on HTTPS URL | |
| `FRONTEND_URL` set on backend | |
| `config.js` points to production API | |
| Supabase env vars on backend | |
| Email provider works from cloud | |
| `GET /health` returns 200 | |
| Test `POST /api/emails/send` from live frontend | |
| Rate limit acceptable (100/15min) | |

---

## Optional: PM2 on a VPS

```bash
npm install -g pm2
cd email-automation-server
npm install --production
pm2 start server.js --name email-api
pm2 save
pm2 startup
```

Nginx reverse proxy → port 443 → `localhost:5000`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error in browser | Set `FRONTEND_URL` exactly to frontend origin |
| 503 email not configured | Add `EMAIL_USER` / `EMAIL_PASS` in host env |
| Gmail 535 on Render | Switch to Resend/SendGrid |
| Supabase 503 | Add `SUPABASE_URL` + `SUPABASE_KEY` |
| Frontend still calls localhost | Update `js/config.js` and redeploy frontend |

---

## Sprint demo URLs (example)

- Backend: `https://hr-email-api.onrender.com`
- Frontend: `https://hr-dashboard.netlify.app`
- Health: `https://hr-email-api.onrender.com/health`
