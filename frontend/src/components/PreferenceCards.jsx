import { motion } from 'framer-motion'
import { Heart, Mountain, Utensils, Camera, Waves, Tent, BookOpen, Music, Sun, Snowflake } from 'lucide-react'

const preferences = [
  { key: 'beach', label: 'Beach & Ocean', icon: Waves, color: 'cyan', bg: 'bg-cyan-50 dark:bg-cyan-950/30', iconBg: 'bg-cyan-100 dark:bg-cyan-900/50', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-500', shadow: 'shadow-cyan-500/10' },
  { key: 'mountains', label: 'Mountains & Hiking', icon: Mountain, color: 'emerald', bg: 'bg-emerald-50 dark:bg-emerald-950/30', iconBg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500', shadow: 'shadow-emerald-500/10' },
  { key: 'food', label: 'Food & Cuisine', icon: Utensils, color: 'amber', bg: 'bg-amber-50 dark:bg-amber-950/30', iconBg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500', shadow: 'shadow-amber-500/10' },
  { key: 'culture', label: 'Culture & History', icon: BookOpen, color: 'violet', bg: 'bg-violet-50 dark:bg-violet-950/30', iconBg: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-500', shadow: 'shadow-violet-500/10' },
  { key: 'adventure', label: 'Adventure', icon: Tent, color: 'red', bg: 'bg-red-50 dark:bg-red-950/30', iconBg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-400', ring: 'ring-red-500', shadow: 'shadow-red-500/10' },
  { key: 'nightlife', label: 'Nightlife', icon: Music, color: 'pink', bg: 'bg-pink-50 dark:bg-pink-950/30', iconBg: 'bg-pink-100 dark:bg-pink-900/50', text: 'text-pink-600 dark:text-pink-400', ring: 'ring-pink-500', shadow: 'shadow-pink-500/10' },
  { key: 'photography', label: 'Photography', icon: Camera, color: 'indigo', bg: 'bg-indigo-50 dark:bg-indigo-950/30', iconBg: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-600 dark:text-indigo-400', ring: 'ring-indigo-500', shadow: 'shadow-indigo-500/10' },
  { key: 'romance', label: 'Romance & Relax', icon: Heart, color: 'rose', bg: 'bg-rose-50 dark:bg-rose-950/30', iconBg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500', shadow: 'shadow-rose-500/10' },
  { key: 'nature', label: 'Nature & Wildlife', icon: Sun, color: 'lime', bg: 'bg-lime-50 dark:bg-lime-950/30', iconBg: 'bg-lime-100 dark:bg-lime-900/50', text: 'text-lime-600 dark:text-lime-400', ring: 'ring-lime-500', shadow: 'shadow-lime-500/10' },
  { key: 'winter', label: 'Snow & Winter', icon: Snowflake, color: 'sky', bg: 'bg-sky-50 dark:bg-sky-950/30', iconBg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-500', shadow: 'shadow-sky-500/10' },
]

function PreferenceCards({ selectedPreferences = [], onSelect, loading }) {
  const togglePreference = (key) => {
    if (loading) return
    const isSelected = selectedPreferences.includes(key)
    const updated = isSelected
      ? selectedPreferences.filter((p) => p !== key)
      : [...selectedPreferences, key]
    onSelect(updated)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-white">What's your travel style?</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Pick what you're into — or leave it blank and let the AI surprise you.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {preferences.map((pref) => {
          const isSelected = selectedPreferences.includes(pref.key)
          return (
            <motion.button
              key={pref.key}
              type="button"
              onClick={() => togglePreference(pref.key)}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group rounded-2xl p-6 text-left transition-all duration-300 ${
                isSelected
                  ? `ring-2 ${pref.ring} ${pref.bg} shadow-lg ${pref.shadow}`
                  : 'bg-white dark:bg-surface-800/80 border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 hover:shadow-lg hover:shadow-surface-100/50 dark:hover:shadow-surface-900/50'
              } disabled:opacity-60`}
            >
              {/* Icon */}
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-all duration-300 ${
                isSelected
                  ? `${pref.iconBg} ${pref.text} shadow-sm`
                  : `${pref.bg} ${pref.text} group-hover:shadow-sm`
              }`}>
                <pref.icon className="w-6 h-6" />
              </div>

              {/* Label */}
              <span className={`block text-base font-semibold leading-relaxed ${
                isSelected
                  ? `${pref.text}`
                  : 'text-surface-700 dark:text-surface-200 group-hover:text-surface-900 dark:group-hover:text-white'
              }`}>
                {pref.label}
              </span>

              {/* Selected check */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3 right-3"
                >
                  <div className={`w-6 h-6 rounded-full ${pref.iconBg} flex items-center justify-center`}>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {selectedPreferences.length > 0 && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
        >
          <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {selectedPreferences.length} preference{selectedPreferences.length !== 1 ? 's' : ''} selected
        </motion.p>
      )}
    </div>
  )
}

export default PreferenceCards
