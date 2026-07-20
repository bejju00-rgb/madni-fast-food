"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    deliveryCharge: 150,
    whatsappNumber: "923223572541",
    jazzcashNumber: "0322-3572541",
    jazzcashName: "Madni Fast Food",
    easypaisaNumber: "0307-6980041",
    easypaisaName: "Madni Fast Food",
  });

  const handleSave = async () => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) toast.success("Settings saved");
  };

  return (
    <div>
      <h1 className="text-2xl font-montserrat font-black mb-8">Settings</h1>
      <div className="glass rounded-2xl p-6 space-y-4 max-w-lg">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key}>
            <label className="text-sm text-white/50 capitalize block mb-1">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              value={value}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  [key]: key === "deliveryCharge" ? Number(e.target.value) : e.target.value,
                })
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none"
            />
          </div>
        ))}
        <button onClick={handleSave} className="px-6 py-3 bg-orange rounded-xl font-semibold">
          Save Settings
        </button>
      </div>
    </div>
  );
}
