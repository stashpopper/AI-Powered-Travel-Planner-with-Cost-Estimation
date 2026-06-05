import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PenLine, Wand2, Sparkles, MapPin, Clock, Wallet } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const steps = [
  {
    step: '01',
    title: 'Tell Us Your Vibe',
    description: 'Share your destination, travel style, and budget. The more details, the better — but we work with whatever you give us.',
    icon: PenLine,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    step: '02',
    title: 'AI Does the Magic',
    description: 'Our AI analyzes your preferences against thousands of travel patterns to craft an optimized itinerary.',
    icon: Wand2,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    step: '03',
    title: 'Get Your Trip',
    description: 'Receive a detailed, day-by-day travel plan with costs, activities, and local recommendations — ready to go.',
    icon: Sparkles,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-600 mb-4">
            <Wand2 className="w-3.5 h-3.5" />
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight">
            Three steps to your dream trip
          </h2>
          <p className="mt-4 text-lg text-surface-600 leading-relaxed">
            No more hours of research and planning. Get a complete travel itinerary in under a minute.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-px bg-gradient-to-r from-indigo-200 via-violet-200 to-amber-200" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative text-center"
            >
              {/* Step number circle */}
              <div className={`relative z-10 mx-auto w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center mb-6 border border-surface-100 shadow-sm`}>
                <step.icon className={`w-7 h-7 ${step.color}`} />
              </div>

              {/* Step number */}
              <p className={`text-xs font-bold uppercase tracking-widest ${step.color} mb-2`}>Step {step.step}</p>

              <h3 className="text-xl font-semibold text-surface-900 mb-3">{step.title}</h3>
              <p className="text-sm text-surface-600 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link to="/planner">
            <button className="group inline-flex items-center gap-2 rounded-full bg-surface-900 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-surface-900/20 transition-all hover:bg-surface-800 hover:-translate-y-0.5 hover:shadow-xl">
              Try It Now — It's Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
