import { Link, NavLink } from "react-router-dom";
import {
  ClipboardListIcon,
  Code2Icon,
  HouseIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PaletteIcon,
  FileTextIcon,
  SparklesIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { UserButton } from "@clerk/clerk-react";

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

const navItems = [
  {
    path: "/",
    icon: HouseIcon,
    tooltip: "Home",
    end: true,
  },
  {
    path: "/dashboard",
    icon: LayoutDashboardIcon,
    tooltip: "Dashboard",
  },
  {
    path: "/my-interviews",
    icon: ClipboardListIcon,
    tooltip: "My Interviews",
  },
  {
    path: "/reports",
    icon: FileTextIcon,
    tooltip: "Reports",
  },
  {
    path: "/practice",
    icon: Code2Icon,
    tooltip: "Coding Practice",
  },
];

export default function MainHeader() {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state?.ui?.theme);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur-md">
      <div className="navbar mx-auto max-w-7xl px-3 sm:px-4">
        <div className="navbar-start">
          {/* Mobile navigation */}
          <div className="dropdown lg:hidden">
            <button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              aria-label="Open navigation"
            >
              <MenuIcon className="size-5" />
            </button>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              {navItems?.map(({ path, icon: Icon, tooltip, end }) => (
                <li key={path}>
                  <NavLink to={path} end={end}>
                    <Icon className="size-4" />
                    {tooltip}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-sm">
              <SparklesIcon className="size-6 text-white" />
            </div>

            <div className="hidden sm:block">
              <h1 className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-xl font-black text-transparent">
                Talent IQ
              </h1>

              <p className="text-xs text-base-content/60">Secure Interviews</p>
            </div>
          </Link>
        </div>

        <div className="navbar-end gap-1 sm:gap-2">
          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems?.map(({ path, icon: Icon, tooltip, end }) => (
              <div
                key={path}
                className="tooltip tooltip-bottom"
                data-tip={tooltip}
              >
                <NavLink
                  to={path}
                  end={end}
                  aria-label={tooltip}
                  className={({ isActive }) =>
                    `btn btn-circle ${isActive ? "btn-primary" : "btn-ghost"}`
                  }
                >
                  <Icon className="size-5" />
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Theme selector */}
          <div className="dropdown dropdown-end">
            <div className="tooltip tooltip-bottom" data-tip="Theme">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-circle btn-ghost"
                aria-label="Select theme"
              >
                <PaletteIcon className="size-5" />
              </button>
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              {themes?.map((item) => (
                <li key={item?.name}>
                  <button
                    type="button"
                    onClick={() => dispatch(setTheme(item?.name))}
                    className={theme === item?.name ? "active" : ""}
                  >
                    <span className={`size-4 rounded-full ${item?.color}`} />

                    <span className="capitalize">{item?.name}</span>

                    {theme === item?.name && (
                      <span className="badge badge-primary badge-sm ml-auto">
                        Active
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Clerk account */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
