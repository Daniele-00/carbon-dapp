"use client";
import React from "react";
import Footer from "@/components/Footer";
import TokenDashboard from "./TokenDashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <TokenDashboard />
      <Footer />
    </main>
  );
}
