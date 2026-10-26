import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
}

const stats = [
  { value: '12K+', label: 'Trips Planned' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '150+', label: 'Destinations Covered' },
  { value: '4.9★', label: 'Average Rating' },
]

function SocialProof() {
  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Subtle gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent" />

      <motion.div
        variants={fadeIn}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className="text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-surface-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default SocialProof
