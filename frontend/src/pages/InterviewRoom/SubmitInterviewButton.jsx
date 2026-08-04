import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { SendIcon } from "lucide-react";

import { useSubmitInterviewMutation } from "../../api/sessionApi";

const ALLOW_FULLSCREEN_EXIT_EVENT =
  "talent-iq:allow-fullscreen-exit";

export default function SubmitInterviewButton({
  sessionId,
  answers,
  disabled = false,
}) {
  const navigate = useNavigate();

  const [submitInterview, { isLoading: isSubmitting }] =
    useSubmitInterviewMutation();

  const handleSubmit = async () => {
    if (!sessionId) {
      toast.error("Session ID is missing");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to submit and end the interview?",
    );

    if (!confirmed) return;

    const formattedAnswers = Object.entries(
      answers ?? {},
    ).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      const response = await submitInterview({
        sessionId,
        answers: formattedAnswers,
      }).unwrap();

      console.log("Submission successful:", response);

      /*
        Tell FullscreenGuard that this fullscreen exit
        is intentional.
      */
      window.dispatchEvent(
        new Event(ALLOW_FULLSCREEN_EXIT_EVENT),
      );

      /*
        Do not wait for fullscreen exit.
        Navigation should happen immediately.
      */
      if (document?.fullscreenElement) {
        document
          ?.exitFullscreen?.()
          ?.catch?.((error) => {
            console.error(
              "Failed to exit fullscreen:",
              error,
            );
          });
      }

      toast.success(
        "Interview submitted successfully",
      );

      console.log(
        "Redirecting to:",
        `/sessions/${sessionId}/result`,
      );

      navigate(`/sessions/${sessionId}/result`, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Interview submission failed:",
        error,
      );

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to submit interview",
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={
        disabled ||
        isSubmitting ||
        !sessionId
      }
      className="btn btn-error btn-sm"
    >
      {isSubmitting ? (
        <>
          <span className="loading loading-spinner loading-xs" />
          Submitting...
        </>
      ) : (
        <>
          <SendIcon className="size-4" />
          Submit Interview
        </>
      )}
    </button>
  );
}