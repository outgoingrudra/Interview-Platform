import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import {
  ArrowRightIcon,
  CheckIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

const highlights = [
  "HD Video and Chat",
  "Timed Assessments",
  "Security Monitoring",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-20 size-[450px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <div className="badge badge-primary badge-lg gap-2">
            <SparklesIcon className="size-4" />
            Smarter Remote Hiring
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
            Run interviews that are{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              secure, structured
            </span>{" "}
            and efficient.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-base-content/70 sm:text-lg">
            Talent IQ combines live video, chat, timed MCQs,
            automatic evaluation and intelligent security monitoring
            in one complete interview platform.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {highlights.map((highlight) => (
              <span
                key={highlight}
                className="badge badge-outline badge-lg gap-2"
              >
                <CheckIcon className="size-4 text-success" />
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                >
                  Start Interviewing
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                className="btn btn-primary btn-lg"
              >
                Open Dashboard
                <ArrowRightIcon className="size-5" />
              </Link>
            </SignedIn>

            <Link
              to="/practice"
              className="btn btn-outline btn-lg"
            >
              <PlayCircleIcon className="size-5" />
              Explore Platform
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-base-content/60">
            <ShieldCheckIcon className="size-5 text-success" />

            <span>
              Designed for secure technical and general interviews.
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-2xl" />

          <div className="card relative overflow-hidden border border-base-300 bg-base-100 shadow-2xl">
            <div className="card-body p-3 sm:p-4">
              <img
                src="https://ik.imagekit.io/rudra671/ChatGPT%20Image%20Aug%201,%202026,%2002_04_44%20PM.png"
                alt="Talent IQ secure interview room"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            </div>

            <div className="absolute left-5 top-5 badge badge-success gap-2 shadow-lg">
              <span className="size-2 animate-pulse rounded-full bg-success-content" />
              Secure Session
            </div>

            <div className="absolute bottom-6 right-6 rounded-xl border border-base-300 bg-base-100/95 px-4 py-3 shadow-xl backdrop-blur">
              <p className="text-xs text-base-content/60">
                Interview status
              </p>

              <p className="font-bold text-success">
                Live and monitored
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}