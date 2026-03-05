# Hostel Tournament

## Run Locally

1. Create `.env` from `.env.example`.
2. Install dependencies:
   - `npm install`
3. Start server:
   - `npm start`
4. Open:
   - `http://localhost:5000/admin`
   - `http://localhost:5000/portal/`

## Deploy on Render

1. Push this repo to GitHub.
2. In Render, create a new `Web Service` from this repo.
3. Render will use `render.yaml` automatically.
4. Add environment variables in Render dashboard:
   - `MONGO_URI`
   - `ADMIN_PASSWORD`
5. Deploy.
6. Use:
   - `https://<your-service>.onrender.com/admin`
   - `https://<your-service>.onrender.com/portal/`

## Custom Domains (Optional)

Map both subdomains to same Render service:

- `admin.yourdomain.com` -> `https://<your-service>.onrender.com/admin`
- `register.yourdomain.com` -> `https://<your-service>.onrender.com/portal/`
