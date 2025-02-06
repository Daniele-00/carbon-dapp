// Component: FeaturesSection per la sezione "Come Funziona (Facoltativo)"
"use client"
import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: "Calcola la tua Impronta",
      description: "Inserisci i tuoi consumi e calcola la tua impronta di carbonio in modo preciso e personalizzato",
      icon: "📊",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Tokenizza",
      description: "Converti la tua impronta di carbonio in token digitali verificabili sulla blockchain, garantendo trasparenza e tracciabilità.",
      icon: "🔗",
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Investi in Green Projects",
      description: "Utilizza i tuoi token per supportare progetti di sostenibilità verificati e monitora il tuo impatto positivo in tempo reale.",
      icon: "🌱",
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div id="features-section" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-6">
            Come Funziona
          </h2>
          <p className="text-lg text-green-600">
            Trasforma il tuo impegno ambientale in azioni concrete attraverso tre semplici passaggi
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative group"
            >
              {/* Card */}
              <div className="h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-green-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-green-600">
                  {feature.description}
                </p>

                {/* Decorative Number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-green-100 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  {index + 1}
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 to-emerald-500/0 rounded-2xl group-hover:from-green-400/5 group-hover:to-emerald-500/5 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;