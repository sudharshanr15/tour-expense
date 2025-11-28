"use client";
import React, { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { createExpense } from "../lib/api";

export default function ExpenseForm({
  tourId,
  onCreated,
}: {
  tourId: number;
  onCreated?: (expense: any) => void;
}) {
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const amt = parseFloat(amount);
      if (isNaN(amt)) throw new Error("Amount must be a number");
      const exp = await createExpense(tourId, {
        amount: amt,
        currency,
        category,
        note,
      });
      setAmount("");
      setCategory("");
      setNote("");
      onCreated?.(exp);
    } catch (err: any) {
      setError(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div>
        <label className="block text-sm">Amount</label>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="123.45"
        />
      </div>
      <div>
        <label className="block text-sm">Currency</label>
        <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Category</label>
        <Input value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Note</label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      {error && <div className="text-destructive text-sm">{error}</div>}
      <div>
        <Button type="submit" disabled={loading || !amount}>
          {loading ? "Adding..." : "Add Expense"}
        </Button>
      </div>
    </form>
  );
}
