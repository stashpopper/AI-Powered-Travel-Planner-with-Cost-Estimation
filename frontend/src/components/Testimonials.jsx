import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
}

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Solo Traveler',
    quote: 'I was overwhelmed by planning my first solo trip to Japan. VoyageAgent gave me a perfect week-by-week plan that saved me hours of research and kept me within budget.',
    avatar: 'SC',
    gradient: 'from-indigo-400 to-violet-500',
  },
  {
    name: 'Marcus Rivera',
    role: 'Family Traveler',
    quote: 'Planning a family trip with kids is a nightmare. VoyageAgent suggested kid-friendly spots and realistic timelines. We had an amazing vacation without the stress.',
    avatar: 'MR',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    name: 'Priya Sharma',
    role: 'Digital Nomad',
    quote: 'As someone who travels constantly, I need quick plans that work. VoyageAgent generates detailed itineraries in seconds — it has become my go-to travel companion.',
    avatar: 'PS',
    gradient: 'from-emerald-400 to-teal-500',
  },
]

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-4">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight">
            Loved by travelers worldwide
          </h2>
          <p className="mt-4 text-lg text-surface-600 leading-relaxed">
            Join thousands of happy travelers who plan smarter with VoyageAgent.
          </p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm ring-1 ring-surface-200/80 card-glow"
            >
              {/* Quote mark */}
              <div className={`absolute top-6 right-6 w-10 h-10 rounded-xl bg-gradient-to-br ${t.gradient} opacity-10 flex items-center justify-center`}>
                <span className="text-2xl font-serif text-surface-400">"</span>
              </div>

              {/* Stars */}
              <StarRating />

              {/* Quote */}
              <p className="mt-4 text-sm text-surface-600 leading-relaxed">{t.quote}</p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-xs font-bold text-white`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900">{t.name}</p>
                  <p className="text-xs text-surface-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
