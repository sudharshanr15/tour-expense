"use client";
import React, { useEffect, useState } from "react";
import { fetchTours } from "../lib/api";

export default function TourList({
  onSelect,
}: {
  onSelect?: (tour: any) => void;
}) {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTours();
      setTours(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tours");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tours</h3>
        <button className="text-sm text-muted" onClick={load}>
          Refresh
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-destructive">{error}</div>}
      <ul className="space-y-1">
        {tours.map((t) => (
          <li key={t.id}>
            <button
              className="w-full text-left p-2 rounded hover:bg-muted"
              onClick={() => onSelect?.(t)}
            >
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-muted-foreground">
                {t.start_date || "—"} → {t.end_date || "—"}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
