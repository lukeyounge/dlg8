'use client'

import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, Trophy, Play, RotateCcw, Timer } from 'lucide-react';

interface Scenario {
  id: number;
  category: string;
  scenario: string;
  shouldDelegate: boolean;
  feedback: {
    correct: string;
    incorrect: string;
  };
  funnyWrong: string;
}

type GameState = 'setup' | 'playing' | 'results' | 'finished';

const ShouldIDelegateGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [currentScenario, setCurrentScenario] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [groupDecision, setGroupDecision] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);

  const scenarios: Scenario[] = [
    {
      id: 1,
      category: "Teacher Task",
      scenario: "Ms. Johnson needs to create 25 different math word problems about fractions for tomorrow's worksheet.",
      shouldDelegate: true,
      feedback: {
        correct: "✅ Smart choice! AI can generate varied practice problems efficiently, letting Ms. Johnson focus on reviewing them and planning instruction.",
        incorrect: "❌ Oops! This is perfect for AI - generating problem variations saves hours and lets teachers focus on pedagogy."
      },
      funnyWrong: "Ms. Johnson stayed up until 2 AM writing 'Sally has 3/4 of a pizza...' for the 23rd time! 😴"
    },
    {
      id: 2,
      category: "Student Support",
      scenario: "A student asks if AI can help them understand why their answer to a chemistry problem is wrong.",
      shouldDelegate: true,
      feedback: {
        correct: "✅ Great! AI can provide step-by-step explanations and catch conceptual gaps, supporting learning perfectly.",
        incorrect: "❌ This is actually ideal for AI - it can give patient, detailed explanations that help students learn from mistakes."
      },
      funnyWrong: "The student is still staring at their wrong answer, wondering if osmosis will help it become correct! 🤔"
    },
    {
      id: 3,
      category: "Leadership Decision",
      scenario: "The principal needs to decide which three teachers should receive extra professional development support this year.",
      shouldDelegate: false,
      feedback: {
        correct: "✅ Absolutely right! This requires human judgment about individual teachers, relationships, and professional growth needs.",
        incorrect: "❌ Yikes! AI doesn't know your teachers personally or understand the nuanced professional relationships involved."
      },
      funnyWrong: "AI just recommended sending the three teachers with the most vowels in their names to training! 🤖"
    },
    {
      id: 4,
      category: "Student Assessment",
      scenario: "Determining which students in the class are struggling with reading comprehension and need additional support.",
      shouldDelegate: false,
      feedback: {
        correct: "✅ Exactly! This requires teacher observation, understanding of individual students, and professional assessment skills.",
        incorrect: "❌ This needs human expertise! Teachers observe student behavior, engagement, and individual needs that AI can't assess."
      },
      funnyWrong: "AI analyzed typing speed and concluded that slow typers need reading help. Plot twist: some are just careful! ⌨️"
    },
    {
      id: 5,
      category: "Content Creation",
      scenario: "Creating a template email to send to parents about the upcoming science fair.",
      shouldDelegate: true,
      feedback: {
        correct: "✅ Perfect delegation! AI can draft professional communication templates that you can personalize and review.",
        incorrect: "❌ This is ideal for AI! It can create professional communication drafts, saving time for more important work."
      },
      funnyWrong: "Three hours later, you're still trying to decide between 'Dear Parents' and 'Greetings, Guardians'! 📧"
    },
    {
      id: 6,
      category: "Curriculum Planning",
      scenario: "Deciding which novel to teach in 9th grade English based on your specific students' interests and maturity levels.",
      shouldDelegate: false,
      feedback: {
        correct: "✅ Spot on! This requires deep knowledge of your students, community context, and professional curriculum judgment.",
        incorrect: "❌ This needs your expertise! You know your students' backgrounds, interests, and what will engage them effectively."
      },
      funnyWrong: "AI recommended 'War and Peace' because it has the most pages and therefore must be the most educational! 📚"
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      if (groupDecision === null) {
        // Time's up, force a decision or show timeout
        handleTimeUp();
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, groupDecision]);

  const startGame = (): void => {
    setGameState('playing');
    setCurrentScenario(0);
    setTimeLeft(45);
    setTimerActive(true);
    setGroupDecision(null);
    setShowFeedback(false);
    setScore(0);
    setRound(1);
  };

  const makeDecision = (decision: boolean): void => {
    if (groupDecision !== null) return; // Already decided
    
    setGroupDecision(decision);
    setTimerActive(false);
    
    const correct = decision === scenarios[currentScenario].shouldDelegate;
    if (correct) {
      setScore(score + 100);
    }
    
    setTimeout(() => {
      setShowFeedback(true);
    }, 500);
  };

  const handleTimeUp = (): void => {
    setGameState('results');
    setShowFeedback(true);
  };

  const nextScenario = (): void => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setTimeLeft(45);
      setTimerActive(true);
      setGroupDecision(null);
      setShowFeedback(false);
      if (currentScenario === 2) {
        setRound(2);
      }
    } else {
      setGameState('finished');
    }
  };

  const resetGame = (): void => {
    setGameState('setup');
    setCurrentScenario(0);
    setTimeLeft(45);
    setTimerActive(false);
    setGroupDecision(null);
    setScore(0);
    setRound(1);
    setShowFeedback(false);
  };

  const getTimerColor = (): string => {
    if (timeLeft > 30) return 'text-green-600';
    if (timeLeft > 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTimerProgress = (): number => {
    return (timeLeft / 45) * 100;
  };

  if (gameState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white min-h-screen">
        <div className="text-center">
          <div className="bg-blue-500 text-white p-6 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Should I Delegate This?</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">The AI Decision Game for School Leaders</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6 mb-8 max-w-2xl mx-auto">
            <h2 className="font-semibold text-blue-900 mb-4">How to Play:</h2>
            <div className="text-left space-y-3">
              <div className="flex items-center">
                <Timer className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-sm md:text-base">Each scenario has 45 seconds to decide</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-sm md:text-base">Discuss as a group and make your choice</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-sm md:text-base">Earn points for good delegation decisions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-sm md:text-base">Learn from immediate feedback and fun examples</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="bg-blue-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-lg md:text-xl font-semibold hover:bg-blue-600 transition-colors flex items-center mx-auto game-button"
          >
            <Play className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const maxScore = scenarios.length * 100;
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white min-h-screen">
        <div className="text-center">
          <Trophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Game Complete!</h1>
          <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{score} / {maxScore} points</div>
          <div className="text-lg md:text-xl text-gray-600 mb-8">{percentage}% Delegation Accuracy</div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6 mb-8 max-w-2xl mx-auto">
            <h2 className="font-semibold text-green-900 mb-4">Key Delegation Principles:</h2>
            <div className="text-left space-y-2 text-sm md:text-base">
              <p>✅ <strong>Good for AI:</strong> Content generation, variations, drafts, formatting, research</p>
              <p>✅ <strong>Keep Human:</strong> Student assessment, personal decisions, curriculum choices based on your context</p>
              <p>✅ <strong>Remember:</strong> AI is a powerful tool, but professional judgment is irreplaceable</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={resetGame}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center mx-auto"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Play Again
            </button>
            <p className="text-gray-500 text-sm md:text-base">Ready for the next workshop activity?</p>
          </div>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];
  const isCorrect = groupDecision === scenario.shouldDelegate;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white p-3 rounded-lg mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Should I Delegate This?</h1>
            <p className="text-gray-600 text-sm md:text-base">Round {round} • Scenario {currentScenario + 1} of {scenarios.length}</p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <div className="text-xl md:text-2xl font-bold text-blue-600">{score} points</div>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-center mb-4">
          <Clock className={`w-6 h-6 md:w-8 md:h-8 mr-3 ${getTimerColor()}`} />
          <span className={`text-3xl md:text-4xl font-bold ${getTimerColor()}`}>{timeLeft}s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 md:h-4">
          <div 
            className={`h-3 md:h-4 rounded-full timer-progress ${
              timeLeft > 30 ? 'bg-green-500' : 
              timeLeft > 15 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${getTimerProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Scenario */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex items-center mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {scenario.category}
          </span>
        </div>
        <p className="text-lg md:text-xl text-gray-800 leading-relaxed">{scenario.scenario}</p>
      </div>

      {/* Decision Buttons */}
      {!showFeedback && groupDecision === null && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <button
            onClick={() => makeDecision(true)}
            disabled={timeLeft === 0}
            className="bg-green-500 text-white p-6 md:p-8 rounded-lg text-lg md:text-2xl font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 game-button"
          >
            ✅ DELEGATE to AI
          </button>
          <button
            onClick={() => makeDecision(false)}
            disabled={timeLeft === 0}
            className="bg-red-500 text-white p-6 md:p-8 rounded-lg text-lg md:text-2xl font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-300 game-button"
          >
            🙋 Keep HUMAN
          </button>
        </div>
      )}

      {/* Decision Made */}
      {groupDecision !== null && !showFeedback && (
        <div className="text-center mb-6 md:mb-8">
          <div className={`text-2xl md:text-3xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            You chose: {groupDecision ? 'DELEGATE to AI' : 'Keep HUMAN'}
          </div>
          <div className="text-base md:text-lg text-gray-600 mt-2">Revealing results...</div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="space-y-6">
          <div className={`border-l-4 p-4 md:p-6 rounded-lg ${
            isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
          }`}>
            <div className="flex items-center mb-4">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mr-3" />
              ) : (
                <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600 mr-3" />
              )}
              <h3 className="text-lg md:text-xl font-semibold">
                {isCorrect ? 'Correct! +100 points' : 'Not quite right'}
              </h3>
            </div>
            <p className="text-base md:text-lg mb-4">
              {isCorrect ? scenario.feedback.correct : scenario.feedback.incorrect}
            </p>
            {!isCorrect && scenario.funnyWrong && (
              <div className="bg-white p-4 rounded border-l-4 border-yellow-400">
                <p className="text-gray-700 text-sm md:text-base">{scenario.funnyWrong}</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={nextScenario}
              className="bg-blue-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-lg md:text-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              {currentScenario < scenarios.length - 1 ? 'Next Scenario →' : 'See Final Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShouldIDelegateGame;