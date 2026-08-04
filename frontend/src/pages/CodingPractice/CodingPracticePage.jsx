
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { easeOut, duration } from "../../motion/tokens";

export default function CodingPracticePage() {
  const theme = useSelector((state) => state.ui.theme);

  const isDarkTheme = theme === "forest" || theme === "synthwave";

  const editorUrl = new URL("https://onecompiler.com/embed/");

  editorUrl.searchParams.set("theme", isDarkTheme ? "dark" : "light");
  editorUrl.searchParams.set("fontSize", "16");
  editorUrl.searchParams.set("hideTitle", "true");
  editorUrl.searchParams.set("hideNew", "true");

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-base-200">
      <div className="mx-auto max-w-7xl space-y-4 px-3 py-4 sm:space-y-5 sm:px-6 sm:py-6 lg:px-8">

        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
          <motion.div
            className="flex flex-col gap-2 border-b border-base-300 bg-base-100 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.base, ease: easeOut }}
          >
            <div className="min-w-0">
              <h2 className="text-sm font-bold sm:text-base">
                Multi-language Code Editor
              </h2>

              <p className="truncate text-xs text-base-content/60 sm:whitespace-normal">
                Choose a language, write code and run it instantly.
              </p>
            </div>

            <span className="badge badge-primary badge-outline w-fit shrink-0">
              Theme: {theme}
            </span>
          </motion.div>

          <iframe
            key={theme}
            title="OneCompiler coding editor"
            src={editorUrl.toString()}
            frameBorder="0"
            allow="clipboard-read; clipboard-write"
            className="h-[60dvh] min-h-[420px] w-full bg-base-100 sm:h-[70dvh] sm:min-h-[520px] lg:h-[75dvh] lg:max-h-[800px]"
          />
        </section>
      </div>
    </main>
  );
}