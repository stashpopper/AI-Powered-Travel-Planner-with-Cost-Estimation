import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Plane, Sparkles, Compass } from 'lucide-react'

function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 lg:p-20"
        >
          {/* Background blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          <div className="relative text-center max-w-2xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Start Planning Today</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
              Ready to plan your next adventure?
            </h2>

            {/* Subheadline */}
            <p className="text-lg text-surface-300 max-w-xl mx-auto mb-10 leading-relaxed">
              Join 12,000+ travelers who have used VoyageAgent to plan smarter. Your perfect trip is just one click away.
            </p>

            {/* CTA */}
            <Link to="/planner">
              <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-500/30 transition-all hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                <Plane className="w-5 h-5" />
                Plan My Trip — It's Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>

            {/* Trust signals */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-surface-400">
              <span className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
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

export default CTASection
