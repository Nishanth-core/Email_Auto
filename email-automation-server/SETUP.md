# Gmail setup for email-automation-server

## 1. Edit `.env`

```env
PORT=5000
EMAIL_USER=your_actual@gmail.com
EMAIL_PASS=your_16_character_app_password
```

- Use your **full Gmail address** for `EMAIL_USER`.
- Use a **Google App Password** for `EMAIL_PASS` — not your normal Gmail sign-in password.

## 2. Create a Gmail App Password

1. Open [Google Account Security](https://myaccount.google.com/security).
2. Enable **2-Step Verification** if it is off.
3. Open **App passwords** (under 2-Step Verification).
4. Create one for **Mail** / **Other (HR Email Server)**.
5. Copy the 16-character password into `EMAIL_PASS`.

## 3. Restart the server

```bash
npm run dev
```

On success you should see:

```text
✓ Gmail SMTP credentials verified
Server running on port 5000
```

## 4. Test in Postman

| Method | URL | Purpose |
|--------|-----|---------|
| GET | `http://localhost:5000/api/email/health` | API is up |
| GET | `http://localhost:5000/api/email/verify` | Gmail login works |
| POST | `http://localhost:5000/api/email/send` | Send a test email |

**POST body (JSON):**

```json
{
  "to": "recipient@gmail.com",
  "subject": "HR Automation Test",
  "text": "System-generated email working successfully"
}
```
