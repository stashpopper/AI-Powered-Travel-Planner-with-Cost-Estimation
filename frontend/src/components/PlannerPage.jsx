import { useState, useMemo } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import JourneyWizard from './JourneyWizard'
import LoadingAnimation from './LoadingAnimation'
import ItineraryResults from './ItineraryResults'

function PlannerPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [step, setStep] = useState(0)

  const apiUrl = useMemo(() => {
    const envUrl = typeof import.meta !== "undefined" ? import.meta.env?.VITE_API_URL : undefined
    const normalizedBase = envUrl?.trim().replace(/\/$/, "")
    if (normalizedBase) return `${normalizedBase}/app/api/v1/travel/plan`
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      return "https://ai-powered-travel-planner-with-cost.vercel.app/app/api/v1/travel/plan"
    }
    return "http://localhost:8000/app/api/v1/travel/plan"
  }, [])

  const handleSubmit = async (payload) => {
    setLoading(true)
    setError(null)
    setStep(1)
    setData(null)
    setSelectedPlan(null)

    try {
      const res = await axios.post(apiUrl, payload)
      setData(res.data)
      if (res.data?.error?.detail) {
        const stage = res.data.error.stage ? `[${res.data.error.stage}] ` : ""
        setError(`${stage}${res.data.error.detail}`)
        setStep(0)
      } else {
        setStep(2)
      }
    } catch {
      setError("Something went wrong. Please try again.")
      setData({ recommended_plan: "", plans: [] })
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setData(null)
    setSelectedPlan(null)
    setError(null)
    setStep(0)
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Heading above card */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/50 px-3 py-1 mb-4"
                >
                  <SparklesIcon className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">AI-Powered</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white tracking-tight"
                >
                  Plan your perfect trip
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-2 text-sm text-surface-500 dark:text-surface-400"
                >
                  Tell us where you want to go and what you love.
                </motion.p>
              </div>

              <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-surface-900 shadow-lg shadow-surface-200/50 dark:shadow-surface-950/50 ring-1 ring-surface-200/60 dark:ring-surface-800/60 overflow-hidden">
                <JourneyWizard onSubmit={handleSubmit} loading={loading} />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <LoadingAnimation />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {error ? (
                <div className="rounded-2xl sm:rounded-3xl bg-white dark:bg-surface-900 shadow-xl ring-1 ring-red-200/80 dark:ring-red-900/50 p-10 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-5">
                    <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Something went wrong</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">{error}</p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-950/50 transition-all hover:-translate-y-0.5"
                  >
                    Try Again
                  </button>
                </div>
              ) : data ? (
                <ItineraryResults
                  data={data}
                  selectedPlan={selectedPlan}
                  onSelect={setSelectedPlan}
                  onBack={() => setSelectedPlan(null)}
                  onNewPlan={handleReset}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SparklesIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  )
}

export default PlannerPage
