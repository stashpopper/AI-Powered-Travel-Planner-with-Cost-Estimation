function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}


function PlanCard({ plan, isRecommended, onSelect }) {
  const currency = plan.currency || plan.cost_breakdown?.currency || "INR";
  const perDay = plan.cost_breakdown?.per_day;

  return (
    <article
      className={[
        "rounded-2xl bg-white dark:bg-surface-900 p-5 shadow-sm transition",
        isRecommended ? "border-2 border-emerald-500 shadow-md" : "border border-surface-200 dark:border-surface-800",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{plan.title}</h3>
          <p className="mt-1 text-sm text-surface-600 dark:text-surface-400">{plan.summary}</p>
        </div>

        {isRecommended ? (
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Recommended
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-surface-700 dark:text-surface-300">
        <div>
          <p className="text-surface-500 dark:text-surface-400">Total Cost</p>
          <p className="font-medium">{formatCurrency(plan.total_cost, currency)}</p>
        </div>
        <div>
          <p className="text-surface-500 dark:text-surface-400">Days</p>
          <p className="font-medium">{plan.days}</p>
        </div>
      </div>

      {perDay ? (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-surface-50 dark:bg-surface-800 p-3 text-sm text-surface-700 dark:text-surface-300 sm:grid-cols-3">
          <div>
            <p className="text-surface-500 dark:text-surface-400">Travel / day</p>
            <p className="font-medium">{formatCurrency(perDay.travel, currency)}</p>
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400">Food / day</p>
            <p className="font-medium">{formatCurrency(perDay.food, currency)}</p>
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400">Stay / day</p>
            <p className="font-medium">{formatCurrency(perDay.stay, currency)}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Places</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Array.isArray(plan.places) && plan.places.length > 0 ? (
            plan.places.map((place) => (
              <span
                key={`${plan.title}-${place}`}
                className="rounded-full bg-surface-100 dark:bg-surface-800 px-3 py-1 text-xs text-surface-700 dark:text-surface-300"
              >
                {place}
              </span>
            ))
          ) : (
            <span className="text-sm text-surface-500 dark:text-surface-400">No places listed</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(plan)}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-surface-900 dark:bg-white dark:text-surface-900 px-4 py-2 text-sm font-medium text-white dark:text-surface-900 transition hover:bg-surface-800 dark:hover:bg-surface-100"
      >
        View Details
      </button>
    </article>
  );
}

export default PlanCard;