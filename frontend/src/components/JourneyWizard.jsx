import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DestinationPicker from './DestinationPicker'
import PreferenceCards from './PreferenceCards'
import TripDetails from './TripDetails'

const steps = [
  { key: 'destination', label: 'Where to', icon: '🌍' },
  { key: 'preferences', label: 'Your Vibe', icon: '✨' },
  { key: 'details', label: 'Trip Details', icon: '📋' },
]

function JourneyWizard({ onSubmit, loading = false }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    preferences: [],
    days: 3,
    budget: '',
  })

  const stepData = {
    destination: (data) => setFormData({ ...data }),
    preferences: (data) => setFormData({ ...formData, ...data }),
    details: (data) => setFormData({ ...formData, ...data }),
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.destination.trim() !== ''
      case 1: return formData.preferences.length > 0
      case 2: return Number(formData.days) >= 1
      default: return false
    }
  }

  const handleNext = () => {
    if (canProceed()) {
      if (currentStep === steps.length - 1) {
        handleSubmit()
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    const payload = {
      origin: formData.origin.trim(),
      destination: formData.destination.trim(),
      preferences: formData.preferences,
      days: Number(formData.days),
      budget: formData.budget === '' ? null : Number(formData.budget),
    }
    await onSubmit(payload)
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="p-6 sm:p-8 lg:p-12">
      {/* Step Header */}
      <div className="mb-8">
        <motion.p
          key={`step-label-${currentStep}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2"
        >
          Step {currentStep + 1} of {steps.length}
        </motion.p>
        <motion.h2
          key={`step-title-${currentStep}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white"
        >
          {currentStepData.label}
        </motion.h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-5">
          {steps.map((step, i) => {
            const isCompleted = i < currentStep
            const isActive = i === currentStep
            const isPending = i > currentStep

            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                {/* Step circle */}
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 flex-shrink-0 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/50'
                    : isActive
                      ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/50 ring-4 ring-indigo-100/50 dark:ring-indigo-950/50'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </div>

                {/* Label (desktop) */}
                <span className={`ml-3 text-sm font-semibold hidden sm:block transition-colors ${
                  isActive ? 'text-surface-900 dark:text-white' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400 dark:text-surface-500'
                }`}>
                  {step.label}
                </span>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 transition-colors">
                    <div className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                        : 'bg-surface-200 dark:bg-surface-700'
                    }`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress fill bar */}
        <div className="h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[300px]"
        >
          {currentStep === 0 && (
            <DestinationPicker formData={formData} onChange={stepData.destination} loading={loading} />
          )}
          {currentStep === 1 && (
            <PreferenceCards selectedPreferences={formData.preferences} onSelect={(prefs) => setFormData({ ...formData, preferences: prefs })} loading={loading} />
          )}
          {currentStep === 2 && (
            <TripDetails formData={formData} onChange={stepData.details} loading={loading} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="mt-10 flex items-center justify-between pt-6 border-t border-surface-100 dark:border-surface-800">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-surface-200 dark:border-surface-700 px-6 py-3 text-sm font-semibold text-surface-600 dark:text-surface-300 transition-all hover:bg-surface-50 dark:hover:bg-surface-800 hover:border-surface-300 dark:hover:border-surface-600 disabled:opacity-60"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={handleNext}
          disabled={loading || !canProceed()}
          className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-950/50 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300/50 dark:hover:shadow-indigo-900/40 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg"
        >
          {currentStep === steps.length - 1 ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate My Trip'
              )}
            </>
          ) : (
            <>
              Continue
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default JourneyWizard
