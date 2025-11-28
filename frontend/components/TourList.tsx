"use client";
import React, { useEffect, useState } from "react";
import { fetchTours } from "../lib/api";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Button from "./ui/Button";
import { RefreshCcw } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle>Tours</CardTitle>
        <CardAction>
          <Button onClick={load}>
            <RefreshCcw size={15} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
