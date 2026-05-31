# HR Email Automation API

Base URL: `http://localhost:5000`

All responses follow:

**Success**
```json
{ "success": true, "message": "...", "data": {} }
```

**Error**
```json
{ "success": false, "message": "..." }
```

Rate limit: **100 requests / 15 minutes** on `/api/email/*`

---

## Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Root health (`status: ok`) |
| GET | `/api/email/health` | API health |
| GET | `/api/email/verify` | Verify SMTP |

---

## Universal send (frontend integration)

**POST** `/api/emails/send` (also `/api/email/send`)

```json
{
  "userId": "101",
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "emailType": "application_received",
  "dynamicData": {
    "applicationId": "APP-001",
    "role": "HR Intern"
  }
}
```

`emailType` values: `application_received`, `interview`, `selection`, `rejection`, `offer_letter`, `onboarding_reminder`

Offer letter example (`joiningDate` maps to `startDate`):

```json
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "emailType": "offer_letter",
  "dynamicData": {
    "role": "HR Intern",
    "joiningDate": "2026-07-01"
  }
}
```

---

## Send emails (HTML templates)

| Method | Endpoint | Template |
|--------|----------|----------|
| POST | `/api/email/send-application` | Application received |
| POST | `/api/email/send-interview` | Interview scheduled |
| POST | `/api/email/send-selection` | Selection |
| POST | `/api/email/send-rejection` | Rejection |
| POST | `/api/email/send-offer` | Offer letter |
| POST | `/api/email/send-onboarding` | Onboarding reminder |
| POST | `/api/email/bulk-send` | Any template (batch) |

### Application
```json
POST /api/email/send-application
{ "name": "Rahul", "email": "rahul@gmail.com" }
```

### Interview
```json
POST /api/email/send-interview
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "date": "2026-06-10",
  "time": "10:00 AM",
  "meetingLink": "https://meet.google.com/abc"
}
```

### Offer
```json
POST /api/email/send-offer
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "role": "HR Intern",
  "startDate": "2026-07-01"
}
```

### Bulk
```json
POST /api/email/bulk-send
{
  "emailType": "application",
  "users": [
    { "name": "Rahul", "email": "rahul@gmail.com" },
    { "name": "Ananya", "email": "ananya@gmail.com" }
  ]
}
```

---

## Logs & dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/email/stats` | Dashboard counts |
| GET | `/api/email/logs?page=1&limit=20` | Paginated logs |
| GET | `/api/email/logs/search?q=rahul` | Search by name/email |
| GET | `/api/email/status/:id` | Single log status |

### Stats response
```json
{
  "success": true,
  "message": "Email statistics fetched",
  "data": {
    "total": 250,
    "sent": 230,
    "failed": 20,
    "today": 15
  }
}
```

### Paginated logs
```json
GET /api/email/logs?page=1&limit=20
```

### Search
```json
GET /api/email/logs/search?q=rahul&page=1&limit=20
```

---

## Environment variables

```env
PORT=5000
EMAIL_USER=...
EMAIL_PASS=...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=anon_public_key
```

---

## Template manager

Templates are resolved via `src/templates/templateManager.js`:

```javascript
templates[emailType](data)
```

Supported keys: `application`, `interview`, `selection`, `rejection`, `offer`, `onboarding`
