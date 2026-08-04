import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, AlertCircleIcon } from "lucide-react";

import { useGetCandidateResultQuery } from "../../api/sessionApi";
import CandidateInfoCard from "./CandidateInfoCard";
import ReportSummary from "./ReportSummary";
import SecurityEventsList from "./SecurityEventsList";
import AnswerReview from "../CandidateResult/AnswerReview";

export default function InterviewReportPage() {
  const { sessionId } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetCandidateResultQuery(sessionId);

  if (isLoading) {
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </main>
    );
  }

  if (isError || !data?.result) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-base-200 px-4 py-8">
        <div className="alert alert-error mx-auto max-w-4xl">
          <AlertCircleIcon className="size-5" />
          <span>
            {error?.data?.message || "Report could not be loaded"}
          </span>
        </div>
      </main>
    );
  }

  const {
    session,
    submission,
    securityEvents = [],
  } = data.result;

  const hasMcqs = (submission?.answers?.length ?? 0) > 0;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">
              Interview Report
            </h1>

            <p className="text-sm text-base-content/60">
              Candidate performance and security activity.
            </p>
          </div>

          <Link
            to={`/interviews/${session?.interview?._id}`}
            className="btn btn-outline btn-sm"
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </div>

        <CandidateInfoCard session={session} />

        <ReportSummary
          session={session}
          submission={submission}
          securityEvents={securityEvents}
        />

        {hasMcqs && (
          <AnswerReview answers={submission.answers} />
        )}

        {!hasMcqs && (
          <section className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body p-5 text-center">
              <h2 className="font-bold">
                No MCQ assessment
              </h2>

              <p className="text-sm text-base-content/60">
                This interview did not contain any MCQ questions.
              </p>
            </div>
          </section>
        )}

        <SecurityEventsList events={securityEvents} />
      </div>
    </main>
  );
}