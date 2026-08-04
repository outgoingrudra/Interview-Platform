import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Clock3Icon,
  ShieldCheckIcon,
  VideoIcon,
} from "lucide-react";

import { useGetInterviewByIdQuery } from "../../api/interviewApi";
import { useJoinInterviewMutation } from "../../api/sessionApi";

export default function JoinInterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isInterviewLoading,
    isError,
    error,
  } = useGetInterviewByIdQuery(id);

  const [joinInterview, { isLoading: isJoining }] =
    useJoinInterviewMutation();

  const interview = data?.interview;

  const handleJoin = async () => {
    try {
      const response = await joinInterview(id).unwrap();

      toast.success("Interview joined successfully");

      navigate(
        `/interviews/${id}/room?sessionId=${response.session._id}`,
      );
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to join interview",
      );
    }
  };

  if (isInterviewLoading) {
    return (
      <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (isError || !interview) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-base-200 p-4">
        <div className="alert alert-error mx-auto max-w-3xl">
          {error?.data?.message || "Interview not found"}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <section className="card border border-base-300 bg-base-100 shadow-xl">
          <div className="card-body gap-6 p-5 sm:p-8">
            <div>
              <span className="badge badge-success capitalize">
                {interview.status}
              </span>

              <h1 className="mt-4 text-3xl font-black sm:text-4xl">
                {interview.title}
              </h1>

              <p className="mt-2 text-base-content/60">
                Review the interview details before joining.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-base-200 p-4">
                <Clock3Icon className="size-6 text-primary" />
                <p className="mt-3 text-sm text-base-content/60">
                  Duration
                </p>
                <p className="text-xl font-bold">
                  {interview.durationMinutes} minutes
                </p>
              </div>

              <div className="rounded-2xl bg-base-200 p-4">
                <ShieldCheckIcon className="size-6 text-success" />
                <p className="mt-3 text-sm text-base-content/60">
                  Security
                </p>
                <p className="text-xl font-bold">
                  Monitored session
                </p>
              </div>
            </div>

            <div className="alert alert-warning">
              Stay in fullscreen mode and avoid switching tabs during
              the interview.
            </div>

            <button
              type="button"
              onClick={handleJoin}
              disabled={isJoining || interview.status !== "live"}
              className="btn btn-primary btn-lg w-full"
            >
              <VideoIcon className="size-5" />

              {isJoining
                ? "Joining..."
                : interview.status === "live"
                  ? "Join Interview"
                  : "Interview is not live"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}