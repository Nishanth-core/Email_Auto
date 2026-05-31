# HR Email API — Postman reference

Base URL: `http://localhost:5000`

## Health

| Method | URL |
|--------|-----|
| GET | `/health` |
| GET | `/api/email/health` |
| GET | `/api/email/verify` |

## HR template emails (POST, JSON body)

### Application received

`POST /api/email/send-application`

```json
{
  "name": "Nishanth",
  "email": "candidate@gmail.com"
}
```

### Interview scheduled

`POST /api/email/send-interview`

```json
{
  "name": "Nishanth",
  "email": "candidate@gmail.com",
  "date": "2026-06-10",
  "time": "10:00 AM IST",
  "location": "Office — Bangalore",
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

(`location` or `meetingLink` — at least one recommended)

### Selection

`POST /api/email/send-selection`

```json
{
  "name": "Nishanth",
  "email": "candidate@gmail.com"
}
```

### Rejection

`POST /api/email/send-rejection`

```json
{
  "name": "Nishanth",
  "email": "candidate@gmail.com"
}
```

### Offer letter

`POST /api/email/send-offer`

```json
{
  "name": "Nishanth",
  "email": "candidate@gmail.com",
  "role": "HR Intern",
  "startDate": "2026-07-01"
}
```

### Onboarding reminder

`POST /api/email/send-onboarding`

```json
{
  "name": "Nishanth",
  "email": "employee@gmail.com",
  "dueDate": "2026-06-15",
  "checklistLink": "https://hr.example.com/onboarding"
}
```

## Validation errors (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Valid email required" }]
}
```

## Success (200)

```json
{
  "success": true,
  "message": "Application email sent",
  "emailType": "application_received",
  "result": { "messageId": "...", "accepted": ["..."], "rejected": [] }
}
```

## Day 5 — Bulk send, retry, status

### Bulk email

`POST /api/email/bulk-send`

```json
{
  "emailType": "onboarding",
  "users": [
    { "name": "Rahul", "email": "rahul@gmail.com", "dueDate": "2026-06-15" },
    { "name": "Ananya", "email": "ananya@gmail.com", "dueDate": "2026-06-15" }
  ]
}
```

`emailType` options: `application`, `interview`, `selection`, `rejection`, `offer`, `onboarding`

For `interview`, each user needs: `date`, `time`, and optionally `location` or `meetingLink`.

For `offer`, each user needs: `role`, `startDate`.

### Get all logs

`GET /api/email/logs`

### Get status by log id

`GET /api/email/status/1`

Response includes `status`: `Pending`, `Sent`, or `Failed`, plus `retry_count`.

### Supabase migration (if table already exists)

Run `supabase/add_retry_count.sql` in Supabase SQL Editor.
