import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

import InterviewBasicForm from "./InterviewBasicForm";
import QuestionBuilder from "./QuestionBuilder";
import SecuritySettings from "./SecuritySettings";
import { useCreateInterviewMutation } from "../../api/interviewApi";

export default function CreateInterviewPage() {
  const navigate = useNavigate();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const submittingRef = useRef(false);
  const [createInterview, { isLoading }] = useCreateInterviewMutation();

  const [basicDetails, setBasicDetails] = useState({
    title: "",
    durationMinutes: "",
    startsAt: "",
  });

  const [questions, setQuestions] = useState([]);

  const [securitySettings, setSecuritySettings] = useState({
    preventCopyPaste: false,
    detectTabSwitch: false,
    requireFullscreen: false,
    detectFace: false,
    detectMultipleFaces: false,
    warningLimit: 3,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current) return;
    submittingRef.current = true;
    if (!isLoaded) {
      toast.error("Authentication is still loading");
      return;
    }

    if (!isSignedIn) {
      toast.error("Please sign in first");
      return;
    }

    if (!basicDetails.title.trim()) {
      toast.error("Interview title is required");
      return;
    }

    const durationMinutes = Number(basicDetails.durationMinutes);

    if (!Number.isFinite(durationMinutes) || durationMinutes < 1) {
      toast.error("Enter a valid interview duration");
      return;
    }
    if (basicDetails.startsAt && new Date(basicDetails.startsAt) < new Date()) {
      toast.error("Interview cannot be scheduled in the past");
      return;
    }

    try {
      const token = await getToken();

      if (!token) {
        toast.error("Authentication token is unavailable");
        return;
      }

      const payload = {
        title: basicDetails.title.trim(),
        durationMinutes,
        questions,
        securitySettings,
      };

      if (basicDetails.startsAt) {
        payload.startsAt = new Date(basicDetails.startsAt).toISOString();
      }

      const response = await createInterview({
        body: payload,
        token,
      }).unwrap();

      toast.success("Interview created successfully");

      navigate(`/interviews/${response.interview._id}`);
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || "Failed to create interview",
      );
    } finally {
      submittingRef.current = false;
    }
  };

  const submitDisabled = !isLoaded || !isSignedIn || isLoading;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header>
          <h1 className="text-3xl font-black sm:text-4xl">Create Interview</h1>

          <p className="mt-2 text-base-content/60">
            Configure timing, questions and security settings.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InterviewBasicForm
            details={basicDetails}
            setDetails={setBasicDetails}
          />

          <QuestionBuilder questions={questions} setQuestions={setQuestions} />

          <SecuritySettings
            settings={securitySettings}
            setSettings={setSecuritySettings}
          />

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
              className="btn btn-ghost w-full sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitDisabled}
              className="btn btn-primary w-full sm:w-auto"
            >
              {!isLoaded ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Loading authentication...
                </>
              ) : isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating...
                </>
              ) : (
                "Create Interview"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
