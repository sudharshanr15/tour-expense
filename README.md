# Tour Expense (Flask + SQLite)

Simple REST API for tracking tours and expenses using Flask and SQLite.

Quickstart

1. Create a virtual environment and install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Initialize the database:

```bash
export FLASK_APP="app:create_app"
flask --app app:create_app init-db
```

3. Run the server:

```bash
flask --app app:create_app run
```

API examples

- Create a tour

```bash
curl -X POST localhost:5000/api/tours -H 'Content-Type: application/json' -d '{"name": "Spain Trip", "start_date": "2025-05-01", "end_date": "2025-05-14"}'
```

- Add an expense to a tour (replace 1 with the tour id)

```bash
curl -X POST localhost:5000/api/tours/1/expenses -H 'Content-Type: application/json' -d '{"amount": 123.45, "currency": "EUR", "category": "food", "note": "dinner", "incurred_at": "2025-05-02T19:30:00"}'
```

- Get tour with expenses

```bash
curl localhost:5000/api/tours/1
```

- Get summary totals for a tour

```bash
curl localhost:5000/api/summary/tour/1
```

Notes

- The app uses `sqlite:///tour_expense.db` by default. Set `DATABASE_URL` environment variable to change.
- Dates should use ISO formats: `YYYY-MM-DD` for dates, `YYYY-MM-DDTHH:MM:SS` for datetimes.
