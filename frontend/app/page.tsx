"use client";
import React, { useState } from "react";
import TourList from "../components/TourList";
import TourForm from "../components/TourForm";
import TourDetails from "../components/TourDetails";

export default function Home() {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <main className="p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        <aside className="col-span-1 space-y-4">
          <TourForm
            onCreated={(t) => {
              setSelected(t);
              // small trick: let TourList be refreshed via DOM refresh button
            }}
          />

          <TourList
            onSelect={(t) => {
              setSelected(t);
            }}
          />
        </aside>

        <section className="col-span-2">
          <TourDetails tourId={selected?.id} />
        </section>
      </div>
    </main>
  );
}
