import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sparkles, MapPin, Heart, Globe, Clock, Wallet, Star,
  ArrowRight, Zap, Shield, Compass, Plane, ChevronDown, Check,
} from 'lucide-react'

function HeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Animated blobs */}
      <div className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-10 sm:-right-20 w-56 sm:w-80 h-56 sm:h-80 bg-violet-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Floating elements */}
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-20 right-[15%]">
        <Plane className="w-12 h-12 text-white/10 rotate-[-15deg]" />
      </motion.div>
      <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1 }} className="absolute bottom-32 left-[10%]">
        <Compass className="w-10 h-10 text-white/10" />
      </motion.div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center overflow-x-hidden">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100">AI-Powered Travel Planning</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white mb-6"
            >
              Your Dream Trip,
              <br />
              <span className="bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">Designed by AI</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-lg sm:text-xl text-indigo-100 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Tell us where you want to go, what you love, and how long you'll be. We'll craft a detailed, budget-friendly itinerary — in seconds.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <Link to="/planner">
                <button className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg shadow-indigo-900/30 transition-all hover:shadow-xl hover:-translate-y-0.5">
                  Start Planning Your Trip
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20">
                See How It Works
                <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-gradient-to-br from-blue-400 to-violet-500" />
                <div className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-gradient-to-br from-amber-400 to-orange-500" />
                <div className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-gradient-to-br from-emerald-400 to-teal-500" />
                <div className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-gradient-to-br from-pink-400 to-rose-500" />
                <div className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-gradient-to-br from-cyan-400 to-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">12,000+ trips planned</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-indigo-200 ml-1">4.9/5</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Product Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main glass card */}
            <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-indigo-200 font-medium ml-2">Your Trip — Bali, 7 Days</span>
              </div>

              {/* AI typing indicator */}
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-4 h-4 text-blue-300 animate-spin-slow" />
                <span className="text-xs text-indigo-200">AI is generating your itinerary...</span>
              </div>

              {/* Itinerary items */}
              <div className="space-y-3">
                {[
                  { day: 'Day 1', location: 'Ubud — Rice Terraces & Monkey Forest', time: '9:00 AM' },
                  { day: 'Day 2', location: 'Seminyak — Beach Clubs & Sunset', time: '6:30 PM' },
                  { day: 'Day 3', location: 'Uluwatu — Temple & Cliff Dining', time: '5:00 PM' },
                  { day: 'Day 4', location: 'Canggu — Surf & Cafés', time: '10:00 AM' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.2 + 0.6 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-400/20 flex items-center justify-center flex-shrink-0">
                      <Plane className="w-4 h-4 text-blue-200" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-blue-200">{item.day}</p>
                      <p className="text-sm text-white truncate">{item.location}</p>
                    </div>
                    <span className="ml-auto text-xs text-indigo-300 flex-shrink-0">{item.time}</span>
                  </motion.div>
                ))}
              </div>

              {/* Cost badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.4 }}
                className="mt-4 flex items-center justify-between p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20"
              >
                <span className="text-sm font-medium text-emerald-200">Total estimated cost</span>
                <span className="text-lg font-bold text-emerald-300">$1,847</span>
              </motion.div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg flex items-center justify-center"
            >
              <Plane className="w-5 h-5 sm:w-7 sm:h-7 text-white -rotate-12" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg flex items-center justify-center"
            >
              <span className="text-xs sm:text-sm font-bold text-white">$</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-white/30" />
      </motion.div>
    </section>
  )
}

// Stats Section
function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const stats = [
    { value: '12K+', label: 'Trips Planned', icon: Plane },
    { value: '98%', label: 'Satisfaction Rate', icon: Heart },
    { value: '150+', label: 'Destinations', icon: Globe },
    { value: '4.9', label: 'Average Rating', icon: Star },
  ]

  return (
    <section ref={ref} className="relative py-20 bg-gradient-to-b from-indigo-600 to-indigo-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 text-white/50 mx-auto mb-3" />
              <p className="text-4xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-indigo-100 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const features = [
    {
      title: 'AI-Powered Itineraries',
      description: 'Our AI analyzes your preferences, budget, and timing to create personalized day-by-day travel plans.',
      icon: Sparkles,
      gradient: 'from-indigo-500 to-violet-600',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      number: '01',
    },
    {
      title: 'Smart Budget Tracking',
      description: 'Get real-time cost estimates for travel, food, and accommodation that adapt to your budget.',
      icon: Wallet,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      number: '02',
    },
    {
      title: 'Time Optimization',
      description: 'Minimize travel time between attractions with AI-optimized routing and scheduling.',
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      number: '03',
    },
    {
      title: 'Curated Experiences',
      description: 'Discover hidden gems and local favorites you would never find on your own.',
      icon: MapPin,
      gradient: 'from-pink-500 to-rose-600',
      bgLight: 'bg-pink-50 dark:bg-pink-950/40',
      iconColor: 'text-pink-600 dark:text-pink-400',
      number: '04',
    },
    {
      title: 'Safety First',
      description: 'Built-in safety alerts and travel advisories keep you informed wherever you go.',
      icon: Shield,
      gradient: 'from-sky-500 to-blue-600',
      bgLight: 'bg-sky-50 dark:bg-sky-950/40',
      iconColor: 'text-sky-600 dark:text-sky-400',
      number: '05',
    },
    {
      title: 'Instant Results',
      description: 'Get your complete travel plan in under 30 seconds — no waiting, no planning stress.',
      icon: Zap,
      gradient: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50 dark:bg-violet-950/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
      number: '06',
    },
  ]

  return (
    <section id="features" ref={ref} className="relative py-24 lg:py-32 bg-surface-50 dark:bg-surface-950 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-100/40 dark:from-indigo-950/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white tracking-tight"
          >
            Everything you need for the
            <span className="text-gradient"> perfect trip</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-lg text-surface-500 dark:text-surface-400 leading-relaxed"
          >
            From AI-powered planning to budget tracking, VoyageAgent has every tool you need to travel smarter.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 + 0.35, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl bg-white dark:bg-surface-900 shadow-sm ring-1 ring-surface-200/80 dark:ring-surface-800/50 p-7 lg:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-950/30 hover:ring-indigo-200/60 dark:hover:ring-indigo-800/40"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-2xl`} />

              {/* Number badge */}
              <div className="absolute top-6 right-7 text-[11px] font-mono font-bold text-surface-200 dark:text-surface-800 tracking-widest group-hover:text-surface-300 dark:group-hover:text-surface-700 transition-colors">
                {feature.number}
              </div>

              {/* Icon container */}
              <div className={`relative z-10 inline-flex items-center justify-center w-[52px] h-[52px] rounded-2xl ${feature.bgLight} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const steps = [
    {
      title: 'Tell Us Your Vibe',
      description: 'Share your destination, travel style, and budget. The more details, the better — but we work with whatever you give us.',
      icon: Sparkles,
      gradient: 'from-indigo-500 to-violet-600',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      number: '01',
    },
    {
      title: 'AI Does the Magic',
      description: 'Our AI analyzes your preferences against thousands of travel patterns to craft an optimized itinerary.',
      icon: Compass,
      gradient: 'from-violet-500 to-purple-600',
      bgLight: 'bg-violet-50 dark:bg-violet-950/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
      number: '02',
    },
    {
      title: 'Get Your Trip',
      description: 'Receive a detailed, day-by-day travel plan with costs, activities, and local recommendations — ready to go.',
      icon: Sparkles,
      gradient: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      number: '03',
    },
  ]

  return (
    <section id="how-it-works" ref={ref} className="relative py-24 lg:py-32 bg-surface-50 dark:bg-surface-950 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-100/40 dark:from-violet-950/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 dark:border-violet-800/50 bg-violet-50 dark:bg-violet-950/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-6 backdrop-blur-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white tracking-tight"
          >
            Three steps to your
            <span className="text-gradient-warm"> dream trip</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-lg text-surface-500 dark:text-surface-400 leading-relaxed"
          >
            No more hours of research and planning. Get a complete travel itinerary in under a minute.
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[68px] left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-300 via-violet-300 to-amber-300 dark:from-indigo-600 dark:via-violet-600 dark:to-amber-600" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 + 0.35, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl bg-white dark:bg-surface-900 shadow-sm ring-1 ring-surface-200/80 dark:ring-surface-800/50 p-7 lg:p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-violet-100/50 dark:hover:shadow-violet-950/30 hover:ring-violet-200/60 dark:hover:ring-violet-800/40"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-2xl`} />

              {/* Number badge */}
              <div className="absolute top-5 right-6 text-[11px] font-mono font-bold text-surface-200 dark:text-surface-800 tracking-widest group-hover:text-surface-300 dark:group-hover:text-surface-700 transition-colors">
                {step.number}
              </div>

              {/* Icon container */}
              <div className={`relative z-10 mx-auto w-[52px] h-[52px] rounded-2xl ${step.bgLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`w-6 h-6 ${step.iconColor}`} />
              </div>

              {/* Step label */}
              <p className={`relative z-10 text-xs font-bold uppercase tracking-widest ${step.iconColor} mb-3`}>
                Step {step.number}
              </p>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Link to="/planner">
            <button className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-200/50 dark:shadow-indigo-950/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300/50 dark:hover:shadow-indigo-900/40">
              <span className="relative z-10">Try It Now — It's Free</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Solo Traveler',
      quote: 'I was overwhelmed by planning my first solo trip to Japan. VoyageAgent gave me a perfect week-by-week plan that saved me hours of research.',
      avatar: 'SC',
      gradient: 'from-blue-400 to-violet-500',
    },
    {
      name: 'Marcus Rivera',
      role: 'Family Traveler',
      quote: 'Planning a family trip with kids is a nightmare. VoyageAgent suggested kid-friendly spots and realistic timelines. We had an amazing vacation.',
      avatar: 'MR',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      name: 'Priya Sharma',
      role: 'Digital Nomad',
      quote: 'As someone who travels constantly, I need quick plans that work. VoyageAgent generates detailed itineraries in seconds.',
      avatar: 'PS',
      gradient: 'from-emerald-400 to-teal-500',
    },
  ]

  return (
    <section id="testimonials" ref={ref} className="relative py-24 lg:py-32 bg-surface-50 dark:bg-surface-950 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-amber-100/40 dark:from-amber-950/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-6 backdrop-blur-sm"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white tracking-tight"
          >
            Loved by travelers
            <span className="text-gradient-warm"> worldwide</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-lg text-surface-500 dark:text-surface-400 leading-relaxed"
          >
            Join thousands of happy travelers who plan smarter with VoyageAgent.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 + 0.35, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl bg-white dark:bg-surface-900/80 shadow-sm ring-1 ring-surface-200/80 dark:ring-surface-800/60 p-7 lg:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-amber-100/50 dark:hover:shadow-amber-950/20 hover:ring-amber-200/60 dark:hover:ring-amber-800/40"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-2xl`} />

              {/* Quote mark */}
              <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <span className="text-xl font-serif text-white">"</span>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-[18px] h-[18px] fill-amber-400 text-amber-400 dark:drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]" />
                ))}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <p className="text-[15px] text-surface-700 dark:text-surface-200 leading-relaxed mb-7">
                  {t.quote}
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-surface-100 dark:border-surface-800/80">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white/20 dark:ring-surface-900/50`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{t.role}</p>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${t.gradient} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="relative py-24 bg-surface-50 dark:bg-surface-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 lg:p-20"
        >
          {/* Animated blobs */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />

          <div className="relative text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">Start Planning Today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              Ready to plan your next
              <span className="text-gradient"> adventure?</span>
            </h2>

            <p className="text-lg text-surface-100 max-w-xl mx-auto mb-10 leading-relaxed">
              Join 12,000+ travelers who have used VoyageAgent to plan smarter. Your perfect trip is just one click away.
            </p>

            <Link to="/planner">
              <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl">
                <Plane className="w-5 h-5" />
                Plan My Trip — It's Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-surface-200">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI-powered planning
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main Landing Page
function LandingPage() {
  return (
    <div className="bg-surface-50">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}

export default LandingPage
