import {
  ClipboardXIcon,
  EyeIcon,
  MaximizeIcon,
  MonitorOffIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";

const securityItems = [
  {
    key: "preventCopyPaste",
    label: "Copy and Paste Protection",
    icon: ClipboardXIcon,
  },
  {
    key: "detectTabSwitch",
    label: "Tab Switch Detection",
    icon: MonitorOffIcon,
  },
  {
    key: "requireFullscreen",
    label: "Fullscreen Required",
    icon: MaximizeIcon,
  },
  {
    key: "detectFace",
    label: "Face Detection",
    icon: EyeIcon,
  },
  {
    key: "detectMultipleFaces",
    label: "Multiple Face Detection",
    icon: UsersIcon,
  },
];

export default function SecuritySummary({ settings = {} }) {
  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-success/15">
            <ShieldCheckIcon className="size-6 text-success" />
          </div>

          <div>
            <h2 className="card-title">Security</h2>
            <p className="text-sm text-base-content/60">
              Enabled protection features
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {securityItems.map(({ key, label, icon: Icon }) => {
            const enabled = Boolean(settings[key]);

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 rounded-xl bg-base-200 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon className="size-5 shrink-0 text-primary" />

                  <span className="truncate text-sm font-medium">
                    {label}
                  </span>
                </div>

                <span
                  className={`badge shrink-0 ${
                    enabled ? "badge-success" : "badge-ghost"
                  }`}
                >
                  {enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            );
          })}

          <div className="flex items-center justify-between rounded-xl bg-base-200 px-4 py-3">
            <span className="text-sm font-medium">
              Warning Limit
            </span>

            <span className="badge badge-primary">
              {settings.warningLimit ?? 3}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}