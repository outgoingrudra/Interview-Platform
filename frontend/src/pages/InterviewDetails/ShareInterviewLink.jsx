import toast from "react-hot-toast";
import {
  CopyIcon,
  Share2Icon,
} from "lucide-react";

export default function ShareInterviewLink({ interview }) {
  const joinUrl = `${window.location.origin}/interviews/${interview._id}/join`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      toast.success("Interview link copied");
    } catch {
      toast.error("Failed to copy interview link");
    }
  };

  const shareLink = async () => {
    const shareData = {
      title: `${interview.title} - Interview Invitation`,
      text: `You are invited to join the ${interview.title} interview.`,
      url: joinUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(joinUrl);
      toast.success("Sharing is unavailable. Link copied instead");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Failed to share interview");
      }
    }
  };

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-4 p-4 sm:p-6">
        <div>
          <h2 className="card-title text-lg">
            Candidate Invitation
          </h2>

          <p className="text-sm text-base-content/60">
            Share this link with candidates to join the interview.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={joinUrl}
            readOnly
            onFocus={(event) => event.target.select()}
            className="input input-bordered min-w-0 flex-1 text-sm"
          />

          <button
            type="button"
            onClick={copyLink}
            className="btn btn-outline"
          >
            <CopyIcon className="size-4" />
            Copy
          </button>

          <button
            type="button"
            onClick={shareLink}
            className="btn btn-primary"
          >
            <Share2Icon className="size-4" />
            Share
          </button>
        </div>
      </div>
    </section>
  );
}