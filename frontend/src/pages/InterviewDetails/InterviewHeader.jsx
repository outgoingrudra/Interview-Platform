import {
  CalendarDaysIcon,
  Clock3Icon,
} from "lucide-react";

export default function InterviewHeader({ interview }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-black sm:text-3xl">
          {interview.title}
        </h1>

        <span className="badge badge-primary capitalize">
          {interview.status}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-base-content/70 sm:flex-row sm:flex-wrap">
        <span className="flex items-center gap-2">
          <Clock3Icon className="size-4" />
          {interview.durationMinutes} minutes
        </span>

        <span className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4" />

          {interview.startsAt
            ? new Date(interview.startsAt).toLocaleString()
            : "Not scheduled"}
        </span>
      </div>
    </div>
  );
}