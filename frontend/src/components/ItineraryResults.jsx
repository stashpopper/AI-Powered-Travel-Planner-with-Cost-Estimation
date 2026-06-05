import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, DollarSign, MapPin, Star, Check, ChevronDown, Train, Utensils, Bed, ShoppingBag, Wallet } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
}

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

const categoryColors = {
  transport: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-300", iconBg: "bg-blue-100 dark:bg-blue-900/50", icon: "text-blue-600 dark:text-blue-400" },
  stay: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-700 dark:text-purple-300", iconBg: "bg-purple-100 dark:bg-purple-900/50", icon: "text-purple-600 dark:text-purple-400" },
  food: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-300", iconBg: "bg-amber-100 dark:bg-amber-900/50", icon: "text-amber-600 dark:text-amber-400" },
  misc: { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-700 dark:text-rose-300", iconBg: "bg-rose-100 dark:bg-rose-900/50", icon: "text-rose-600 dark:text-rose-400" },
}

function ItineraryResults({ data, selectedPlan, onSelect, onBack, onNewPlan }) {
  const [showCostBreakdown, setShowCostBreakdown] = useState(false)
  const recommended = data.recommended_plan || ""
  const totalPlans = data.plans?.length || 0
  const maxTotalCost = Math.max(...(data.plans?.map(p => p.total_cost) || [1]), 1)

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div variants={fadeIn} initial="initial" animate="animate" className="flex items-center justify-between">
        <button
          type="button"
          onClick={onNewPlan}
          className="inline-flex items-center gap-2 rounded-full border border-surface-200 dark:border-surface-700 px-5 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 transition-all hover:bg-white dark:hover:bg-surface-800 hover:shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          New Plan
        </button>

        {totalPlans > 1 && (
          <div className="flex items-center gap-3">
            <div className="h-5 w-px bg-surface-200 dark:bg-surface-700" />
            <span className="text-sm text-surface-500 dark:text-surface-400">
              <span className="font-semibold text-surface-800 dark:text-white">{totalPlans}</span> plans found
            </span>
          </div>
        )}
      </motion.div>

      {/* Recommended plan highlight */}
      {recommended && (
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">AI's Top Recommendation</p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{recommended}</p>
          </div>
        </motion.div>
      )}

      {/* Plan Cards */}
      {selectedPlan ? (
        <ItineraryDetail plan={selectedPlan} onBack={onBack} showCostBreakdown={showCostBreakdown} onToggleCost={() => setShowCostBreakdown(!showCostBreakdown)} />
      ) : (
        <motion.div variants={staggerChildren} initial="initial" animate="animate" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.plans && data.plans.length > 0 ? (
            data.plans.map((plan, i) => {
              const isRecommended = plan.title === recommended
              const costPercent = (plan.total_cost / maxTotalCost) * 100

              return (
                <motion.div
                  key={plan.title}
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: i * 0.1 }}
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    isRecommended
                      ? 'ring-2 ring-emerald-400/80 shadow-lg shadow-emerald-100/80 dark:shadow-emerald-900/30'
                      : 'shadow-md ring-1 ring-surface-200/80 dark:ring-surface-700/80 hover:shadow-lg'
                  }`}
                  onClick={() => onSelect(plan)}
                >
                  {isRecommended && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        <Star className="w-3 h-3 fill-white" />
                        Best Pick
                      </span>
                    </div>
                  )}

                  {/* Top accent bar */}
                  <div className={`h-1.5 w-full ${isRecommended ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-indigo-400 to-violet-500'}`} />

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1.5 pr-20">{plan.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">{plan.summary}</p>

                    {/* Total Cost */}
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-surface-900 dark:text-white">{formatCurrency(plan.total_cost, plan.currency)}</span>
                      <span className="text-sm text-surface-400 dark:text-surface-500">total</span>
                    </div>

                    {/* Visual cost comparison bar */}
                    <div className="mt-3 h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${isRecommended ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-indigo-400 to-violet-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${costPercent}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 + 0.3, ease: "easeOut" }}
                      />
                    </div>

                    {/* Quick stats row */}
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="text-center rounded-xl bg-surface-50 dark:bg-surface-800/80 p-3 border border-surface-100 dark:border-surface-700/50">
                        <Train className={`w-4 h-4 mx-auto mb-1 ${categoryColors.transport.icon}`} />
                        <p className="text-[10px] uppercase tracking-wider text-surface-400 dark:text-surface-500 font-medium">Travel</p>
                        <p className="text-xs font-bold text-surface-700 dark:text-surface-200 mt-0.5">
                          {formatCurrency(plan.cost_breakdown?.per_day?.travel || 0, plan.currency)}<span className="text-[6px] text-surface-400">/day</span>
                        </p>
                      </div>
                      <div className="text-center rounded-xl bg-surface-50 dark:bg-surface-800/80 p-3 border border-surface-100 dark:border-surface-700/50">
                        <Utensils className={`w-4 h-4 mx-auto mb-1 ${categoryColors.food.icon}`} />
                        <p className="text-[10px] uppercase tracking-wider text-surface-400 dark:text-surface-500 font-medium">Food</p>
                        <p className="text-xs font-bold text-surface-700 dark:text-surface-200 mt-0.5">
                          {formatCurrency(plan.cost_breakdown?.per_day?.food || 0, plan.currency)}<span className="text-[6px] text-surface-400">/day</span>
                        </p>
                      </div>
                      <div className="text-center rounded-xl bg-surface-50 dark:bg-surface-800/80 p-3 border border-surface-100 dark:border-surface-700/50">
                        <Bed className={`w-4 h-4 mx-auto mb-1 ${categoryColors.stay.icon}`} />
                        <p className="text-[10px] uppercase tracking-wider text-surface-400 dark:text-surface-500 font-medium">Stay</p>
                        <p className="text-xs font-bold text-surface-700 dark:text-surface-200 mt-0.5">
                          {formatCurrency(plan.cost_breakdown?.per_day?.stay || 0, plan.currency)}<span className="text-[6px] text-surface-400">/day</span>
                        </p>
                      </div>
                    </div>

                    {/* Duration & Places */}
                    <div className="mt-5 flex items-center gap-4 pt-4 border-t border-surface-100 dark:border-surface-800">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-semibold text-surface-700 dark:text-surface-200">{plan.days} days</span>
                      </div>
                      {plan.places && plan.places.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-surface-400" />
                          <span className="text-sm text-surface-500 dark:text-surface-400">{plan.places.length} places</span>
                        </div>
                      )}
                    </div>

                    {plan.places && plan.places.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {plan.places.slice(0, 4).map((place) => (
                          <span key={place} className="inline-flex items-center gap-1 rounded-full bg-surface-100/80 dark:bg-surface-800/80 px-2.5 py-1 text-[11px] font-medium text-surface-600 dark:text-surface-400 border border-surface-200/60 dark:border-surface-700/60">
                            {place}
                          </span>
                        ))}
                        {plan.places.length > 4 && (
                          <span className="inline-flex items-center text-[11px] font-medium text-surface-400 dark:text-surface-500 px-1">
                            +{plan.places.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    <button className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-900/50 transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]">
                      View Full Details
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-surface-400 dark:text-surface-500" />
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400">No plans available yet. Try adjusting your preferences.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

function ItineraryDetail({ plan, onBack, showCostBreakdown, onToggleCost }) {
  const currency = plan.currency || "INR"

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 transition-all hover:bg-surface-50 dark:hover:bg-surface-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </button>

        {plan.cost_breakdown && (
          <button
            type="button"
            onClick={onToggleCost}
            className="inline-flex items-center gap-2 rounded-full border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 transition-all hover:bg-surface-50 dark:hover:bg-surface-800"
          >
            {showCostBreakdown ? (
              <>
                <DollarSign className="w-4 h-4" />
                Hide Costs
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Show Cost Breakdown
              </>
            )}
          </button>
        )}
      </div>

      {/* Plan header */}
      <div className="rounded-2xl bg-gradient-to-br from-surface-950 via-blue-950 to-surface-950 p-6 sm:p-8 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">{plan.title}</h3>
            <p className="mt-1 text-surface-200 max-w-lg">{plan.summary}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span className="text-3xl font-bold text-white">{formatCurrency(plan.total_cost, currency)}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white/5 p-3 border border-white/10">
            <p className="text-xs text-surface-300">Duration</p>
            <p className="text-sm font-semibold">{plan.days} days</p>
          </div>
          {plan.cost_breakdown?.per_day && (
            <>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <p className="text-xs text-surface-300">Travel / day</p>
                <p className="text-sm font-semibold">{formatCurrency(plan.cost_breakdown.per_day.travel, currency)}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <p className="text-xs text-surface-300">Food / day</p>
                <p className="text-sm font-semibold">{formatCurrency(plan.cost_breakdown.per_day.food, currency)}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <p className="text-xs text-surface-300">Stay / day</p>
                <p className="text-sm font-semibold">{formatCurrency(plan.cost_breakdown.per_day.stay, currency)}</p>
              </div>
            </>
          )}
        </div>

        {plan.places && plan.places.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-medium text-surface-300 uppercase tracking-wider mb-3">Places to visit</p>
            <div className="flex flex-wrap gap-2">
              {plan.places.map((place) => (
                <span key={place} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white border border-white/10">
                  <MapPin className="w-3 h-3" />
                  {place}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCostBreakdown && plan.cost_breakdown && (
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="rounded-2xl bg-white dark:bg-surface-900 p-6 shadow-sm ring-1 ring-surface-200/80 dark:ring-surface-800/50">
          <h4 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Cost Breakdown
          </h4>
          {plan.cost_breakdown.breakdown && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(plan.cost_breakdown.breakdown).map(([category, amount]) => (
                <div key={category} className="rounded-xl bg-surface-50 dark:bg-surface-800 p-4 border border-surface-100 dark:border-surface-800">
                  <p className="text-xs text-surface-500 dark:text-surface-400 capitalize">{category}</p>
                  <p className="text-lg font-bold text-surface-900 dark:text-white mt-1">{formatCurrency(amount, currency)}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {plan.daily_plan && plan.daily_plan.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Day-by-Day Itinerary
          </h4>
          {plan.daily_plan.map((day, i) => (
            <motion.div
              key={`${plan.title}-${day.day}`}
              variants={fadeIn}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white dark:bg-surface-900 shadow-sm ring-1 ring-surface-200/80 dark:ring-surface-800/50 overflow-hidden card-hover"
            >
              <div className="flex items-center gap-3 p-5 border-b border-surface-100 dark:border-surface-800">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  D{day.day}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Day {day.day}</p>
                  <h5 className="text-base font-semibold text-surface-900 dark:text-white">{day.location}</h5>
                </div>
              </div>

              {day.image && (
                <img src={day.image} alt={day.location} className="w-full h-48 object-cover" />
              )}

              <div className="p-5">
                <h6 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Activities</h6>
                <ul className="space-y-2.5">
                  {Array.isArray(day.activities) && day.activities.length > 0 ? (
                    day.activities.map((activity, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-surface-600 dark:text-surface-400">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-surface-400 dark:text-surface-500">No activities listed.</li>
                  )}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ItineraryResults
