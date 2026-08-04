import {
  CameraOffIcon,
  ClipboardXIcon,
  EyeIcon,
  HandIcon,
  MaximizeIcon,
  MonitorOffIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";

const securityOptions = [
  {
    key: "preventCopyPaste",
    title: "Prevent Copy and Paste",
    description: "Block copy, cut and paste actions.",
    icon: ClipboardXIcon,
  },
  {
    key: "detectTabSwitch",
    title: "Detect Tab Switching",
    description: "Record when candidates leave the interview tab.",
    icon: MonitorOffIcon,
  },
  {
    key: "requireFullscreen",
    title: "Require Fullscreen",
    description: "Warn candidates when they exit fullscreen mode.",
    icon: MaximizeIcon,
  },
  {
    key: "detectFace",
    title: "Face Detection",
    description: "Detect when the candidate's face is missing.",
    icon: EyeIcon,
  },
  {
    key: "detectMultipleFaces",
    title: "Multiple Face Detection",
    description: "Detect when multiple people appear on camera.",
    icon: UsersIcon,
  },
  {
    key: "detectSuspiciousGesture",
    title: "Suspicious Gesture Detection",
    description:
      "Record repeated unusual hand movements for host review.",
    icon: HandIcon,
  },
  {
    key: "detectCameraDisconnect",
    title: "Camera Disconnect Detection",
    description:
      "Detect if the camera disconnects or becomes unavailable.",
    icon: CameraOffIcon,
  },
];

export default function SecuritySettings({
  settings = {},
  setSettings,
}) {
  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-success/15">
            <ShieldCheckIcon className="size-5 text-success" />
          </div>

          <div>
            <h2 className="card-title text-lg">
              Security Settings
            </h2>

            <p className="text-sm text-base-content/60">
              Configure candidate monitoring and interview protection.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {securityOptions.map(
            ({ key, title, description, icon: Icon }) => (
              <label
                key={key}
                className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-base-300 bg-base-200/40 p-4"
              >
                <div className="flex min-w-0 gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>
                    <p className="text-sm font-bold">
                      {title}
                    </p>

                    <p className="mt-1 text-xs text-base-content/60">
                      {description}
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={Boolean(settings?.[key])}
                  onChange={(event) =>
                    updateSetting(key, event.target.checked)
                  }
                  className="toggle toggle-primary toggle-sm shrink-0"
                />
              </label>
            ),
          )}
        </div>

        <div className="rounded-xl border border-base-300 bg-base-200/40 p-4">
          <label className="form-control">
            <div className="label px-0 pt-0">
              <span className="label-text font-bold">
                Warning Limit
              </span>

              <span className="label-text-alt text-base-content/60">
                1–20 warnings
              </span>
            </div>

            <input
              type="number"
              min="1"
              max="20"
              value={settings?.warningLimit ?? 3}
              onChange={(event) =>
                updateSetting(
                  "warningLimit",
                  Number(event.target.value),
                )
              }
              className="input input-bordered w-full"
            />
          </label>
        </div>
      </div>
    </section>
  );
}