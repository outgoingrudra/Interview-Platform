const stats = [
  {
    value: "1",
    label: "Unified Interview Platform",
    className: "text-primary",
  },
  {
    value: "7+",
    label: "Configurable Security Checks",
    className: "text-secondary",
  },
  {
    value: "Live",
    label: "Video, Chat and Monitoring",
    className: "text-accent",
  },
];

export default function StatsSection() {
  return (
    <section className="px-4 py-14 sm:px-6">
      <div className="stats stats-vertical mx-auto w-full max-w-5xl overflow-hidden border border-base-300 bg-base-100 shadow-xl md:stats-horizontal">
        {stats.map((stat) => (
          <div
            className="stat place-items-center text-center"
            key={stat.label}
          >
            <div
              className={`stat-value text-3xl sm:text-4xl ${stat.className}`}
            >
              {stat.value}
            </div>

            <div className="stat-title mt-1 whitespace-normal">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}