import { Link, useLocation } from "react-router-dom";
import {
  AlertTriangleIcon,
  HomeIcon,
  ShieldAlertIcon,
} from "lucide-react";

export default function InterviewTerminatedPage() {
  const location = useLocation();

  const reason =
    location?.state?.reason ||
    "The interview was terminated because the security warning limit was exceeded.";

  return (
    <main className="grid min-h-screen place-items-center bg-base-200 px-4 py-8">
      <section className="card w-full max-w-2xl border border-error bg-base-100 shadow-xl">
        <div className="card-body items-center p-6 text-center sm:p-9">
          <div className="grid size-20 place-items-center rounded-full bg-error/10">
            <ShieldAlertIcon className="size-11 text-error" />
          </div>

          <h1 className="mt-4 text-2xl font-black text-error sm:text-3xl">
            Interview Terminated
          </h1>

          <p className="mt-2 max-w-lg text-sm text-base-content/65">
            Your interview session has been closed because a security
            violation limit was reached.
          </p>

          <div className="alert alert-warning mt-6 w-full text-left">
            <AlertTriangleIcon className="size-5 shrink-0" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide">
                Termination reason
              </p>

              <p className="mt-1 text-sm font-bold">
                {reason}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-base-content/60">
            Contact the interviewer if you believe the termination was
            incorrect.
          </p>

          <Link to="/" className="btn btn-primary btn-sm mt-7">
            <HomeIcon className="size-4" />
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}