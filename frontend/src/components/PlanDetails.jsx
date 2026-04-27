function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}


function PlanDetails({ plan, onBack }) {
  const currency = plan.currency || plan.cost_breakdown?.currency || "INR";
  const breakdown = plan.cost_breakdown?.breakdown;
  const perDay = plan.cost_breakdown?.per_day;

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          ← Back
        </button>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-slate-900">{plan.title}</h3>
          <p className="text-sm text-slate-500">Total Cost: {formatCurrency(plan.total_cost, currency)}</p>
          <p className="text-sm text-slate-700">{plan.summary}</p>
        </div>
      </div>

      {breakdown ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900">Cost Breakdown</h4>

          {perDay ? (
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Travel / day</p>
                <p className="mt-1 font-medium text-slate-900">{formatCurrency(perDay.travel, currency)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Food / day</p>
                <p className="mt-1 font-medium text-slate-900">{formatCurrency(perDay.food, currency)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Stay / day</p>
                <p className="mt-1 font-medium text-slate-900">{formatCurrency(perDay.stay, currency)}</p>
              </div>
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Travel Total</p>
              <p className="mt-1 font-medium text-slate-900">{formatCurrency(breakdown.travel, currency)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Food Total</p>
              <p className="mt-1 font-medium text-slate-900">{formatCurrency(breakdown.food, currency)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Stay Total</p>
              <p className="mt-1 font-medium text-slate-900">{formatCurrency(breakdown.stay, currency)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Misc Total</p>
              <p className="mt-1 font-medium text-slate-900">{formatCurrency(breakdown.misc, currency)}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {Array.isArray(plan.daily_plan) && plan.daily_plan.length > 0 ? (
          plan.daily_plan.map((day) => (
            <article
              key={`${plan.title}-${day.day}-${day.location}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 space-y-1">
                <p className="text-sm font-medium text-slate-500">Day {day.day}</p>
                <h4 className="text-lg font-semibold text-slate-900">{day.location}</h4>
              </div>

              {day.image ? (
                <img
                  src={day.image}
                  alt={day.location}
                  className="h-48 w-full rounded-lg object-cover"
                />
              ) : null}

              <div className="mt-4">
                <p className="text-sm font-medium text-slate-800">Activities</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-600">
                  {Array.isArray(day.activities) && day.activities.length > 0 ? (
                    day.activities.map((activity, index) => (
                      <li key={`${plan.title}-${day.day}-activity-${index}`}>{activity}</li>
                    ))
                  ) : (
                    <li>No activities listed.</li>
                  )}
                </ul>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-600">No itinerary details available.</p>
        )}
      </div>
    </div>
  );
}

export default PlanDetails;