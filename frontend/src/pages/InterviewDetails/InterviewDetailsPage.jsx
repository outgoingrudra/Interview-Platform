import { useParams } from "react-router-dom";
import { useGetInterviewByIdQuery } from "../../api/interviewApi";

import ShareInterviewLink from "./ShareInterviewLink";
import InterviewHeader from "./InterviewHeader";
import InterviewActions from "./InterviewActions";
import QuestionSummary from "./QuestionSummary";
import SecuritySummary from "./SecuritySummary";
import CandidateSessions from "./CandidateSessions";

export default function InterviewDetailsPage() {
  const { id } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetInterviewByIdQuery(id);

  if (isLoading) {
    return (
      <div className="grid min-h-[calc(100vh-4rem)] place-items-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (isError || !data?.interview) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-base-200 p-4">
        <div className="alert alert-error mx-auto max-w-3xl">
          {error?.data?.message || "Interview could not be loaded"}
        </div>
      </main>
    );
  }

  const interview = data.interview;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-5 p-4 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <InterviewHeader interview={interview} />
              <InterviewActions interview={interview} />
            </div>
          </div>
        </section>

        <ShareInterviewLink interview={interview} />

        <section className="grid gap-6 lg:grid-cols-2">
          <QuestionSummary questions={interview.questions} />
          <SecuritySummary settings={interview.securitySettings} />
        </section>

        <CandidateSessions interviewId={interview._id} />
      </div>
    </main>
  );
}