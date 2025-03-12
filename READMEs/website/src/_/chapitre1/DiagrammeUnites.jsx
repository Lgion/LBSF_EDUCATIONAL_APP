import React, { useState } from 'react';

const UnitCard = ({ title, description, isActive, onClick }) => (
  <div
    className={`cursor-pointer transition-all duration-300 p-6 rounded-lg shadow-md ${
      isActive ? 'bg-primary text-white scale-105' : 'bg-white hover:bg-primary/10'
    }`}
    onClick={onClick}
  >
    <h4 className={`text-lg font-medium mb-2 ${isActive ? 'text-white' : 'text-primary'}`}>
      {title}
    </h4>
    {isActive && <p className="text-sm">{description}</p>}
  </div>
);

export default function DiagrammeUnites() {
  const [activeUnit, setActiveUnit] = useState(null);

  const units = [
    {
      id: 1,
      title: "Unité de Réception",
      description: "Gestion et tri des déchets entrants, contrôle qualité et préparation pour le traitement."
    },
    {
      id: 2,
      title: "Unité de Production",
      description: "Élevage des larves BSF et transformation des déchets organiques."
    },
    {
      id: 3,
      title: "Unité de Post-traitement",
      description: "Traitement des produits finaux, conditionnement et préparation pour la commercialisation."
    }
  ];

  return (
    <section className="mb-12">
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-heading font-semibold text-secondary mb-6">
          Structure de navigation
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-8">
            <img
              src="/images/I_justification/3_naviguer/1.3a.webp"
              alt="Diagramme des unités de traitement"
              className="w-full max-w-3xl mx-auto rounded-lg shadow-md"
            />
          </div>

          <h3 className="text-xl font-heading font-medium text-accent mb-6">
            Les trois unités principales de traitement
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                title={unit.title}
                description={unit.description}
                isActive={activeUnit === unit.id}
                onClick={() => setActiveUnit(activeUnit === unit.id ? null : unit.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
