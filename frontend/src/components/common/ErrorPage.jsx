import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  HomeIcon,
  RotateCcwIcon,
  TriangleAlertIcon,
} from "lucide-react";

export default function ErrorPage({
  code = "404",
  title = "Page Not Found",
  message = "The page you are looking for does not exist or may have been moved.",
  primaryText = "Go Home",
  primaryTo = "/",
  secondaryText = "Go Back",
  onRetry,
  icon: Icon = TriangleAlertIcon,
}) {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    navigate(primaryTo);
  };

  const handleSecondaryAction = () => {
    navigate(-1);
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-base-200 px-4 py-10">
      <div className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute -left-20 top-20 size-56 rounded-full bg-secondary/10 blur-3xl" />

      <div className="absolute -right-20 bottom-20 size-56 rounded-full bg-accent/10 blur-3xl" />

      <section className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-base-300 bg-base-100/90 shadow-2xl backdrop-blur">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

        <div className="p-6 text-center sm:p-10">
          <div className="relative mx-auto grid size-20 place-items-center rounded-2xl bg-error/10 sm:size-24">
            <Icon className="size-10 text-error sm:size-12" />

            <span className="absolute -right-2 -top-2 size-4 animate-ping rounded-full bg-error" />

            <span className="absolute -right-2 -top-2 size-4 rounded-full bg-error" />
          </div>

          <p className="mt-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-7xl font-black leading-none text-transparent sm:text-8xl">
            {code}
          </p>

          <h1 className="mt-5 text-2xl font-black sm:text-4xl">
            {title}
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-base-content/60 sm:text-base">
            {message}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="btn btn-primary"
            >
              <HomeIcon className="size-4" />
              {primaryText}
            </button>

            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="btn btn-outline"
              >
                <RotateCcwIcon className="size-4" />
                Try Again
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSecondaryAction}
                className="btn btn-outline"
              >
                <ArrowLeftIcon className="size-4" />
                {secondaryText}
              </button>
            )}
          </div>

          <p className="mt-7 text-xs text-base-content/40">
            Talent IQ · Secure Interview Platform
          </p>
        </div>
      </section>
    </main>
  );
}