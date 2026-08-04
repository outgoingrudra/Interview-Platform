import { Link } from "react-router-dom";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { SparklesIcon, PaletteIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../redux/uiSlice";

const themes = [
  {
    name: "forest",
    color: "bg-green-700",
  },
  {
    name: "emerald",
    color: "bg-emerald-500",
  },
  {
    name: "synthwave",
    color: "bg-fuchsia-500",
  },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  return (
    <nav className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300">
      <div className="navbar max-w-7xl mx-auto px-4">

        {/* Logo */}
        <div className="navbar-start">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <SparklesIcon className="size-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Talent IQ
              </h1>

              <p className="text-xs text-base-content/60">
                Secure Interviews
              </p>
            </div>
          </Link>
        </div>

        {/* Right */}
        <div className="navbar-end gap-3">

          {/* Theme Switcher */}
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle">
              <PaletteIcon className="size-5" />
            </button>

            <ul className="dropdown-content menu bg-base-100 rounded-box w-56 shadow-xl mt-3 border border-base-300">

              {themes.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => dispatch(setTheme(item.name))}
                    className={`flex items-center justify-between ${
                      theme === item.name ? "active" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-4 rounded-full ${item.color}`}
                      />
                      <span className="capitalize">
                        {item.name}
                      </span>
                    </div>

                    {theme === item.name && (
                      <span className="badge badge-primary badge-xs">
                        Active
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link
              to="/dashboard"
              className="btn btn-outline"
            >
              Dashboard
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>

        </div>
      </div>
    </nav>
  );
}