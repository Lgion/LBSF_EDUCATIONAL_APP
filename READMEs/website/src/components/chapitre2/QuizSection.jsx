import React, { useState } from 'react';

const questions = [
  {
    id: 1,
    question: "Quelle est la durée moyenne du stade larvaire de la BSF ?",
    options: [
      "7-10 jours",
      "14-16 jours",
      "20-25 jours",
      "30-35 jours"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Quel est le pourcentage moyen de protéines dans les larves séchées ?",
    options: [
      "20-25%",
      "30-35%",
      "42-45%",
      "50-55%"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "De combien peut-on réduire le volume des déchets organiques grâce aux BSF ?",
    options: [
      "40-50%",
      "60-70%",
      "80-90%",
      "95-100%"
    ],
    correctAnswer: 2
  }
];

export default function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateScore = () => {
    let score = 0;
    Object.entries(answers).forEach(([questionId, answerIndex]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question.correctAnswer === answerIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowResults(false);
    setCurrentQuestion(0);
  };

  return (
    <section className="mb-12">
      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-heading font-semibold text-secondary mb-6">
          Quiz de compréhension
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6">
          {!showResults ? (
            <div className="space-y-8">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`quiz-question ${
                    currentQuestion === index ? 'block' : 'hidden'
                  }`}
                >
                  <h3 className="text-xl font-medium text-primary mb-4">
                    Question {index + 1} : {q.question}
                  </h3>
                  <div className="space-y-3">
                    {q.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`block p-4 rounded-lg border cursor-pointer transition-colors duration-200 ${
                          answers[q.id] === optionIndex
                            ? 'bg-primary/10 border-primary'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={optionIndex}
                          checked={answers[q.id] === optionIndex}
                          onChange={() => handleAnswer(q.id, optionIndex)}
                          className="hidden"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  className={`px-4 py-2 rounded-md ${
                    currentQuestion === 0
                      ? 'bg-gray-200 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                  disabled={currentQuestion === 0}
                >
                  Précédent
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    disabled={Object.keys(answers).length !== questions.length}
                  >
                    Terminer
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-medium text-primary mb-4">
                Résultats
              </h3>
              <p className="text-xl mb-6">
                Votre score : {calculateScore()} / {questions.length}
              </p>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Recommencer le quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
