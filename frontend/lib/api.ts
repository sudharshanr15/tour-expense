const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export async function fetchTours() {
  const res = await fetch(`${API_BASE}/tours`);
  if (!res.ok) throw new Error("Failed to fetch tours");
  return res.json();
}

export async function createTour(payload: {
  name: string;
  start_date?: string;
  end_date?: string;
}) {
  const res = await fetch(`${API_BASE}/tours`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create tour");
  return res.json();
}

export async function fetchTour(tourId: number) {
  const res = await fetch(`${API_BASE}/tours/${tourId}`);
  if (!res.ok) throw new Error("Failed to fetch tour");
  return res.json();
}

export async function createExpense(
  tourId: number,
  payload: {
    amount: number;
    currency?: string;
    category?: string;
    note?: string;
    incurred_at?: string;
  }
) {
  const res = await fetch(`${API_BASE}/tours/${tourId}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to create expense");
  }
  return res.json();
}

export async function fetchExpensesForTour(tourId: number) {
  const res = await fetch(`${API_BASE}/tours/${tourId}/expenses`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}
