import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MaximizeIcon } from "lucide-react";

export default function FullscreenRequirementModal({
  enabled,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const checkFullscreen = () => {
      setIsOpen(!document.fullscreenElement);
    };

    checkFullscreen();

    document.addEventListener(
      "fullscreenchange",
      checkFullscreen,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        checkFullscreen,
      );
    };
  }, [enabled]);

  const handleEnterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      setIsOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(
        "Fullscreen is required to continue the interview.",
      );
    }
  };

  if (!enabled || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-2xl bg-base-100 shadow-2xl">
        <div className="p-7 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
            <MaximizeIcon className="size-8 text-primary" />
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            Fullscreen Required
          </h2>

          <p className="mt-3 text-sm leading-6 text-base-content/70">
            This interview requires fullscreen mode.
            <br />
            Please enter fullscreen before continuing.
          </p>

          <button
            type="button"
            onClick={handleEnterFullscreen}
            className="btn btn-primary mt-7 w-full"
          >
            <MaximizeIcon className="size-4" />
            Enter Fullscreen
          </button>

          <p className="mt-4 text-xs text-base-content/50">
            Leaving fullscreen during the interview may
            generate a security warning.
          </p>
        </div>
      </div>
    </div>
  );
}