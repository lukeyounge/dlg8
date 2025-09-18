'use client'

import React, { useState, useEffect, useCallback } from 'react';
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
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState === 'playing' && !showFeedback && groupDecision === null && timeLeft > 0) {
        if (e.key === 'ArrowLeft' || e.key === '1') {
          makeDecision(true); // Delegate to AI
        } else if (e.key === 'ArrowRight' || e.key === '2') {
          makeDecision(false); // Keep human
        }
      } else if (showFeedback && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        nextScenario();
      } else if (gameState === 'finished' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, showFeedback, groupDecision, timeLeft, currentScenario]);

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

  const makeDecision = useCallback((decision: boolean): void => {
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
  }, [groupDecision, scenarios, currentScenario, score]);

  const handleTimeUp = (): void => {
    setGameState('results');
    setShowFeedback(true);
  };

  const nextScenario = useCallback((): void => {
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
  }, [currentScenario, scenarios.length]);

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

  // Swipe detection for navigation
  const handleTouchStart = (e: React.TouchEvent): void => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50 && Math.abs(distanceY) < 100;
    const isRightSwipe = distanceX < -50 && Math.abs(distanceY) < 100;
    const isDownSwipe = distanceY < -50 && Math.abs(distanceX) < 100;

    if (gameState === 'playing' && showFeedback && isLeftSwipe) {
      nextScenario();
    } else if (gameState === 'finished' && isDownSwipe) {
      resetGame();
    } else if (isRightSwipe && currentScenario > 0 && !timerActive) {
      // Could add previous scenario navigation if needed
    }
  };

  if (gameState === 'setup') {
    return (
      <main className="max-w-6xl mx-auto p-6 md:p-8 min-h-screen" role="main">
        <header className="text-center animate-fade-in">
          <div className="card w-28 h-28 md:w-32 md:h-32 flex items-center justify-center mx-auto mb-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <Users className="w-14 h-14 md:w-16 md:h-16 text-blue-600" />
          </div>
          <h1 className="text-display text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-slide-in" style={{ animationDelay: '0.2s' }}>Should I Delegate This?</h1>
          <p className="text-title text-xl md:text-2xl text-neutral-600 mb-12 animate-slide-in" style={{ animationDelay: '0.3s' }}>The AI Decision Experience for School Leaders</p>
          
          <div className="card-elevated p-8 md:p-10 mb-12 max-w-3xl mx-auto animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-title text-2xl text-neutral-800 mb-6 text-center">How This Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-title text-lg text-neutral-800 mb-1">Thoughtful Timing</h3>
                  <p className="text-body text-neutral-600">Consider each scenario with your team</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-title text-lg text-neutral-800 mb-1">Collaborative Choice</h3>
                  <p className="text-body text-neutral-600">Discuss and decide together</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-title text-lg text-neutral-800 mb-1">Build Understanding</h3>
                  <p className="text-body text-neutral-600">Learn delegation principles</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-title text-lg text-neutral-800 mb-1">Immediate Insights</h3>
                  <p className="text-body text-neutral-600">Get expert feedback instantly</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 max-w-lg mx-auto mb-8 animate-slide-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-title text-lg text-neutral-800 mb-4 text-center">Navigation Options</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-body text-neutral-600">Touch & Swipe</div>
                <div className="text-xs text-neutral-500 mt-1">Natural iPad gestures</div>
              </div>
              <div className="text-center">
                <div className="text-body text-neutral-600">Keyboard</div>
                <div className="text-xs text-neutral-500 mt-1">← → or 1 2 keys</div>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="btn-primary text-white px-12 py-4 text-xl font-semibold flex items-center mx-auto touch-target btn-large animate-slide-in"
            style={{ animationDelay: '0.6s' }}
            aria-label="Start the AI delegation decision experience"
          >
            <Play className="w-6 h-6 mr-3" />
            Begin Experience
          </button>
        </header>
      </main>
    );
  }

  if (gameState === 'finished') {
    const maxScore = scenarios.length * 100;
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-8 min-h-screen">
        <div className="text-center animate-fade-in">
          <div className="card w-24 h-24 md:w-28 md:h-28 flex items-center justify-center mx-auto mb-8 animate-slide-in">
            <Trophy className="w-12 h-12 md:w-14 md:h-14 text-amber-500" />
          </div>
          <h1 className="text-display text-4xl md:text-5xl mb-6 text-neutral-800 animate-slide-in" style={{ animationDelay: '0.1s' }}>Experience Complete!</h1>
          <div className="card-elevated p-8 mb-8 max-w-md mx-auto animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{score}</div>
            <div className="text-lg text-neutral-600 mb-1">out of {maxScore} points</div>
            <div className="text-2xl font-semibold text-neutral-800">{percentage}% Accuracy</div>
          </div>
          
          <div className="card-elevated p-8 md:p-10 mb-12 max-w-4xl mx-auto animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-title text-2xl text-neutral-800 mb-8 text-center">Key Delegation Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-title text-lg text-neutral-800 mb-2">Ideal for AI</h3>
                <p className="text-body text-neutral-600">Content generation, variations, drafts, formatting, and research tasks</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-title text-lg text-neutral-800 mb-2">Keep Human</h3>
                <p className="text-body text-neutral-600">Student assessment, personal decisions, context-specific choices</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-title text-lg text-neutral-800 mb-2">Remember</h3>
                <p className="text-body text-neutral-600">AI amplifies human judgment—it doesn&apos;t replace professional expertise</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={resetGame}
              className="btn-primary text-white px-8 py-4 text-lg font-semibold flex items-center mx-auto touch-target"
              aria-label="Start the experience again from the beginning"
            >
              <RotateCcw className="w-5 h-5 mr-3" />
              Experience Again
            </button>
            <p className="text-body text-neutral-500">Ready for your next workshop activity?</p>
          </div>
        </div>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];
  const isCorrect = groupDecision === scenario.shouldDelegate;

  return (
    <main 
      className="max-w-6xl mx-auto p-6 md:p-8 min-h-screen landscape-split portrait-stack"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="main"
      aria-live="polite"
    >
      {/* Header */}
      <div className="card-elevated p-6 mb-8 animate-slide-in">
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center">
            <div className="card w-14 h-14 flex items-center justify-center mr-4">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-title text-2xl md:text-3xl text-neutral-800">Should I Delegate This?</h1>
              <p className="text-body text-neutral-600">Round {round} • Scenario {currentScenario + 1} of {scenarios.length}</p>
            </div>
          </div>
          <div className="text-center lg:text-right">
            <div className="card p-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{score}</div>
              <div className="text-sm text-neutral-600">points</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="card-elevated p-6 mb-8 animate-fade-in">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-4 ${
              timeLeft > 30 ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 
              timeLeft > 15 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-red-400 to-rose-500'
            }`}>
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className={`text-4xl md:text-5xl font-bold ${
                timeLeft > 30 ? 'text-green-600' : 
                timeLeft > 15 ? 'text-amber-600' : 'text-red-600'
              }`}>{timeLeft}</div>
              <div className="text-sm text-neutral-600">seconds</div>
            </div>
          </div>
          <div className="text-body text-neutral-600 mb-4">Take your time to discuss and decide</div>
        </div>
        <div className="relative w-full bg-neutral-200 rounded-full h-4 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={45} aria-valuenow={timeLeft} aria-label={`${timeLeft} seconds remaining`}>
          <div 
            className="progress-bar h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${getTimerProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Scenario */}
      <div className="card-elevated p-8 md:p-10 mb-8 animate-slide-in">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl">
            <span className="text-sm font-medium">{scenario.category}</span>
          </div>
        </div>
        <div className="max-w-4xl">
          <p id="scenario-description" className="text-body text-xl md:text-2xl text-neutral-700 leading-relaxed" role="main">{scenario.scenario}</p>
        </div>
      </div>

      {/* Decision Buttons */}
      {!showFeedback && groupDecision === null && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 animate-slide-in">
          <button
            onClick={() => makeDecision(true)}
            disabled={timeLeft === 0}
            className="btn-success text-white p-8 md:p-10 text-xl md:text-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed touch-target btn-large group relative overflow-hidden"
            aria-label="Choose to delegate this task to AI assistant"
            aria-describedby="scenario-description"
          >
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm opacity-90">DELEGATE TO</div>
                <div className="text-2xl font-bold">AI Assistant</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => makeDecision(false)}
            disabled={timeLeft === 0}
            className="btn-error text-white p-8 md:p-10 text-xl md:text-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed touch-target btn-large group relative overflow-hidden"
            aria-label="Choose to keep this task with human experts"
            aria-describedby="scenario-description"
          >
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-sm opacity-90">KEEP WITH</div>
                <div className="text-2xl font-bold">Human Expert</div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Decision Made */}
      {groupDecision !== null && !showFeedback && (
        <div className="card-elevated p-8 text-center mb-8 animate-fade-in">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
            isCorrect ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-rose-500'
          }`}>
            {isCorrect ? <CheckCircle className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
          </div>
          <div className="text-title text-2xl md:text-3xl text-neutral-800 mb-2">
            You chose: {groupDecision ? 'AI Assistant' : 'Human Expert'}
          </div>
          <div className="text-body text-neutral-600 animate-pulse">Preparing your feedback...</div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="space-y-8 animate-slide-in">
          <div className="card-elevated p-8 md:p-10">
            <div className="flex items-center mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-4 ${
                isCorrect ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-rose-500'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-title text-2xl md:text-3xl text-neutral-800">
                  {isCorrect ? 'Excellent Choice!' : 'Learning Opportunity'}
                </h3>
                <p className={`text-lg ${
                  isCorrect ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {isCorrect ? '+100 points earned' : 'Consider this insight'}
                </p>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-2xl mb-6">
              <p className="text-body text-lg md:text-xl text-neutral-700 leading-relaxed">
                {isCorrect ? scenario.feedback.correct : scenario.feedback.incorrect}
              </p>
            </div>
            
            {!isCorrect && scenario.funnyWrong && (
              <div className="card p-6 border-l-4 border-amber-400">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-lg">💭</span>
                  </div>
                  <div>
                    <h4 className="text-title text-lg text-neutral-800 mb-2">What might happen instead?</h4>
                    <p className="text-body text-neutral-700">{scenario.funnyWrong}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={nextScenario}
              className="btn-primary text-white px-10 py-4 text-xl font-semibold touch-target"
              aria-label={currentScenario < scenarios.length - 1 ? 'Continue to next scenario' : 'View final results and summary'}
            >
              {currentScenario < scenarios.length - 1 ? (
                <span className="flex items-center">
                  Continue Journey
                  <span className="ml-2 text-2xl">→</span>
                </span>
              ) : (
                <span className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  View Results
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ShouldIDelegateGame;