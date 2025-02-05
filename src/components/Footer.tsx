// Componente footer per vedere le informazioni extra (Facoltativo)
"use client";

import React from "react";

const Footer = () => {
  const footerLinks = {
    prodotto: [
      { name: "Caratteristiche", href: "#" },
      { name: "Calcolatore", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Progetti", href: "#" },
    ],
    azienda: [
      { name: "Chi Siamo", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Carriere", href: "#" },
      { name: "Contatti", href: "#" },
    ],
    legale: [
      { name: "Privacy Policy", href: "#" },
      { name: "Termini di Servizio", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
            <div className="flex-shrink-0 w-15 h-15"> {/* Dimensioni fisse per il contenitore */}
             {/* Immagine del logo */}
              <img src="/images/logo.jpg" alt="EcoChain Logo" 
                className="w-14 h-14" // Dimensioni dell'animazione
                style={{ borderRadius: '50%' }} // effetto rounded
              />
            </div>
              <span className="text-xl font-bold">EcoChain</span>
            </div>
            <p className="text-gray-400 mb-6">
              Trasformiamo la sostenibilità attraverso la tecnologia blockchain.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons (Facoltativo)*/}
              {["twitter", "facebook", "instagram", "linkedin"].map(
                (social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                  >
                    {/* Placeholder for social icons (Facoltativo)*/}
                    <span className="text-sm">{social[0].toUpperCase()}</span>
                  </a>
                )
              )}
            </div>
          </div>

          {/* Links Sections(Facoltativo) */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Prodotto</h3>
            <ul className="space-y-4">
              {footerLinks.prodotto.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Azienda</h3>
            <ul className="space-y-4">
              {footerLinks.azienda.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Legale</h3>
            <ul className="space-y-4">
              {footerLinks.legale.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 EcoChain. Tutti i diritti riservati.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">
                Made with 🌱 for a sustainable future
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
