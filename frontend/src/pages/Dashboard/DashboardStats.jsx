import { useGetDashboardStatsQuery } from "../../api/interviewApi";

export default function DashboardStats() {

 const { data, isLoading, isError, error } =
  useGetDashboardStatsQuery();

  const stats = [
    {
      label: "Total Interviews",
      value: data?.stats?.total || 0,
      tone: "text-primary",
    },
    {
      label: "Scheduled",
      value: data?.stats?.scheduled || 0,
      tone: "text-secondary",
    },
    {
      label: "Live",
      value: data?.stats?.live || 0,
      tone: "text-success",
    },
    {
      label: "Completed",
      value: data?.stats?.completed || 0,
      tone: "text-accent",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="card border border-base-300 bg-base-100 shadow-sm"
        >
          <div className="card-body p-5">
            <p className="text-sm text-base-content/60">{stat.label}</p>

            {isLoading ? (
              <span className="loading loading-spinner loading-md" />
            ) : (
              <h2 className={`text-3xl font-black ${stat.tone}`}>
                {stat.value}
              </h2>
            )}
          </div>
        </article>
      ))}
    </section>
  );

  
}
