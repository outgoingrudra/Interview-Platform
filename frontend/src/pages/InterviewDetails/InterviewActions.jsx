import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PlayIcon, Trash2Icon, XCircleIcon } from "lucide-react";
import { SquareIcon } from "lucide-react";
import {
  useCancelInterviewMutation,
  useDeleteInterviewMutation,
  useStartInterviewMutation,
  useCompleteInterviewMutation,
} from "../../api/interviewApi";
import { Link } from "react-router-dom";
import { LogInIcon } from "lucide-react";

export default function InterviewActions({ interview }) {
  const navigate = useNavigate();

  const [startInterview, { isLoading: isStarting }] =
    useStartInterviewMutation();

  const [cancelInterview, { isLoading: isCancelling }] =
    useCancelInterviewMutation();

  const [deleteInterview, { isLoading: isDeleting }] =
    useDeleteInterviewMutation();
  const [completeInterview, { isLoading: isCompleting }] =
    useCompleteInterviewMutation();

  const canModify = ["draft", "scheduled"].includes(interview.status);

  const handleStart = async () => {
    try {
      await startInterview(interview._id).unwrap();
      toast.success("Interview started");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to start interview");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelInterview(interview._id).unwrap();
      toast.success("Interview cancelled");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to cancel interview");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) return;

    try {
      await deleteInterview(interview._id).unwrap();

      toast.success("Interview deleted");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete interview");
    }
  };
  const handleComplete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to end this interview?",
    );

    if (!confirmed) return;

    try {
      await completeInterview(interview._id).unwrap();
      toast.success("Interview completed");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to complete interview");
    }
  };

if (interview.status === "live") {
  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <Link
        to={`/interviews/${interview._id}/room`}
        className="btn btn-primary w-full sm:w-auto"
      >
        <LogInIcon className="size-4" />
        Join Room
      </Link>

      <button
        type="button"
        onClick={handleComplete}
        disabled={isCompleting}
        className="btn btn-error w-full sm:w-auto"
      >
        {isCompleting ? "Ending..." : "End Interview"}
      </button>
    </div>
  );
}
  if (!canModify) return null;

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-wrap lg:justify-end">
      <button
        type="button"
        onClick={handleStart}
        disabled={isStarting}
        className="btn btn-success w-full sm:w-auto"
      >
        <PlayIcon className="size-4" />
        {isStarting ? "Starting..." : "Start"}
      </button>

      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="btn btn-warning w-full sm:w-auto"
      >
        <XCircleIcon className="size-4" />
        {isCancelling ? "Cancelling..." : "Cancel"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="btn btn-error w-full sm:w-auto"
      >
        <Trash2Icon className="size-4" />
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
