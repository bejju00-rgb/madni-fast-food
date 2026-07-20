"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type SettingsForm = {
  deliveryCharge: number;
  whatsappNumber: string;
  jazzcashNumber: string;
  jazzcashName: string;
  easypaisaNumber: string;
  easypaisaName: string;
};

const emptySettings: SettingsForm = {
  deliveryCharge: 150,
  whatsappNumber: "",
  jazzcashNumber: "",
  jazzcashName: "",
  easypaisaNumber: "",
  easypaisaName: "",
};

function mapApiToForm(data: Record<string, unknown> | null): SettingsForm {
  if (!data) return emptySettings;
  return {
    deliveryCharge: Number(data.deliveryCharge ?? 150),
    whatsappNumber: String(data.whatsappNumber ?? ""),
    jazzcashNumber: String(data.jazzcashNumber ?? ""),
    jazzcashName: String(data.jazzcashName ?? ""),
    easypaisaNumber: String(data.easypaisaNumber ?? ""),
    easypaisaName: String(data.easypaisaName ?? ""),
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsForm>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const data = await res.json();
      setSettings(mapApiToForm(data));
    } catch {
      toast.error("Could not load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        toast.error("Failed to save settings");
        return;
      }
      const saved = await res.json();
      setSettings(mapApiToForm(saved));
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-montserrat font-black mb-8">Settings</h1>
      <div className="glass rounded-2xl p-6 space-y-4 max-w-lg">
        {loading ? (
          <p className="text-white/50 text-sm">Loading settings…</p>
        ) : (
          Object.entries(settings).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm text-white/50 capitalize block mb-1">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                value={value}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [key]:
                      key === "deliveryCharge"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none"
              />
            </div>
          ))
        )}
        <button
          onClick={handleSave}
          disabled={loading || saving}
          className="px-6 py-3 bg-orange rounded-xl font-semibold disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
