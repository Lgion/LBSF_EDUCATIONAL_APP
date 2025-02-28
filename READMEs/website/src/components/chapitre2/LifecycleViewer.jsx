import React, { useState } from 'react';

const LifecycleStage = ({ stage, index, isActive, onClick }) => (
  <div
    className={`lifecycle-stage cursor-pointer p-4 rounded-lg transition-all duration-300 ${
      isActive ? 'bg-primary text-white' : 'bg-white hover:bg-primary/10'
    }`}
    onClick={() => onClick(index)}
  >
    <h4 className={`text-lg font-medium mb-2 ${isActive ? 'text-white' : 'text-primary'}`}>
      {stage.name}
    </h4>
    {isActive && (
      <div className="space-y-2">
        <p className="text-sm">{stage.description}</p>
        <p className="text-xs opacity-80">Durée : {stage.duration}</p>
      </div>
    )}
  </div>
);

export default function LifecycleViewer() {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      name: "Reproduction",
      description: "Les mouches adultes s'accouplent et pondent des œufs",
      duration: "2-3 jours",
      image: "/images/II_introduction/4_mesures/1/17.jpg"
    },
    {
      name: "Éclosion",
      description: "Les œufs éclosent en petites larves",
      duration: "4-5 jours",
      image: "/images/II_introduction/4_mesures/1/19.jpg"
    },
    {
      name: "Croissance larvaire",
      description: "Les larves se nourrissent et grandissent rapidement",
      duration: "14-16 jours",
      image: "/images/II_introduction/4_mesures/1/21.jpg"
    },
    {
      name: "Pré-pupaison",
      description: "Les larves cessent de s'alimenter et cherchent un lieu sec",
      duration: "7-10 jours",
      image: "/images/II_introduction/4_mesures/1/23.jpg"
    },
    {
      name: "Métamorphose",
      description: "Transformation en mouche adulte",
      duration: "10-14 jours",
      image: "/images/II_introduction/4_mesures/1/26.jpg"
    }
  ];

  return (
    <section className="mb-12">
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-heading font-semibold text-secondary mb-6">
          Cycle de vie ingéniérisé
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Image principale du cycle de vie */}
          <div className="mb-8">
            <img
              src="/images/II_introduction/3_ingenierie/2.3a.webp"
              alt="Cycle de vie ingéniérisé de la BSF"
              className="w-full max-w-3xl mx-auto rounded-lg shadow-md"
            />
          </div>

          {/* Étapes détaillées avec images */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stages.map((stage, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <img
                    src={stage.image}
                    alt={stage.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <LifecycleStage
                  stage={stage}
                  index={index}
                  isActive={index === activeStage}
                  onClick={setActiveStage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
