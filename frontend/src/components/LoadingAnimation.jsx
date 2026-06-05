import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Sparkles, MapPin, Clock, Wallet } from 'lucide-react'

const loadingMessages = [
  { text: "Analyzing your preferences...", icon: Sparkles },
  { text: "Researching destinations...", icon: MapPin },
  { text: "Optimizing your route...", icon: Compass },
  { text: "Calculating costs...", icon: Wallet },
  { text: "Almost ready...", icon: Clock },
]

function LoadingAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 2000)

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev
        return prev + 1
      })
    }, 150)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [])

  const current = loadingMessages[currentIndex]

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-surface-900 shadow-2xl shadow-slate-200/60 dark:shadow-slate-950/60 ring-1 ring-surface-200/60 dark:ring-surface-800/60 p-8 sm:p-12 lg:p-16 text-center max-w-lg mx-auto">
      {/* Animated compass */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/50 dark:to-violet-950/50 flex items-center justify-center mb-8 shadow-lg shadow-indigo-100/50 dark:shadow-indigo-950/50"
      >
        <Compass className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
      </motion.div>

      {/* Loading message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <current.icon className="w-6 h-6 text-indigo-500 dark:text-indigo-400 animate-pulse" />
          <span className="text-xl font-bold text-surface-900 dark:text-white">{current.text}</span>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="max-w-sm mx-auto mb-4">
        <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
        <p className="text-xs text-surface-400 dark:text-surface-500 mt-2 font-medium">{progress}% complete</p>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-500"
          />
        ))}
      </div>

      {/* Tip */}
      <motion.p
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-surface-400 dark:text-surface-500 flex items-center justify-center gap-1.5"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        {currentIndex % 2 === 0
          ? "More preferences = more personalized results"
          : "Finding the best spots for you"}
      </motion.p>
    </div>
  )
}

export default LoadingAnimation
