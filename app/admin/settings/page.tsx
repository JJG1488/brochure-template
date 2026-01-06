"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { AIEnhanceButton } from "@/components/AIEnhanceButton";

interface StoreSettings {
  // Appearance
  brandColor: string;
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  heroCtaLink: string;
  // About
  aboutTitle: string;
  aboutText: string;
  showAbout: boolean;
  // Contact
  phoneNumber: string;
  address: string;
  businessHours: string;
  showContactForm: boolean;
  // Social
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!settings) {
    return <div className="text-center py-12 text-gray-500">Failed to load settings</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-8">
        {/* Appearance Section */}
        <section className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.brandColor || "#10b981"}
                  onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                  className="w-16 h-12 rounded-lg cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={settings.brandColor || "#10b981"}
                  onChange={(e) => setSettings({ ...settings, brandColor: e.target.value })}
                  placeholder="#10b981"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent font-mono"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This color is used for buttons, accents, and highlights throughout your site.
              </p>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div
                  className="w-24 h-12 rounded-lg shadow-sm"
                  style={{ backgroundColor: settings.brandColor || "#10b981" }}
                />
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-colors"
                  style={{ backgroundColor: settings.brandColor || "#10b981", color: "#fff" }}
                >
                  Sample Button
                </button>
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: (settings.brandColor || "#10b981") + "20",
                    color: settings.brandColor || "#10b981",
                  }}
                >
                  Sample Badge
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { color: "#10B981", name: "Green" },
                  { color: "#3B82F6", name: "Blue" },
                  { color: "#8B5CF6", name: "Purple" },
                  { color: "#EF4444", name: "Red" },
                  { color: "#F97316", name: "Orange" },
                  { color: "#FFD700", name: "Gold" },
                  { color: "#EC4899", name: "Pink" },
                  { color: "#14B8A6", name: "Teal" },
                ].map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setSettings({ ...settings, brandColor: preset.color })}
                    className={
                      "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors " +
                      ((settings.brandColor || "").toLowerCase() === preset.color.toLowerCase()
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300")
                    }
                  >
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-sm">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="Welcome to Our Site"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="Your tagline here"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={settings.heroCta}
                  onChange={(e) => setSettings({ ...settings, heroCta: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="View Our Work"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTA Link
                </label>
                <input
                  type="text"
                  value={settings.heroCtaLink}
                  onChange={(e) => setSettings({ ...settings, heroCtaLink: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  placeholder="#portfolio"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">About Section</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showAbout}
                onChange={(e) => setSettings({ ...settings, showAbout: e.target.checked })}
                className="w-4 h-4 text-brand rounded"
              />
              <span className="text-sm text-gray-600">Show on homepage</span>
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={settings.aboutTitle}
                onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="About Us"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Text
              </label>
              <textarea
                value={settings.aboutText}
                onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                rows={5}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
                placeholder="Tell visitors about yourself or your business..."
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">
                  Use double line breaks to create paragraphs
                </p>
                <AIEnhanceButton
                  contentType="about"
                  contextName={settings.heroTitle || "your site"}
                  currentText={settings.aboutText}
                  onEnhanced={(text) => setSettings({ ...settings, aboutText: text })}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Contact</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showContactForm}
                onChange={(e) => setSettings({ ...settings, showContactForm: e.target.checked })}
                className="w-4 h-4 text-brand rounded"
              />
              <span className="text-sm text-gray-600">Show contact form</span>
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="123 Main St, City, State 12345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Hours
              </label>
              <input
                type="text"
                value={settings.businessHours}
                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="Mon-Fri 9am-5pm"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={settings.socialLinks.facebook || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={settings.socialLinks.instagram || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter / X
              </label>
              <input
                type="url"
                value={settings.socialLinks.twitter || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={settings.socialLinks.linkedin || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
