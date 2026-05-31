# Frontend ↔ Backend integration

Frontend folder: `Frontend-emil_automation/Frontend-emil_automation/`

## Aligned endpoints

| Frontend calls | Backend |
|----------------|---------|
| `POST /api/emails/send` | `sendUniversalEmail` → template by `emailType` |
| `GET /api/emails/stats` | Dashboard stats |
| `GET /api/emails/logs` | Paginated logs |

Both `/api/email/*` and `/api/emails/*` work (same routes).

## Run

**Terminal 1 — Backend**
```bash
cd email-automation-server
npm run dev
```

**Terminal 2 — Frontend**  
Open `Frontend-emil_automation/Frontend-emil_automation/html/` in browser (Live Server) or your static server.

## Test checklist

1. `GET http://localhost:5000/health` → `{ "success": true, "status": "ok" }`
2. `GET http://localhost:5000/api/emails/stats`
3. `POST http://localhost:5000/api/emails/send` with application payload (see `docs/api.md`)
4. Application form → Send Application Mail
5. Offer letter page → Send Email

## Frontend payload (unchanged)

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

Backend maps `joiningDate` → `startDate` for the offer template.

## Note

`dashboardactions.js` still uses a **simulated** delay (no API). Wire those buttons to `POST /api/emails/send` when ready.
