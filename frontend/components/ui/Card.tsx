"use client";
import React from "react";

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={"p-4 rounded-md bg-card " + className}>{children}</div>
  );
}
