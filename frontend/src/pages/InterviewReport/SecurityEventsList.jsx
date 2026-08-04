import {
  AlertTriangleIcon,
  ShieldCheckIcon,
} from "lucide-react";

const formatEventName = (type = "") =>
  type
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");

export default function SecurityEventsList({ events = [] }) {
  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <div>
          <h2 className="card-title">
            Security Events
          </h2>

          <p className="text-sm text-base-content/60">
            Chronological record of suspicious activity.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-base-300 p-6 text-center">
            <ShieldCheckIcon className="mx-auto size-8 text-success" />

            <p className="mt-2 font-semibold">
              No security events recorded
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="flex items-start gap-3 rounded-xl border border-base-300 bg-base-200/40 p-3"
              >
                <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-warning" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold">
                      {formatEventName(event.type)}
                    </h3>

                    <span className="badge badge-warning badge-sm capitalize">
                      {event.severity || "medium"}
                    </span>
                  </div>

                  {event.message && (
                    <p className="mt-1 text-sm text-base-content/70">
                      {event.message}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-base-content/50">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}