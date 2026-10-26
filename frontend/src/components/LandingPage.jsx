import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sparkles, Heart, Globe, Clock, Wallet,
  ArrowRight, Zap, Shield, Compass, Plane, ChevronDown, Check,
  Users, Tent, Building2, Waves,
} from 'lucide-react'

const EASE = [0.16, 1, 0.3, 1]

function SectionHeading({ eyebrow, title, accent, subtitle, align = 'center' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const alignCls = align === 'left' ? 'text-left items-start' : 'text-center items-center'

  return (
    <div ref={ref} className={`flex flex-col ${alignCls} mb-14 lg:mb-20`}>
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
        className="max-w-2xl text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-surface-900 dark:text-white"
      >
        {title} <span className="text-gradient">{accent}</span>
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          className="mt-5 max-w-xl text-base sm:text-lg text-surface-500 dark:text-surface-400 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  HERO — gradient canvas + live animated SVG route map               */
/* ------------------------------------------------------------------ */

function LiveMapSVG() {
  return (
    <svg viewBox="0 0 520 420" fill="none" className="h-full w-full" aria-hidden="true">
      {/* Dot grid */}
      <defs>
        <pattern id="dotgrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" className="fill-white/10" />
        </pattern>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <rect width="520" height="420" rx="24" fill="url(#dotgrid)" />

      {/* Routes */}
      <path d="M 80 330 C 140 250, 180 240, 250 180 S 380 90, 440 70" stroke="url(#routeGrad)" strokeWidth="2.5" strokeDasharray="6 8" className="animate-draw-path" strokeLinecap="round" />
      <path d="M 80 330 C 160 320, 240 300, 300 250 S 400 170, 440 70" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="5 9" className="animate-draw-path" style={{ animationDelay: '0.8s' }} strokeLinecap="round" />
      <path d="M 80 330 C 120 300, 150 250, 170 210 S 210 130, 250 180" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="4 10" className="animate-draw-path" style={{ animationDelay: '1.6s' }} strokeLinecap="round" />

      {/* Origin hub */}
      <circle cx="80" cy="330" r="10" className="fill-white/15" />
      <circle cx="80" cy="330" r="5" className="fill-white" />
      <circle cx="80" cy="330" r="10" className="stroke-white/60 animate-pulse-dot" strokeWidth="1.5" fill="none" />

      {/* Destination dots */}
      {[
        { x: 250, y: 180, delay: '0s' },
        { x: 440, y: 70, delay: '0.9s' },
        { x: 170, y: 210, delay: '1.7s' },
      ].map((d, i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r="6" className="fill-amber-300/30" />
          <circle cx={d.x} cy={d.y} r="3.5" className="fill-amber-300" />
          <circle cx={d.x} cy={d.y} r="6" className="stroke-amber-300 animate-pulse-dot" style={{ animationDelay: d.delay }} strokeWidth="1.5" fill="none" />
        </g>
      ))}

      {/* Traveling plane along main route (auto-rotates to face direction of travel) */}
      <g>
        <g transform="rotate(90)">
          <path d="M0,-7 L2,-1 L8,2 L8,4 L1.5,2.5 L0.5,6 L-0.5,6 L-1.5,2.5 L-8,4 L-8,2 L-2,-1 Z" className="fill-white drop-shadow-lg" />
        </g>
        <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path="M 80 330 C 140 250, 180 240, 250 180 S 380 90, 440 70" />
      </g>

      {/* City labels */}
      <g className="fill-white/50 text-[11px]" fontFamily="Inter, sans-serif">
        <text x="64" y="356">Home</text>
        <text x="232" y="164">Bali</text>
        <text x="424" y="52">Kyoto</text>
        <text x="150" y="196">Osaka</text>
      </g>
    </svg>
  )
}

function HeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [destination, setDestination] = useState('Bali, Indonesia')
  const [days, setDays] = useState('7')
  const [budget, setBudget] = useState('')

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
      {/* Fine grid + ambient blobs */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 85% 65% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 65% at 50% 40%, black, transparent)',
        }}
      />
      <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-blue-400/25 blur-3xl animate-blob pointer-events-none" />
      <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl animate-blob animation-delay-4000 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-50 dark:from-surface-950 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pt-36 lg:pb-28 w-full">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-12 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-7"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100">AI travel planning, live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] tracking-tight text-white"
            >
              Plan a world-class trip
              <br />
              in{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">30 seconds</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 9 C 60 3, 150 3, 298 8" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" className="animate-draw-path" style={{ strokeDasharray: 320 }} />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.22, duration: 0.7, ease: EASE }}
              className="mt-7 text-base sm:text-lg lg:text-xl text-indigo-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Destination, dates, budget, vibe — that's all we need. VoyageAgent
              builds a complete day-by-day itinerary with real cost estimates.
            </motion.p>

            {/* Interactive prompt bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.34, duration: 0.6, ease: EASE }}
              className="mt-9 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-3 sm:p-4 shadow-2xl shadow-indigo-950/30 max-w-xl mx-auto lg:mx-0"
            >
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-200 pointer-events-none" />
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to?"
                    className="w-full rounded-xl bg-white/10 border border-white/15 pl-10 pr-3 py-3 text-sm font-medium text-white placeholder-indigo-200/60 outline-none transition-colors focus:border-amber-300/60 focus:bg-white/15"
                  />
                </div>
                <div className="flex gap-2.5">
                  <select
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="rounded-xl bg-white/10 border border-white/15 px-3 py-3 text-sm font-medium text-indigo-100 outline-none focus:border-amber-300/60 [&>option]:text-surface-900 cursor-pointer"
                  >
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                  </select>
                  <div className="relative flex-1 sm:flex-none">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-indigo-200/70 pointer-events-none">$</span>
                    <input
                      value={budget}
                      onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))}
                      inputMode="numeric"
                      placeholder="Budget"
                      className="w-full sm:w-24 rounded-xl bg-white/10 border border-white/15 pl-6 pr-2 py-3 text-sm font-medium text-white placeholder-indigo-200/60 outline-none transition-colors focus:border-amber-300/60 focus:bg-white/15"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="hidden sm:flex items-center gap-1.5 text-[11px] text-indigo-200/70">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  We'll prefill your trip for you
                </p>
                <Link to="/planner" state={{ destination, days, budget }} className="ml-auto">
                  <button className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
                    Generate trip
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
              </div>
            </motion.div>

          </div>

          {/* Live map visual */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div className="rounded-3xl border border-white/15 bg-white/[0.07] backdrop-blur-xl p-3 shadow-2xl shadow-indigo-950/40">
              <div className="rounded-2xl overflow-hidden bg-indigo-950/40">
                <LiveMapSVG />
              </div>
            </div>

            {/* Floating cost badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
              className="absolute -right-2 sm:-right-6 bottom-10 flex items-center gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 backdrop-blur-xl px-4 py-3 shadow-2xl shadow-indigo-950/40"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20">
                <Wallet className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/80">Est. total</p>
                <p className="text-base font-bold text-emerald-200">$1,847</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <a href="#features" aria-label="Scroll to features" className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </a>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  LIVE DEMO — tabbed product experience                              */
/* ------------------------------------------------------------------ */

const DEMO_MODES = [
  {
    id: 'beach',
    label: 'Beach escape',
    icon: Waves,
    trip: 'Bali · 7 days · $$ Mid',
    items: [
      { t: 'Day 1', p: 'Ubud — rice terraces & monkey forest', cost: '$184' },
      { t: 'Day 3', p: 'Uluwatu — cliff temple & seafood grill', cost: '$212' },
      { t: 'Day 5', p: 'Nusa Penida — island hop & snorkel', cost: '$296' },
    ],
    total: '$1,847',
    bars: [
      { label: 'Stays', pct: 46, color: 'bg-indigo-500' },
      { label: 'Food', pct: 24, color: 'bg-emerald-500' },
      { label: 'Transit', pct: 18, color: 'bg-amber-500' },
      { label: 'Activities', pct: 12, color: 'bg-pink-500' },
    ],
  },
  {
    id: 'city',
    label: 'City break',
    icon: Building2,
    trip: 'Tokyo · 5 days · $$$ Luxe',
    items: [
      { t: 'Day 1', p: 'Shibuya — crossing, izakaya crawl', cost: '$231' },
      { t: 'Day 3', p: 'TeamLab + Ginza private chef', cost: '$418' },
      { t: 'Day 4', p: 'Day trip: Kamakura & Enoden coast', cost: '$164' },
    ],
    total: '$2,692',
    bars: [
      { label: 'Stays', pct: 52, color: 'bg-indigo-500' },
      { label: 'Food', pct: 26, color: 'bg-emerald-500' },
      { label: 'Transit', pct: 10, color: 'bg-amber-500' },
      { label: 'Activities', pct: 12, color: 'bg-pink-500' },
    ],
  },
  {
    id: 'adventure',
    label: 'Adventure',
    icon: Tent,
    trip: 'Patagonia · 10 days · $$ Mid',
    items: [
      { t: 'Day 2', p: 'Torres del Paine — base trek', cost: '$226' },
      { t: 'Day 5', p: 'Perito Moreno — glacier crossing', cost: '$148' },
      { t: 'Day 8', p: 'Horseback ride + estancia dinner', cost: '$191' },
    ],
    total: '$3,405',
    bars: [
      { label: 'Stays', pct: 38, color: 'bg-indigo-500' },
      { label: 'Food', pct: 18, color: 'bg-emerald-500' },
      { label: 'Transit', pct: 26, color: 'bg-amber-500' },
      { label: 'Activities', pct: 18, color: 'bg-pink-500' },
    ],
  },
]

function LiveDemoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [mode, setMode] = useState(DEMO_MODES[0].id)
  const active = DEMO_MODES.find((m) => m.id === mode) || DEMO_MODES[0]

  return (
    <section id="demo" ref={ref} className="relative overflow-hidden bg-surface-50 dark:bg-surface-950 py-24 lg:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-200/40 dark:from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live preview"
          title="Three vibes,"
          accent="one engine"
          subtitle="Pick a travel style — watch the itinerary and budget rebuild themselves. This is exactly what the planner generates for you."
        />

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* Left: sticky controls + copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:col-span-2 lg:sticky lg:top-28"
          >
            <div className="flex lg:flex-col gap-2.5">
              {DEMO_MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`group flex items-center gap-3.5 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                    mode === m.id
                      ? 'border-indigo-300 dark:border-indigo-500/50 bg-white dark:bg-surface-900 shadow-premium'
                      : 'border-surface-200/80 dark:border-surface-800/60 bg-white/60 dark:bg-surface-900/40 hover:border-indigo-200 dark:hover:border-indigo-500/30'
                  }`}
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                    mode === m.id ? 'bg-indigo-600 text-white' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'
                  }`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-surface-900 dark:text-white">{m.label}</p>
                    <p className="text-xs text-surface-400 dark:text-surface-500">{m.trip}</p>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-all ${mode === m.id ? 'text-indigo-500' : 'text-surface-300 dark:text-surface-600 group-hover:translate-x-0.5'}`} />
                </button>
              ))}
            </div>

            <div className="mt-8 hidden lg:block rounded-2xl border border-indigo-200/60 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/5 p-5">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                <Sparkles className="w-4 h-4" /> What you get
              </p>
              <ul className="mt-3 space-y-2">
                {['Day-by-day schedule', 'Real cost estimates', 'Local picks & timing', 'Optimized routing'].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: live result card */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-3xl border border-surface-200/80 dark:border-surface-800/60 bg-white dark:bg-surface-900 shadow-premium-lg overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-surface-100 dark:border-surface-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-xs font-semibold text-surface-400 dark:text-surface-500">{active.trip}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Generated
                </span>
              </div>

              <div className="p-6">
                {/* Itinerary rows */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <div className="space-y-3">
                      {active.items.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 + i * 0.08, duration: 0.4, ease: EASE }}
                          className="flex items-center gap-4 rounded-xl border border-surface-100 dark:border-surface-800 bg-surface-50/60 dark:bg-surface-950/40 p-4"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
                            <Compass className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">{item.t}</p>
                            <p className="truncate text-sm font-medium text-surface-800 dark:text-surface-200">{item.p}</p>
                          </div>
                          <span className="shrink-0 font-mono text-sm font-bold text-surface-600 dark:text-surface-300">{item.cost}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Budget bars */}
                    <div className="mt-5 rounded-xl border border-surface-100 dark:border-surface-800 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500">Budget breakdown</p>
                        <p className="text-base font-extrabold text-surface-900 dark:text-white">{active.total}</p>
                      </div>
                      <div className="flex h-2.5 gap-1 overflow-hidden rounded-full">
                        {active.bars.map((b) => (
                          <motion.div
                            key={b.label}
                            initial={{ width: 0 }}
                            animate={{ width: `${b.pct}%` }}
                            transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
                            className={`h-full ${b.color}`}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                        {active.bars.map((b) => (
                          <span key={b.label} className="flex items-center gap-1.5 text-[11px] text-surface-500 dark:text-surface-400">
                            <span className={`h-2 w-2 rounded-full ${b.color}`} /> {b.label} · {b.pct}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FEATURES — sticky two-column with numbered rows                    */
/* ------------------------------------------------------------------ */

function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const features = [
    {
      n: '01',
      title: 'AI-powered itineraries',
      desc: 'Your preferences, budget and timing become a sequenced day-by-day plan — with local timing windows built in.',
      icon: Sparkles,
      tint: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300',
    },
    {
      n: '02',
      title: 'Smart budget tracking',
      desc: 'Real-time cost estimates for stays, food and transit — rebalanced automatically to your target.',
      icon: Wallet,
      tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300',
    },
    {
      n: '03',
      title: 'Time optimization',
      desc: 'AI routing kills dead mileage between stops. More trip, less transfer.',
      icon: Clock,
      tint: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300',
    },
    {
      n: '04',
      title: 'Curated experiences',
      desc: 'Hidden gems and local favorites the algorithms of big booking sites miss.',
      icon: MapPin,
      tint: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-300',
    },
    {
      n: '05',
      title: 'Safety first',
      desc: 'Travel advisories and alerts folded into the plan, so you know before you go.',
      icon: Shield,
      tint: 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300',
    },
    {
      n: '06',
      title: 'Instant results',
      desc: 'A complete, bookable plan in under 30 seconds. No spreadsheet, no tab overload.',
      icon: Zap,
      tint: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300',
    },
  ]

  return (
    <section id="features" ref={ref} className="relative bg-surface-100 dark:bg-surface-900/50 py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* Sticky left */}
          <div className="lg:sticky lg:top-28">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300"
            >
              <Sparkles className="w-3.5 h-3.5" /> Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
              className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-surface-900 dark:text-white"
            >
              Everything for the
              <br />
              <span className="text-gradient">perfect trip.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
              className="mt-5 text-base sm:text-lg text-surface-500 dark:text-surface-400 leading-relaxed max-w-md"
            >
              Six capabilities, one promise: your trip gets planned better and
              faster than any spreadsheet ever could.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
              className="mt-8 hidden lg:flex items-center gap-3 rounded-2xl border border-surface-200/80 dark:border-surface-800/60 bg-white dark:bg-surface-900 p-4 shadow-sm max-w-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-surface-900 dark:text-white">Ready when you are</p>
                <p className="text-xs text-surface-400 dark:text-surface-500">Free · No card · 30 seconds</p>
              </div>
            </motion.div>
          </div>

          {/* Right: feature rows */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: EASE }}
                whileHover={{ x: 6 }}
                className="group relative flex items-start gap-5 rounded-2xl border border-surface-200/80 dark:border-surface-800/60 bg-white dark:bg-surface-900 p-6 transition-all duration-300 hover:shadow-premium hover:border-indigo-200 dark:hover:border-indigo-500/30"
              >
                <span className="absolute right-6 top-5 text-xs font-mono font-bold text-surface-200 dark:text-surface-700 group-hover:text-indigo-300 dark:group-hover:text-indigo-500/70 transition-colors">{f.n}</span>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${f.tint} transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-surface-500 dark:text-surface-400">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  HOW IT WORKS — vertical timeline                                   */
/* ------------------------------------------------------------------ */

function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const steps = [
    {
      title: 'Tell us your vibe',
      desc: 'Destination, dates, budget, pace. A sentence or a paragraph — we adapt to whatever you give us.',
      icon: Users,
      tag: 'Input · 30 seconds',
    },
    {
      title: 'AI does the deep work',
      desc: 'Thousands of routing, timing and cost patterns, matched to your preferences while you grab a coffee.',
      icon: Compass,
      tag: 'Engine · under 30 seconds',
    },
    {
      title: 'Land with a plan',
      desc: 'A day-by-day itinerary with costs, addresses and local recommendations. Ready to go — adjust anything.',
      icon: Plane,
      tag: 'Output · your trip',
    },
  ]

  return (
    <section id="how-it-works" ref={ref} className="relative bg-surface-50 dark:bg-surface-950 py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-violet-200/40 dark:from-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps."
          accent="Zero spreadsheet."
          subtitle="No more 40 open tabs and a dying spreadsheet. Here's the whole process."
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-400 via-violet-400 to-amber-400 opacity-40" />

          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.18, duration: 0.6, ease: EASE }}
                className="relative flex gap-6 pl-0"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-premium">
                  <s.icon className="w-5 h-5 text-white" />
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-amber-950">{i + 1}</span>
                </div>
                <div className="group flex-1 rounded-2xl border border-surface-200/80 dark:border-surface-800/60 bg-white dark:bg-surface-900 p-6 transition-all duration-300 hover:shadow-premium hover:border-indigo-200 dark:hover:border-indigo-500/30">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white">{s.title}</h3>
                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">{s.tag}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-surface-500 dark:text-surface-400">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
          className="mt-14 text-center"
        >
          <Link to="/planner">
            <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-premium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium-lg">
              Try it now — it's free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */

function FaqSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [open, setOpen] = useState(0)

  const faqs = [
    {
      q: 'How accurate are the cost estimates?',
      a: 'Each plan breaks down stay, food, transit and activities using current per-destination pricing. You get a total and a line-by-line split, so you can adjust any line before you book. Treat it as a planning baseline, not a quote.',
    },
    {
      q: 'Do I need an account to plan a trip?',
      a: 'No. You can generate a full itinerary without signing up. If you want to save or share a plan later, that is the only time we ask you to create one.',
    },
    {
      q: 'Can I change the plan after it is generated?',
      a: 'Yes. Swap days, add a destination, or tighten the budget and regenerate in seconds. The itinerary is a starting point, and every field is editable.',
    },
    {
      q: 'How long does it take to get a plan?',
      a: 'Most plans generate in under 30 seconds. Complex multi-city trips with many preferences can take a little longer, but you will see the process in real time.',
    },
    {
      q: 'Is there a free tier?',
      a: 'Planning is free to use. You only pay if you choose features like saved trips, collaboration, or priority generation.',
    },
  ]

  return (
    <section id="faq" ref={ref} className="relative bg-surface-100 dark:bg-surface-900/50 py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Good questions."
          accent="Straight answers."
          subtitle="Everything you need to know before you start planning."
        />

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: EASE }}
                className={`rounded-2xl border bg-white dark:bg-surface-900 transition-colors duration-300 ${isOpen ? 'border-indigo-300 dark:border-indigo-500/40 shadow-premium' : 'border-surface-200/80 dark:border-surface-800/60'}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-surface-900 dark:text-white">{f.q}</span>
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? 'rotate-45 border-indigo-300 dark:border-indigo-500/40 text-indigo-500 dark:text-indigo-300' : 'border-surface-200 dark:border-surface-700 text-surface-400'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" /></svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-surface-500 dark:text-surface-400">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */

function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative bg-surface-50 dark:bg-surface-950 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-6 py-16 sm:px-12 lg:px-20 lg:py-24 shadow-premium-lg"
        >
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />
          <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-blue-400/25 blur-3xl animate-blob pointer-events-none" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-10 top-10 hidden lg:block"
          >
            <Plane className="w-16 h-16 text-white/10 -rotate-12" />
          </motion.div>

          <div className="relative text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-7 text-xs font-semibold uppercase tracking-wider text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Start planning today
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Ready to plan your next{' '}
              <span className="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent">adventure?</span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-indigo-100/90 leading-relaxed max-w-xl mx-auto">
              Your perfect trip is one prompt away. Free to plan, no credit
              card, done before your coffee cools.
            </p>

            <div className="mt-9">
              <Link to="/planner">
                <button className="group inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 text-lg font-bold text-indigo-700 shadow-2xl shadow-indigo-950/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-indigo-950/60">
                  <Plane className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  Plan my trip — it's free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {['No credit card required', 'AI-powered planning', 'Ready in 30 seconds'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-sm text-indigo-100/80">
                  <Check className="w-4 h-4 text-emerald-300" /> {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

function LandingPage() {
  return (
    <div className="bg-surface-50 dark:bg-surface-950">
      <HeroSection />
      <LiveDemoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <CTASection />
    </div>
  )
}

export default LandingPage
