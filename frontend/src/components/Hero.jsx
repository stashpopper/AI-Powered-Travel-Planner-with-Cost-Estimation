import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Compass, Sparkles, ChevronRight, ArrowRight } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const staggerChildren = {
  whileInView: { transition: { staggerChildren: 0.15 } }
}

function Hero() {
  const [hovered, setHovered] = useState(false)
  const [typingText, setTypingText] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [showCost, setShowCost] = useState(false)
  const [costAnimating, setCostAnimating] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  const typingMessages = [
    'Analyzing your preferences...',
    'Finding the best routes...',
    'Calculating costs...',
    'Building your itinerary...',
  ]

  const itineraryCycles = [
    [
      { day: 'Day 1', location: 'Ubud — Rice Terraces & Monkey Forest', time: '9:00 AM', icon: '🏞️' },
      { day: 'Day 2', location: 'Seminyak — Beach Clubs & Sunset', time: '6:30 PM', icon: '🏖️' },
      { day: 'Day 3', location: 'Uluwatu — Temple & Cliff Dining', time: '5:00 PM', icon: '🛕' },
      { day: 'Day 4', location: 'Canggu — Surf & Cafés', time: '10:00 AM', icon: '🏄' },
    ],
    [
      { day: 'Day 1', location: 'Paris — Eiffel Tower & Louvre', time: '10:00 AM', icon: '🗼' },
      { day: 'Day 2', location: 'Rome — Colosseum & Vatican City', time: '2:00 PM', icon: '🏛️' },
      { day: 'Day 3', location: 'Barcelona — Sagrada Familia & Gothic Quarter', time: '11:00 AM', icon: '⛪' },
      { day: 'Day 4', location: 'London — Big Ben & Tower Bridge', time: '3:00 PM', icon: '🎡' },
    ],
    [
      { day: 'Day 1', location: 'Tokyo — Shibuya & Senso-ji Temple', time: '8:00 AM', icon: '🗼' },
      { day: 'Day 2', location: 'Kyoto — Fushimi Inari & Bamboo Grove', time: '10:00 AM', icon: '⛩️' },
      { day: 'Day 3', location: 'Osaka — Dotonbori & Osaka Castle', time: '1:00 PM', icon: '🏰' },
      { day: 'Day 4', location: 'Hiroshima — Peace Memorial Park', time: '9:00 AM', icon: '🕊️' },
    ],
  ]

  const costs = ['$1,847', '$2,156', '$1,923']

  useEffect(() => {
    if (!isLanding) return

    // Typing animation loop
    let currentTextIndex = 0
    let currentCharIndex = 0
    let isDeleting = false

    const typeInterval = setInterval(() => {
      const currentText = typingMessages[currentTextIndex]

      if (!isDeleting) {
        setTypingText(currentText.substring(0, currentCharIndex + 1))
        currentCharIndex++

        if (currentCharIndex === currentText.length) {
          isDeleting = true
          setTimeout(() => {
            currentTextIndex = (currentTextIndex + 1) % typingMessages.length
            isDeleting = false
            currentCharIndex = 0
          }, 1500)
        }
      } else {
        setTypingText(currentText.substring(0, currentCharIndex - 1))
        currentCharIndex--

        if (currentCharIndex === 0) {
          isDeleting = false
          currentTextIndex = (currentTextIndex + 1) % typingMessages.length
        }
      }
    }, 60)

    // Step animation loop - each step is ~3.5 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1
        if (next >= itineraryCycles.length * 2) return 0 // 2 cycles per destination
        return next
      })
    }, 3500)

    return () => {
      clearInterval(typeInterval)
      clearInterval(stepInterval)
    }
  }, [isLanding])

  // Cost animation when step changes
  useEffect(() => {
    if (!isLanding) return
    const timer = setTimeout(() => {
      setShowCost(true)
      setCostAnimating(true)
      setTimeout(() => setCostAnimating(false), 1000)
    }, 2000)
    return () => clearTimeout(timer)
  }, [currentStep, isLanding])

  const currentCycleIndex = Math.floor(currentStep / 2) % itineraryCycles.length
  const currentItems = itineraryCycles[currentCycleIndex]
  const currentCost = costs[currentCycleIndex]

  const getAnimatedCost = () => {
    if (!costAnimating) return currentCost
    const digits = currentCost.replace(/[^0-9]/g, '')
    return digits.split('').map((d, i) => (
      <motion.span
        key={i}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: i * 0.05, duration: 0.3 }}
      >
        {d}
      </motion.span>
    ))
  }

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

      {/* Animated blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text */}
          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">AI-Powered Travel Planning</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
              Your Perfect Trip,
              <br />
              <span className="text-gradient bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300">
                Designed by AI
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-surface-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Tell us where you want to go, what you love, and how long you'll be. We'll craft a detailed, budget-friendly itinerary — in seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link to="/planner">
                <button
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  Start Planning Your Trip
                  <ArrowRight className={`w-4 h-4 transition-transform ${hovered ? 'translate-x-1' : ''}`} />
                </button>
              </Link>
              <a href="#how-it-works">
                <button className="inline-flex items-center gap-2 rounded-full border border-surface-700 bg-white/5 px-8 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10">
                  See How It Works
                </button>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-surface-900 bg-gradient-to-br from-indigo-400 to-violet-500" />
                <div className="w-8 h-8 rounded-full border-2 border-surface-900 bg-gradient-to-br from-amber-400 to-orange-500" />
                <div className="w-8 h-8 rounded-full border-2 border-surface-900 bg-gradient-to-br from-emerald-400 to-teal-500" />
                <div className="w-8 h-8 rounded-full border-2 border-surface-900 bg-gradient-to-br from-pink-400 to-rose-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">12,000+ trips planned</p>
                <p className="text-xs text-surface-400">and counting</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Product Visual */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glass card */}
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-surface-400 font-medium ml-2">Your Trip — Bali, 7 Days</span>
              </div>

              {/* AI typing indicator */}
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 text-indigo-400"
                >
                  <Compass className="w-4 h-4" />
                </motion.div>
                <span className="text-xs text-surface-400">
                  AI is generating your itinerary...
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block w-1 h-3 bg-indigo-400 ml-1 align-middle"
                  />
                </span>
              </div>

              {/* Typing text */}
              <div className="h-5 mb-4 flex items-center">
                <AnimatePresence mode="wait">
                  {typingText && (
                    <motion.p
                      key={typingText}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-indigo-400 font-medium"
                    >
                      → {typingText}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4"
              >
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    key={currentStep}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Itinerary items - cycling destinations */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCycleIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-3"
                >
                  {currentItems.map((item, i) => (
                    <motion.div
                      key={`${currentCycleIndex}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.4 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-base">{item.icon}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-indigo-300">{item.day}</p>
                        <p className="text-sm text-white truncate">{item.location}</p>
                      </div>
                      <span className="text-xs text-surface-500 flex-shrink-0">{item.time}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Cost badge - cycling through destinations */}
              <AnimatePresence>
                {showCost && (
                  <motion.div
                    key={currentCost}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="mt-4 flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  >
                    <span className="text-sm font-medium text-emerald-300">Total estimated cost</span>
                    <motion.span
                      className="text-lg font-bold text-emerald-400"
                    >
                      {getAnimatedCost()}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative corner */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-br-xl bg-gradient-to-bl from-indigo-500/30 to-transparent" />
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg flex items-center justify-center"
            >
              <Plane className="w-7 h-7 text-white -rotate-12" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-3 -right-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg flex items-center justify-center"
            >
              <span className="text-sm font-bold text-white">$</span>
            </motion.div>

            {/* Floating particles */}
            <motion.div
              animate={{ y: [0, -15, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 -right-8 w-2 h-2 rounded-full bg-indigo-400/60"
            />
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -left-6 w-1.5 h-1.5 rounded-full bg-amber-400/60"
            />
            <motion.div
              animate={{ y: [0, -12, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/4 -right-6 w-2 h-2 rounded-full bg-violet-400/60"
            />

            {/* Orbiting dots */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-full h-full"
              >
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400/40 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-amber-400/40 -translate-x-1/2 translate-y-1/2" />
                <div className="absolute left-0 top-1/2 w-1.5 h-1.5 rounded-full bg-violet-400/40 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute right-0 top-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400/40 translate-x-1/2 -translate-y-1/2" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
