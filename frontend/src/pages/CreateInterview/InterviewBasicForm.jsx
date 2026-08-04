import { CalendarDaysIcon, Clock3Icon, FileTextIcon } from "lucide-react";

export default function InterviewBasicForm({ details, setDetails }) {
  const updateField = (field, value) => {
    setDetails((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

  const minimumDateTime = now.toISOString().slice(0, 16);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  maxDate.setMinutes(maxDate.getMinutes() - maxDate.getTimezoneOffset());

  const maxDateTime = maxDate.toISOString().slice(0, 16);

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-4 sm:p-6">
        <div>
          <h2 className="card-title text-xl">Basic Details</h2>

          <p className="text-sm text-base-content/60">
            Add the interview title, duration and schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <label className="form-control md:col-span-2">
            <span className="label-text mb-2 font-medium">Interview title</span>

            <div className="input input-bordered flex items-center gap-2">
              <FileTextIcon className="size-4 text-base-content/50" />

              <input
                type="text"
                value={details.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Frontend Developer Interview"
                className="grow"
                required
              />
            </div>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-medium">
              Duration in minutes
            </span>

            <div className="input input-bordered flex items-center gap-2">
              <Clock3Icon className="size-4 text-base-content/50" />

              <input
                type="number"
                min="1"
                value={details.durationMinutes}
                onChange={(event) =>
                  updateField("durationMinutes", event.target.value)
                }
                placeholder="60"
                className="grow"
                required
              />
            </div>
          </label>

          <label className="form-control">
            <span className="label-text mb-2 font-medium">
              Schedule date and time
            </span>

            <div className="input input-bordered flex items-center gap-2">
              <CalendarDaysIcon className="size-4 text-base-content/50" />

              <input
                type="datetime-local"
                min={minimumDateTime}
                max={maxDateTime}
                value={details.startsAt}
                onChange={(event) =>
                  updateField("startsAt", event.target.value)
                }
                className="grow min-w-0"
              />
            </div>
          </label>
        </div>

        <div className="alert alert-info text-sm">
          Leave the schedule empty to save the interview as a draft.
        </div>
      </div>
    </section>
  );
}
