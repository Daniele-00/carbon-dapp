//Sezione delle statistiche generali (Statiche ovviamente)
"use client"

import React from 'react';

interface Stat {
  value: string;
  label: string;
  icon: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

const StatsSection = () => {
  const stats = [
    {
      value: "1.2M",
      label: "Tonnellate di CO₂ Compensate",
      icon: "🌍"
    },
    {
      value: "24+",
      label: "Progetti Attivi",
      icon: "🌱"
    },
    {
      value: "5.4K",
      label: "Utenti Attivi",
      icon: "👥"
    },
    {
      value: "18.3K",
      label: "Token Generati",
      icon: "🔗"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-4">
            Il Nostro Impatto
          </h2>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Insieme stiamo facendo la differenza. Ecco i risultati raggiunti dalla nostra community.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-green-800">{stat.value}</div>
                <div className="text-green-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;