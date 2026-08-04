import { useSelector } from "react-redux";
import { Code2Icon, ExternalLinkIcon } from "lucide-react";

export default function CodingPracticePage() {
  const theme = useSelector((state) => state.ui.theme);

  const isDarkTheme =
    theme === "forest" || theme === "synthwave";

  const editorUrl = new URL("https://onecompiler.com/embed/");

  editorUrl.searchParams.set(
    "theme",
    isDarkTheme ? "dark" : "light",
  );

  editorUrl.searchParams.set("fontSize", "16");
  editorUrl.searchParams.set("hideTitle", "true");
  editorUrl.searchParams.set("hideNew", "true");

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-base-200">
      <div className="mx-auto max-w-7xl space-y-5 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        

        <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
          <div className="flex flex-col gap-2 border-b border-base-300 bg-base-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">
                Multi-language Code Editor
              </h2>

              <p className="text-xs text-base-content/60">
                Choose a language, write code and run it instantly.
              </p>
            </div>

            <span className="badge badge-primary badge-outline w-fit">
              Theme: {theme}
            </span>
          </div>

          <iframe
            key={theme}
            title="OneCompiler coding editor"
            src={editorUrl.toString()}
            frameBorder="0"
            allow="clipboard-read; clipboard-write"
            className="h-[70vh] min-h-[520px] w-full bg-base-100 sm:h-[75vh]"
          />
        </section>
      </div>
    </main>
  );
}