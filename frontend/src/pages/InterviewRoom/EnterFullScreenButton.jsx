import { MaximizeIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function EnterFullscreenButton({
  enabled,
}) {
  if (!enabled) return null;

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      toast.error("Fullscreen mode could not be enabled");
    }
  };

  return (
    <button
      type="button"
      onClick={enterFullscreen}
      className="btn btn-outline btn-sm"
    >
      <MaximizeIcon className="size-4" />
      Enter Fullscreen
    </button>
  );
}