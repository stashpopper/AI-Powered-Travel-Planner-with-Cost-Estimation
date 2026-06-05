import { motion } from 'framer-motion'
import { MapPin, Wallet, Clock, Heart, Shield, Zap } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const features = [
  {
    title: 'AI-Powered Itineraries',
    description: 'Our AI analyzes your preferences, budget, and timing to create personalized day-by-day travel plans.',
    icon: SparklesIcon,
    gradient: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    span: 'md:col-span-2',
  },
  {
    title: 'Smart Budget Tracking',
    description: 'Get real-time cost estimates for travel, food, and accommodation that adapt to your budget.',
    icon: WalletIcon,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    span: '',
  },
  {
    title: 'Time Optimization',
    description: 'Minimize travel time between attractions with AI-optimized routing and scheduling.',
    icon: ClockIcon,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    span: '',
  },
  {
    title: 'Curated Experiences',
    description: 'Discover hidden gems and local favorites you would never find on your own.',
    icon: HeartIcon,
    gradient: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    span: '',
  },
  {
    title: 'Safety First',
    description: 'Built-in safety alerts and travel advisories keep you informed wherever you go.',
    icon: ShieldIcon,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    span: '',
  },
  {
    title: 'Instant Results',
    description: 'Get your complete travel plan in under 30 seconds — no waiting, no planning stress.',
    icon: ZapIcon,
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    span: 'md:col-span-2',
  },
]

function SparklesIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  )
}

function WalletIcon() {
  return <Wallet className="w-6 h-6" />
}

function ClockIcon() {
  return <Clock className="w-6 h-6" />
}

function HeartIcon() {
  return <Heart className="w-6 h-6" />
}

function ShieldIcon() {
  return <Shield className="w-6 h-6" />
}

function ZapIcon() {
  return <Zap className="w-6 h-6" />
}

function BentoGrid() {
  return (
    <section id="features" className="py-24 bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight">
            Everything you need for the perfect trip
          </h2>
          <p className="mt-4 text-lg text-surface-600 leading-relaxed">
            From AI-powered planning to budget tracking, VoyageAgent has every tool you need to travel smarter.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group relative rounded-2xl overflow-hidden ${feature.span}`}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

              <div className="relative h-full p-6 lg:p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-5`}>
                  <feature.icon className={`w-6 h-6 text-${feature.gradient.split(' ')[0].replace('from-', '')}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{feature.description}</p>
              </div>

              {/* Decorative corner */}
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-gradient-to-br ${feature.gradient} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BentoGrid
