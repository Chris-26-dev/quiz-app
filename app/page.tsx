"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QuizResult from "@/components/QuizResult";

interface Question {
  id: number;
  type: "radio" | "checkbox" | "text";
  question: string;
  choices?: string[];
}

type AnswerValue = number | number[] | string;
type AnswersRecord = Record<number, AnswerValue>;

interface GradeResponse {
  score: number;
  error?: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswersRecord>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [started, setStarted] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const fetchQuiz = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setScore(null);
    setAnswers({});
    setCurrentIndex(0);

    try {
      const res = await fetch(`${API_URL}/api/quiz`);
      if (!res.ok) throw new Error("Failed to fetch quiz");

      const data: Question[] = await res.json();
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
      setTimeLeft(15);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (!started || score !== null || loading) return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, score, loading]);

  const handleAnswerChange = (id: number, value: AnswerValue): void => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = (): void => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(15);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const payload = {
        answers: Object.entries(answers).map(([id, value]) => ({
          id: Number(id),
          value,
        })),
        questions,
      };

      const res = await fetch(`${API_URL}/api/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: GradeResponse = await res.json();
      if (res.ok) setScore(data.score);
      else setError(data.error || "Failed to grade quiz");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred";
      setError(message);
    }
  };

  const handleTryAgain = (): void => {
    fetchQuiz();
  };

  // ------------------------------
  // ✨ Loading screen
  // ------------------------------
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#0f0f23] to-[#1a1a2e] text-center text-gray-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mb-6"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-light text-gray-400"
        >
          Preparing your quiz...
        </motion.p>
      </div>
    );

  // ------------------------------
  // ❌ Error screen
  // ------------------------------
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#0f0f23] to-[#1a1a2e] text-gray-200 text-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1e1e2e] rounded-2xl p-8 max-w-md border border-red-500/20 shadow-2xl"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTryAgain}
            className="bg-linear-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );

  // ------------------------------
  // 🎯 Start Quiz screen
  // ------------------------------
  if (!started)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#0f0f23] to-[#1a1a2e] text-gray-200 text-center p-6">
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Main Title */}
          <h1 className="text-6xl font-bold mb-6 bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Tech Quiz
          </h1>

          {/* Subtitle */}
          <p className="text-xl mb-12 text-gray-300 max-w-md mx-auto">
            Challenge your technical knowledge and test your skills under pressure!
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Timer Feature */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-[#1e1e2e] p-6 rounded-2xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="text-3xl mb-3">⏱️</div>
              <h3 className="font-semibold text-cyan-400 mb-2">15 Second Timer</h3>
              <p className="text-sm text-gray-400">
                Each question has a 15-second time limit. Think fast!
              </p>
            </motion.div>

            {/* Question Types */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1e1e2e] p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
            >
              <div className="text-3xl mb-3">📝</div>
              <h3 className="font-semibold text-blue-400 mb-2">Multiple Formats</h3>
              <p className="text-sm text-gray-400">
                Multiple choice, checkboxes, and text questions to test different skills
              </p>
            </motion.div>

            {/* Progress Tracking */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-[#1e1e2e] p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-purple-400 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-400">
                Get your score immediately
              </p>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-[#1e1e2e] rounded-2xl p-6 mb-8 border border-gray-700/50"
          >
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">12</div>
                <div className="text-sm text-gray-400">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">15s</div>
                <div className="text-sm text-gray-400">Per Question</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">3</div>
                <div className="text-sm text-gray-400">Question Types</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">165s</div>
                <div className="text-sm text-gray-400">Total Time</div>
              </div>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-[#1e1e2e] rounded-2xl p-6 mb-8 border border-gray-700/50"
          >
            <h3 className="font-semibold text-white mb-4 text-lg">How it works:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <p>Answer each question within 15 seconds</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <p>Multiple choice: Select one correct answer</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <p>Checkboxes: Select all that apply</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                <p>Text questions: Type your answer</p>
              </div>
            </div>
          </motion.div>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setTimeLeft(15);
              setStarted(true);
            }}
            className="bg-linear-to-r from-cyan-500 to-blue-600 text-white px-16 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 shadow-lg shadow-cyan-500/25"
          >
            Start Quiz Now 🚀
          </motion.button>

          {/* Quick Tip */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 text-sm text-gray-500"
          >
            ⚡ Quick tip: The timer turns red when you have less than 5 seconds!
          </motion.p>
        </motion.div>
      </div>
    );

  // ------------------------------
  // 🎉 Score screen
  // ------------------------------
  if (score !== null)
    return (
      <QuizResult
        score={score}
        total={questions.length}
        onTryAgain={handleTryAgain}
      />
    );


  // ------------------------------
  // 🧠 Question display
  // ------------------------------
  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-[#0f0f23] to-[#1a1a2e] p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e1e2e] rounded-3xl p-8 border border-gray-700/50 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2"
            >
              Knowledge Quiz
            </motion.h1>
            <p className="text-gray-400">Test your technical skills</p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {currentIndex + 1}
              </div>
              <span className="text-gray-400">
                of <strong className="text-white">{questions.length}</strong>{" "}
                questions
              </span>
            </div>

            <motion.div
              key={timeLeft}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full ${timeLeft <= 5
                ? "bg-red-500/20 text-red-400"
                : "bg-blue-500/20 text-blue-400"
                }`}
            >
              <span>⏱</span>
              <span className="font-bold">{timeLeft}s</span>
            </motion.div>
          </div>

          <div className="w-full bg-gray-700/50 rounded-full h-2 mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-2 rounded-full bg-linear-to-r from-cyan-500 to-blue-500"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
                {q.question}
              </h2>

              <div className="space-y-3">
                {q.type === "radio" &&
                  q.choices?.map((choice, i) => (
                    <motion.label
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center p-4 bg-[#2a2a3e] rounded-xl cursor-pointer border-2 border-transparent hover:border-cyan-500/30 transition-all duration-200"
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={choice}
                        checked={answers[q.id] === choice}
                        onChange={() => handleAnswerChange(q.id, choice)}
                        className="mr-4 w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                      />
                      <span className="text-gray-200">{choice}</span>
                    </motion.label>
                  ))}

                {q.type === "checkbox" &&
                  q.choices?.map((choice, i) => {
                    const currentValue = answers[q.id];
                    const selected = Array.isArray(currentValue)
                      ? currentValue.includes(i)
                      : false;
                    return (
                      <motion.label
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center p-4 bg-[#2a2a3e] rounded-xl cursor-pointer border-2 border-transparent hover:border-cyan-500/30 transition-all duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const prev = Array.isArray(currentValue) ? currentValue : [];
                            handleAnswerChange(
                              q.id,
                              e.target.checked
                                ? [...prev, i]
                                : prev.filter((v) => v !== i)
                            );
                          }}
                          className="mr-4 w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                        />
                        <span className="text-gray-200">{choice}</span>
                      </motion.label>
                    );
                  })}

                {q.type === "text" && (
                  <motion.input
                    key={q.id}
                    type="text"
                    placeholder="Type your answer..."
                    value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full p-4 bg-[#2a2a3e] text-gray-200 rounded-xl border-2 border-transparent 
               focus:border-cyan-500/50 outline-none transition-all duration-200
               placeholder-gray-500"
                    whileFocus={{ scale: 1.01 }}
                  />
                )}

              </div>

            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="bg-linear-to-r from-cyan-500 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 min-w-[200px]"
            >
              {currentIndex === questions.length - 1 ? (
                <span>Submit Quiz 🚀</span>
              ) : (
                <span>Next Question →</span>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
