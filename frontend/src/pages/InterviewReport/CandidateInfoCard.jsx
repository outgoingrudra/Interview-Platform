import {
  CalendarClockIcon,
  MailIcon,
  UserIcon,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
};

export default function CandidateInfoCard({ session }) {
  const candidate = session?.candidate;

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="avatar placeholder">
            <div className="size-16 rounded-full bg-primary text-primary-content">
              {candidate?.imageUrl ? (
                <img
                  src={candidate.imageUrl}
                  alt={candidate.name || "Candidate"}
                />
              ) : (
                <span className="text-xl font-bold">
                  {candidate?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-black">
              {candidate?.name || "Unknown Candidate"}
            </h2>

            <div className="mt-2 flex flex-col gap-2 text-sm text-base-content/60 sm:flex-row sm:flex-wrap">
              <span className="flex items-center gap-2">
                <MailIcon className="size-4" />
                {candidate?.email || "No email"}
              </span>

              <span className="flex items-center gap-2">
                <UserIcon className="size-4" />
                Status: {session?.status || "unknown"}
              </span>

              <span className="flex items-center gap-2">
                <CalendarClockIcon className="size-4" />
                Started: {formatDate(session?.startedAt)}
              </span>

              <span className="flex items-center gap-2">
                <CalendarClockIcon className="size-4" />
                Submitted: {formatDate(session?.submittedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}