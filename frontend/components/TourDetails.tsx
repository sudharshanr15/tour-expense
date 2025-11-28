"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ExpenseForm from "./ExpenseForm";
import { fetchTour, fetchExpensesForTour } from "../lib/api";

export default function TourDetails({ tourId }: { tourId?: number }) {
  const [tour, setTour] = useState<any | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!tourId) return;
    setLoading(true);
    setError(null);
    try {
      const t = await fetchTour(tourId);
      const ex = await fetchExpensesForTour(tourId);
      setTour(t);
      setExpenses(ex);
    } catch (err: any) {
      setError(err.message || "Failed to load tour");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [tourId]);

  if (!tourId) return <div className="">Select a tour to see details</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-destructive">{error}</div>;
  if (!tour) return <div>No tour found</div>;

  const totals = expenses.reduce((acc: Record<string, number>, e) => {
    acc[e.currency] = (acc[e.currency] || 0) + Number(e.amount || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{tour.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {tour.start_date || "—"} → {tour.end_date || "—"}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Totals</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {Object.entries(totals).map(([c, amt]) => (
              <li key={c} className="text-sm">
                {c}: {amt}
              </li>
            ))}
            {Object.keys(totals).length === 0 && (
              <li className="text-sm text-muted-foreground">No expenses yet</li>
            )}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm
            tourId={tourId}
            onCreated={() => {
              load();
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {expenses.map((e) => (
              <li key={e.id} className="p-2 rounded border border-border">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">
                      {e.category || "—"} — {e.currency} {e.amount}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {e.note || ""}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {e.incurred_at
                      ? new Date(e.incurred_at).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
