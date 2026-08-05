import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  HomeIcon,
  RotateCcwIcon,
  SatelliteIcon,
} from "lucide-react";
import {
  motion,
  useReducedMotion,
} from "motion/react";

const stars = Array.from({ length: 32 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 100}%`,
  size: 2 + (index % 3),
  delay: (index % 8) * 0.35,
  duration: 2 + (index % 5) * 0.45,
}));

function AstronautIllustration() {
  return (
    <motion.div
      animate={{
        y: [0, -18, 0],
        rotate: [-3, 3, -3],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="relative mx-auto h-64 w-64 sm:h-80 sm:w-80"
    >
      {/* Backpack */}
      <div className="absolute left-[21%] top-[40%] h-[33%] w-[24%] rounded-[2rem] border-4 border-base-content/20 bg-base-300 shadow-xl" />

      {/* Body */}
      <div className="absolute left-[29%] top-[35%] h-[43%] w-[43%] rounded-[2.8rem] border-4 border-base-content/20 bg-base-100 shadow-2xl">
        <div className="absolute left-1/2 top-[39%] h-[20%] w-[55%] -translate-x-1/2 rounded-xl border border-primary/30 bg-base-200">
          <div className="flex h-full items-center justify-center gap-2">
            <span className="size-2 rounded-full bg-error" />
            <span className="size-2 rounded-full bg-warning" />
            <span className="size-2 rounded-full bg-success" />
          </div>
        </div>

        <div className="absolute bottom-[12%] left-1/2 h-[4%] w-[42%] -translate-x-1/2 rounded-full bg-primary/40" />
      </div>

      {/* Helmet */}
      <div className="absolute left-[25%] top-[3%] h-[46%] w-[51%] rounded-[48%] border-[6px] border-base-content/20 bg-base-100 shadow-2xl">
        <div className="absolute inset-[13%] overflow-hidden rounded-[48%] border-4 border-primary/30 bg-gradient-to-br from-primary/80 via-secondary/60 to-base-300">
          <div className="absolute -right-[10%] -top-[5%] h-[60%] w-[34%] rotate-[24deg] rounded-full bg-white/35 blur-sm" />

          <div className="absolute bottom-[16%] left-[18%] h-[8%] w-[64%] rounded-full bg-black/20" />
        </div>
      </div>

      {/* Left arm */}
      <motion.div
        animate={{
          rotate: [-16, -28, -16],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[8%] top-[42%] h-[18%] w-[30%] origin-right rounded-full border-4 border-base-content/20 bg-base-100"
      >
        <div className="absolute -left-[12%] top-1/2 size-10 -translate-y-1/2 rounded-full border-4 border-base-content/20 bg-base-200" />
      </motion.div>

      {/* Right arm */}
      <motion.div
        animate={{
          rotate: [15, 27, 15],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[7%] top-[43%] h-[18%] w-[30%] origin-left rounded-full border-4 border-base-content/20 bg-base-100"
      >
        <div className="absolute -right-[12%] top-1/2 size-10 -translate-y-1/2 rounded-full border-4 border-base-content/20 bg-base-200" />
      </motion.div>

      {/* Legs */}
      <div className="absolute bottom-[3%] left-[31%] h-[31%] w-[18%] rotate-[8deg] rounded-full border-4 border-base-content/20 bg-base-100">
        <div className="absolute -bottom-[7%] -left-[8%] h-[28%] w-[130%] rounded-xl border-4 border-base-content/20 bg-base-300" />
      </div>

      <div className="absolute bottom-[3%] right-[31%] h-[31%] w-[18%] -rotate-[8deg] rounded-full border-4 border-base-content/20 bg-base-100">
        <div className="absolute -bottom-[7%] -right-[8%] h-[28%] w-[130%] rounded-xl border-4 border-base-content/20 bg-base-300" />
      </div>

      {/* Cable */}
      <motion.div
        animate={{
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-[22%] top-[48%] h-[2px] w-[48%] origin-right bg-base-content/25"
      />

      <div className="absolute -left-[31%] top-[43%] grid size-12 place-items-center rounded-2xl border border-primary/25 bg-base-100 shadow-lg">
        <SatelliteIcon className="size-6 text-primary" />
      </div>
    </motion.div>
  );
}

export default function ErrorPage({
  code = "404",
  title = "Lost in Space",
  message = "The page you were looking for drifted beyond our known universe.",
  primaryText = "Return Home",
  primaryTo = "/",
  secondaryText = "Go Back",
  onRetry,
}) {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handlePrimaryAction = () => {
    navigate(primaryTo);
  };

  const handleSecondaryAction = () => {
    navigate(-1);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-base-300 via-base-200 to-base-100 px-4 py-8">
      {/* Stars */}
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="pointer-events-none absolute rounded-full bg-base-content/70"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.4, 0.8],
                }
          }
          transition={{
            delay: star.delay,
            duration: star.duration,
            repeat: Infinity,
          }}
        />
      ))}

      {/* Shooting stars */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            initial={{
              x: "-20vw",
              y: "-10vh",
              opacity: 0,
            }}
            animate={{
              x: "120vw",
              y: "70vh",
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              repeatDelay: 4,
            }}
            className="pointer-events-none absolute left-0 top-0 h-px w-40 rotate-[25deg] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_currentColor]"
          />

          <motion.div
            initial={{
              x: "110vw",
              y: "5vh",
              opacity: 0,
            }}
            animate={{
              x: "-30vw",
              y: "65vh",
              opacity: [0, 1, 0],
            }}
            transition={{
              delay: 2,
              duration: 5,
              repeat: Infinity,
              repeatDelay: 6,
            }}
            className="pointer-events-none absolute right-0 top-0 h-px w-32 -rotate-[20deg] bg-gradient-to-r from-transparent via-secondary to-transparent"
          />
        </>
      )}

      {/* Moon */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, -12, 0],
                rotate: [0, 4, 0],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full border border-base-content/10 bg-base-100 shadow-[0_0_100px_rgba(255,255,255,0.22)] sm:right-8 sm:top-8 sm:size-80"
      >
        <div className="absolute left-[18%] top-[22%] size-14 rounded-full bg-base-300/70" />
        <div className="absolute right-[17%] top-[45%] size-20 rounded-full bg-base-300/60" />
        <div className="absolute bottom-[15%] left-[33%] size-10 rounded-full bg-base-300/70" />
        <div className="absolute left-[49%] top-[13%] size-7 rounded-full bg-base-300/50" />
      </motion.div>

      {/* Planet */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, 16, 0],
                rotate: [0, -8, 0],
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -bottom-12 -left-16 size-52 rounded-full bg-gradient-to-br from-secondary via-primary to-accent shadow-[0_0_80px_rgba(100,100,255,0.3)] sm:left-10"
      >
        <div className="absolute left-1/2 top-1/2 h-8 w-[145%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border-[10px] border-base-content/15" />
      </motion.div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-2">
        {/* Astronaut scene */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: -60,
                  scale: 0.9,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="order-2 lg:order-1"
        >
          <AstronautIllustration />

          <motion.p
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: [0.45, 1, 0.45],
                  }
            }
            transition={{
              duration: 2.8,
              repeat: Infinity,
            }}
            className="text-center text-xs font-bold uppercase tracking-[0.35em] text-base-content/40"
          >
            Signal lost · Searching universe
          </motion.p>
        </motion.div>

        {/* Error content */}
        <motion.section
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  x: 60,
                  scale: 0.96,
                }
          }
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.75,
            delay: 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="order-1 lg:order-2"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-base-content/10 bg-base-100/60 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 size-64 rounded-full bg-secondary/15 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-error opacity-60" />
                  <span className="relative inline-flex size-3 rounded-full bg-error" />
                </span>

                <p className="text-xs font-black uppercase tracking-[0.25em] text-error">
                  Navigation Error
                </p>
              </div>

              <motion.p
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        textShadow: [
                          "0 0 12px rgba(120,100,255,0.25)",
                          "0 0 38px rgba(120,100,255,0.55)",
                          "0 0 12px rgba(120,100,255,0.25)",
                        ],
                      }
                }
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="mt-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-8xl font-black leading-none tracking-tighter text-transparent sm:text-9xl"
              >
                {code}
              </motion.p>

              <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">
                {title}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                {message}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  type="button"
                  onClick={handlePrimaryAction}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -3,
                          scale: 1.02,
                        }
                  }
                  whileTap={
                    shouldReduceMotion
                      ? undefined
                      : {
                          scale: 0.96,
                        }
                  }
                  className="btn btn-primary btn-lg rounded-2xl shadow-lg shadow-primary/20"
                >
                  <HomeIcon className="size-5" />
                  {primaryText}
                </motion.button>

                {onRetry ? (
                  <motion.button
                    type="button"
                    onClick={onRetry}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: -3,
                          }
                    }
                    whileTap={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 0.96,
                          }
                    }
                    className="btn btn-outline btn-lg rounded-2xl"
                  >
                    <RotateCcwIcon className="size-5" />
                    Try Again
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleSecondaryAction}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: -3,
                          }
                    }
                    whileTap={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 0.96,
                          }
                    }
                    className="btn btn-outline btn-lg rounded-2xl"
                  >
                    <ArrowLeftIcon className="size-5" />
                    {secondaryText}
                  </motion.button>
                )}
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-base-content/10 pt-5">
                <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
                  <SatelliteIcon className="size-4" />
                </div>

                <div>
                  <p className="text-xs font-bold">
                    Talent IQ Navigation System
                  </p>

                  <p className="text-[11px] text-base-content/40">
                    Destination unavailable in this sector
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}