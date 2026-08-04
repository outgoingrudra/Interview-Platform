
import { Link } from "react-router-dom";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { SparklesIcon, PaletteIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setTheme } from "../../redux/uiSlice";
import { spring, duration, staggerContainer, staggerItem } from "../../motion/tokens";

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
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center"
              whileHover={{ rotate: 8, scale: 1.05 }}
              transition={spring.soft}
            >
              <SparklesIcon className="size-6 text-white" />
            </motion.div>

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
            <motion.button
              className="btn btn-ghost btn-circle"
              whileTap={{ scale: 0.92 }}
              transition={{ duration: duration.micro }}
            >
              <PaletteIcon className="size-5" />
            </motion.button>

            <ul className="dropdown-content menu bg-base-100 rounded-box w-56 shadow-xl mt-3 border border-base-300">
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer(0.05)}
                className="contents"
              >
                {themes.map((item) => (
                  <motion.li key={item.name} variants={staggerItem}>
                    <button
                      onClick={() => dispatch(setTheme(item.name))}
                      className={`flex items-center justify-between ${
                        theme === item.name ? "active" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className={`size-4 rounded-full ${item.color}`}
                          animate={
                            theme === item.name ? { scale: [1, 1.15, 1] } : { scale: 1 }
                          }
                          transition={spring.bouncy}
                        />
                        <span className="capitalize">{item.name}</span>
                      </div>

                      <AnimatePresence>
                        {theme === item.name && (
                          <motion.span
                            className="badge badge-primary badge-xs"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: duration.fast }}
                          >
                            Active
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.li>
                ))}
              </motion.div>
            </ul>
          </div>

          <SignedOut>
            <SignInButton mode="modal">
              <motion.button
                className="btn btn-primary"
                whileHover={{ filter: "brightness(1.08)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: duration.micro }}
              >
                Get Started
              </motion.button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <motion.div
              whileHover={{ filter: "brightness(1.08)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: duration.micro }}
            >
              <Link to="/dashboard" className="btn btn-outline">
                Dashboard
              </Link>
            </motion.div>

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