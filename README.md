# Tour Expense — Fullstack (Flask + SQLite / Next.js)

This repository contains a small tour expense tracker with:
- Backend: Flask + SQLite REST API
- Frontend: Next.js app (shadcn-style UI) that consumes the API

This README explains how to set up and run both parts locally for development.

Prerequisites
- Python 3.8+ and `pip`
- Node.js 16+ and `npm` (or Yarn / pnpm)

Repository layout
- `/app.py`, `/models.py`, `/requirements.txt` — Flask backend (root)
- `/frontend` — Next.js frontend

Backend — Quickstart

1. Create and activate a virtual environment and install Python deps:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Initialize the database (creates `tour_expense.db` by default):

```bash
export FLASK_APP="app:create_app"
flask --app app:create_app init-db
```

3. Run the backend server (development):

```bash
flask --app app:create_app run --host 127.0.0.1 --port 5000
```

Notes:
- Default DB: `sqlite:///tour_expense.db`. To change, set `DATABASE_URL` env var.
- CORS is enabled for development. See `app.py` for details.

Backend API (selected endpoints)
- `POST /api/tours` — Create a tour. JSON: `{ "name": "Trip", "start_date": "YYYY-MM-DD", "end_date": "YYYY-MM-DD" }`
- `GET /api/tours` — List tours
- `GET /api/tours/<id>` — Get tour with expenses
- `POST /api/tours/<id>/expenses` — Add expense. JSON: `{ "amount": 12.34, "currency": "USD", "category": "food", "note": "lunch" }`
- `GET /api/tours/<id>/expenses` — List expenses for a tour
- `GET /api/summary/tour/<id>` — Totals grouped by currency

Frontend — Quickstart

1. Change into the `frontend` folder and install Node deps:

```bash
cd frontend
npm install
```

2. (Optional) Set frontend API base if backend runs on a non-default host/port:

```bash
export NEXT_PUBLIC_API_BASE="http://127.0.0.1:5000/api"
```

3. Start the dev server:

```bash
npm run dev
```

The app is served at `http://localhost:3000` by default.

Troubleshooting
- 403 responses when calling `http://localhost:5000` from the browser can happen if another system service is bound to IPv6 `::1` (macOS AirPlay) and the request resolves to IPv6. Use `127.0.0.1` or bind Flask to `0.0.0.0`/`::` or a different port. Example test using IPv4:

```bash
curl -v http://127.0.0.1:5000/api/tours -H 'Content-Type: application/json' -d '{"name":"Test"}'
```

- If you see CORS errors in the browser, ensure the backend is running and that `NEXT_PUBLIC_API_BASE` points to the correct origin. CORS is enabled in development in `app.py` but browser preflight will fail if backend is unreachable.

Development tips
- Keep backend running on `127.0.0.1:5000` and frontend on `localhost:3000` for a standard setup.
- Use the `frontend/lib/api.ts` helpers to call the backend from React components.

Next steps
- Add authentication, editing/deleting items, or a production-ready config (use a proper DB and stricter CORS/origins).

If you'd like, I can:
- Recreate the repo from scratch (backup + scaffolding),
- Add tests for the API, or
- Improve the UI/UX of the Next frontend.
