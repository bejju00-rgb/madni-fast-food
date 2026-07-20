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

type AccountForm = {
  name: string;
  phone: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptySettings: SettingsForm = {
  deliveryCharge: 150,
  whatsappNumber: "",
  jazzcashNumber: "",
  jazzcashName: "",
  easypaisaNumber: "",
  easypaisaName: "",
};

const emptyAccount: AccountForm = {
  name: "",
  phone: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const settingLabels: Record<keyof SettingsForm, string> = {
  deliveryCharge: "Delivery charge (Rs.)",
  whatsappNumber: "WhatsApp number",
  jazzcashNumber: "JazzCash number",
  jazzcashName: "JazzCash account name",
  easypaisaNumber: "Easypaisa number",
  easypaisaName: "Easypaisa account name",
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
  const [account, setAccount] = useState<AccountForm>(emptyAccount);
  const [loading, setLoading] = useState(true);
  const [savingStore, setSavingStore] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [settingsRes, accountRes] = await Promise.all([
          fetch("/api/settings", { cache: "no-store" }),
          fetch("/api/admin/account", { cache: "no-store" }),
        ]);
        const settingsData = await settingsRes.json();
        setSettings(mapApiToForm(settingsData));

        if (accountRes.ok) {
          const accountData = await accountRes.json();
          setAccount({
            ...emptyAccount,
            name: accountData.name ?? "",
            phone: accountData.phone ?? "",
            email: accountData.email ?? "",
          });
        }
      } catch {
        toast.error("Could not load settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSaveStore = async () => {
    setSavingStore(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        toast.error("Failed to save store settings");
        return;
      }
      const saved = await res.json();
      setSettings(mapApiToForm(saved));
      toast.success("Store settings saved");
    } catch {
      toast.error("Failed to save store settings");
    } finally {
      setSavingStore(false);
    }
  };

  const handleSaveAccount = async () => {
    if (account.newPassword && account.newPassword !== account.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSavingAccount(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: account.name,
          phone: account.phone,
          email: account.email,
          currentPassword: account.currentPassword || undefined,
          newPassword: account.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update account");
        return;
      }
      setAccount({
        ...account,
        name: data.name,
        phone: data.phone,
        email: data.email ?? "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Admin account updated");
    } catch {
      toast.error("Failed to update account");
    } finally {
      setSavingAccount(false);
    }
  };

  return (
    <div className="space-y-10 max-w-lg">
      <h1 className="text-2xl font-montserrat font-black">Settings</h1>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-montserrat font-bold text-lg">Store & payments</h2>
        <p className="text-white/40 text-sm">
          WhatsApp, delivery fee, and payment numbers shown to customers.
        </p>
        {loading ? (
          <p className="text-white/50 text-sm">Loading…</p>
        ) : (
          (Object.keys(settings) as (keyof SettingsForm)[]).map((key) => (
            <div key={key}>
              <label className="text-sm text-white/50 block mb-1">{settingLabels[key]}</label>
              <input
                value={settings[key]}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    [key]:
                      key === "deliveryCharge"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
              />
            </div>
          ))
        )}
        <button
          onClick={handleSaveStore}
          disabled={loading || savingStore}
          className="px-6 py-3 bg-orange rounded-xl font-semibold disabled:opacity-50"
        >
          {savingStore ? "Saving…" : "Save store settings"}
        </button>
      </section>

      <section className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-montserrat font-bold text-lg">Admin login</h2>
        <p className="text-white/40 text-sm">
          Change the phone number and password you use to sign in at /admin. Enter your{" "}
          <strong className="text-white/60">current password</strong> when changing phone or
          password.
        </p>
        {loading ? (
          <p className="text-white/50 text-sm">Loading…</p>
        ) : (
          <>
            <div>
              <label className="text-sm text-white/50 block mb-1">Display name</label>
              <input
                value={account.name}
                onChange={(e) => setAccount({ ...account, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 block mb-1">Login phone number</label>
              <input
                value={account.phone}
                onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
                placeholder="03000000000"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 block mb-1">Email (optional)</label>
              <input
                type="email"
                value={account.email}
                onChange={(e) => setAccount({ ...account, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 block mb-1">Current password</label>
              <input
                type="password"
                value={account.currentPassword}
                onChange={(e) =>
                  setAccount({ ...account, currentPassword: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 block mb-1">New password</label>
              <input
                type="password"
                value={account.newPassword}
                onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
                autoComplete="new-password"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div>
              <label className="text-sm text-white/50 block mb-1">Confirm new password</label>
              <input
                type="password"
                value={account.confirmPassword}
                onChange={(e) =>
                  setAccount({ ...account, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
                autoComplete="new-password"
              />
            </div>
          </>
        )}
        <button
          onClick={handleSaveAccount}
          disabled={loading || savingAccount}
          className="px-6 py-3 bg-orange rounded-xl font-semibold disabled:opacity-50"
        >
          {savingAccount ? "Saving…" : "Save admin account"}
        </button>
      </section>
    </div>
  );
}
