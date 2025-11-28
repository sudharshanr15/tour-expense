"use client";
import React from "react";

export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={
        "px-2 py-1 rounded-md border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-ring " +
        (props.className || "")
      }
    />
  );
}
