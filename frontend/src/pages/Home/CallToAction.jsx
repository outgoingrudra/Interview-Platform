import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
} from "lucide-react";

export default function CallToAction() {
  return (
    <section className="px-4 pb-20 pt-8 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent p-[1px]">
        <div className="rounded-[calc(1.5rem-1px)] bg-base-100 px-6 py-10 text-center sm:px-10 sm:py-14">
          <ShieldCheckIcon className="mx-auto size-12 text-primary" />

          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            Ready to conduct a better interview?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base-content/65">
            Create structured interviews, monitor candidate activity
            and review detailed results from one platform.
          </p>

          <div className="mt-7">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                >
                  Get Started
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                to="/interviews/create"
                className="btn btn-primary btn-lg"
              >
                Create Interview
                <ArrowRightIcon className="size-5" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </section>
  );
}