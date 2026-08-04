
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
import { motion } from "framer-motion";

import { setTheme } from "../../redux/uiSlice";
import { spring, duration, easeInOut, staggerContainer, staggerItem } from "../../motion/tokens";

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
            <motion.button
              type="button"
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              aria-label="Open navigation"
              whileTap={{ scale: 0.9, rotate: 90 }}
              transition={spring.snappy}
            >
              <MenuIcon className="size-5" />
            </motion.button>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              {navItems?.map(({ path, icon: Icon, tooltip, end }) => (
                <li key={path}>
                  <NavLink to={path} end={end}>
                    {({ isActive }) => (
                      <motion.span
                        className="flex w-full items-center gap-3 rounded-lg"
                        whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.04)" }}
                        transition={{ duration: duration.micro }}
                      >
                        <motion.span
                          whileHover={{ rotate: -8, scale: 1.1 }}
                          transition={spring.soft}
                        >
                          <Icon
                            className={`size-4 transition-colors duration-200 ${
                              isActive ? "text-primary" : ""
                            }`}
                          />
                        </motion.span>
                        <span className={isActive ? "font-semibold text-primary" : ""}>
                          {tooltip}
                        </span>
                      </motion.span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-sm"
              whileHover="hover"
              initial="rest"
              whileTap={{ scale: 0.94 }}
            >
              {/* Light-sweep shimmer on hover — clipped by overflow-hidden above */}
              <motion.span
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent"
                variants={{ rest: { x: "-150%" }, hover: { x: "150%" } }}
                transition={{ duration: 0.7, ease: easeInOut }}
              />
              <motion.div
                variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: 12, scale: 1.1 } }}
                transition={spring.soft}
              >
                <SparklesIcon className="relative size-6 text-white" />
              </motion.div>
            </motion.div>

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
                  className="btn btn-circle btn-ghost relative"
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="desktop-nav-pill"
                          className="absolute inset-0 rounded-full bg-primary"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={spring.snappy}
                        />
                      )}

                      <motion.span
                        className="relative z-10 flex items-center justify-center"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        transition={spring.soft}
                      >
                        <Icon
                          className={`size-5 transition-colors duration-200 ${
                            isActive ? "text-primary-content" : ""
                          }`}
                        />
                      </motion.span>
                    </>
                  )}
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Theme selector */}
          <div className="dropdown dropdown-end">
            <div className="tooltip tooltip-bottom" data-tip="Theme">
              <motion.button
                type="button"
                tabIndex={0}
                className="btn btn-circle btn-ghost"
                aria-label="Select theme"
                whileHover={{ rotate: 20 }}
                whileTap={{ scale: 0.9, rotate: 60 }}
                transition={spring.soft}
              >
                <PaletteIcon className="size-5" />
              </motion.button>
            </div>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl"
            >
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer(0.05)}
                className="contents"
              >
                {themes?.map((item) => (
                  <motion.li key={item?.name} variants={staggerItem} className="relative">
                    {theme === item?.name && (
                      <motion.div
                        layoutId="theme-active-highlight"
                        className="absolute inset-0 rounded-lg bg-primary/10"
                        transition={spring.snappy}
                      />
                    )}

                    <motion.button
                      type="button"
                      onClick={() => dispatch(setTheme(item?.name))}
                      className={`relative z-10 ${theme === item?.name ? "active" : ""}`}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: duration.micro }}
                    >
                      <motion.span
                        className={`size-4 rounded-full ${item?.color}`}
                        whileHover={{ scale: 1.25, rotate: 15 }}
                        animate={
                          theme === item?.name
                            ? { boxShadow: "0 0 0 3px rgba(0,0,0,0.08)" }
                            : { boxShadow: "0 0 0 0px rgba(0,0,0,0)" }
                        }
                        transition={spring.soft}
                      />

                      <span className="capitalize">{item?.name}</span>

                      {theme === item?.name && (
                        <motion.span
                          className="badge badge-primary badge-sm ml-auto"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={spring.bouncy}
                        >
                          Active
                        </motion.span>
                      )}
                    </motion.button>
                  </motion.li>
                ))}
              </motion.div>
            </ul>
          </div>

          {/* Clerk account */}
          <motion.div
            className="rounded-full transition-shadow duration-300 hover:shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
            whileHover={{ scale: 1.05 }}
            transition={spring.soft}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </motion.div>
        </div>
      </div>
    </header>
  );
}