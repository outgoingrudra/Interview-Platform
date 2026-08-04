import { Link, useParams } from "react-router-dom";
import { AlertCircleIcon, CheckCircle2Icon, HomeIcon } from "lucide-react";

import { useGetCandidateResultQuery } from "../../api/sessionApi";
import ResultSummary from "./ResultSummary";
import AnswerReview from "./AnswerReview";

export default function CandidateResultPage() {
  const { sessionId } = useParams();

  const { data, isLoading, isError, error } =
    useGetCandidateResultQuery(sessionId);

  if (isLoading) {
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-base-200 px-4 py-8">
        <div className="alert alert-error mx-auto max-w-3xl">
          <AlertCircleIcon className="size-5" />
          <span>{error?.data?.message || "Result could not be loaded"}</span>
        </div>
      </main>
    );
  }

  const result = data?.result;
  const submission = result?.submission;
  const session = result?.session;

  if (!result || !submission) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-base-200 px-4 py-8">
        <div className="alert alert-warning mx-auto max-w-3xl">
          Result is not available yet.
        </div>
      </main>
    );
  }

  const hasMcqs = (submission.answers?.length ?? 0) > 0;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body items-center p-5 text-center sm:p-7">
            <CheckCircle2Icon className="size-12 text-success" />

            <h1 className="text-2xl font-black sm:text-3xl">
              Interview Submitted
            </h1>

            <p className="max-w-xl text-sm text-base-content/60">
              Your answers were submitted successfully.
            </p>
          </div>
        </header>

        {hasMcqs && (
          <>
            <ResultSummary submission={submission} session={session} />

            <AnswerReview answers={submission.answers} />
          </>
        )}

        {!hasMcqs && (
          <section className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body text-center">
              <h2 className="text-xl font-bold">Interview Completed</h2>

              <p className="text-base-content/60">
                This interview did not contain any MCQ assessment.
              </p>
            </div>
          </section>
        )}

        <div className="flex justify-center">
          <Link to="/dashboard" className="btn btn-primary btn-sm">
            <HomeIcon className="size-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
