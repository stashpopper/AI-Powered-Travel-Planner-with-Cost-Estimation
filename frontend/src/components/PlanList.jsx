import PlanCard from "./PlanCard";


function PlanList({ plans, recommended, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.title}
          plan={plan}
          isRecommended={plan.title === recommended}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default PlanList;