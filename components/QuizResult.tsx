"use client";

import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface QuizResultProps {
  score: number;
  total: number;
  onTryAgain: () => void;
}

export default function QuizResult({ score, total, onTryAgain }: QuizResultProps) {
  const { width, height } = useWindowSize();
  const percentage = (score / total) * 100;

  let message = "";
  let messageColor = "text-gray-400";
  let emoji = "✅";

  if (percentage === 100) {
    message = "Perfect score! 🏆 You're a tech wizard!";
    messageColor = "text-green-400";
    emoji = "🎉";
  } else if (percentage >= 75) {
    message = "Great job! ✨ Almost perfect!";
    messageColor = "text-cyan-400";
  } else if (percentage >= 50) {
    message = "Not bad! Keep practicing! ⚡";
    messageColor = "text-yellow-400";
  } else if (percentage > 0) {
    message = "You can do better! 😅 Try again!";
    messageColor = "text-orange-400";
  } else {
    message = "Oops! 0 points 😢 Better luck next time!";
    messageColor = "text-red-400";
    emoji = "💀";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-[#0f0f23] to-[#1a1a2e] text-gray-200 text-center p-6 relative">
      {percentage === 100 && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-[#1e1e2e] rounded-2xl p-12 max-w-md border shadow-2xl ${percentage === 0 ? "border-red-500/20" : "border-green-500/20"}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-6"
        >
          {emoji}
        </motion.div>

        <h2 className={`text-3xl font-bold mb-4 ${messageColor}`}>Quiz Complete!</h2>

        <div className="text-4xl font-bold text-white mb-2">
          {score} <span className="text-gray-400 text-xl">/ {total}</span>
        </div>

        <p className={`text-lg mb-8 ${messageColor}`}>{message}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTryAgain}
          className="bg-linear-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 w-full"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
