"use client";
import React, { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { createTour } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function TourForm({
  onCreated,
}: {
  onCreated?: (tour: any) => void;
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tour = await createTour({
        name,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });
      setName("");
      setStartDate("");
      setEndDate("");
      onCreated?.(tour);
    } catch (err: any) {
      setError(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Tour</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-2">
          <div>
            <label className="block text-sm">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Trip to Spain"
            />
          </div>
          <div>
            <label className="block text-sm">Start date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">End date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {error && <div className="text-destructive text-sm">{error}</div>}
          <div>
            <Button type="submit" disabled={loading || !name}>
              {loading ? "Creating..." : "Create Tour"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
