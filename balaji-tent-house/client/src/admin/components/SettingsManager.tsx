import { useEffect, useState, FormEvent } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { settingsApi } from "../../api/client";
import ImageInput from "../../components/ImageInput";
import type { SiteSettings } from "../../types";

const TEXT_FIELDS: { key: keyof SiteSettings; label: string; placeholder?: string }[] = [
  { key: "businessName", label: "Business Name" },
  { key: "ownerName", label: "Owner Name" },
  { key: "phone", label: "Contact Phone Number", placeholder: "+91 98765 43210" },
  { key: "whatsappNumber", label: "WhatsApp Number (with country code)", placeholder: "919876543210" },
  { key: "email", label: "Public Contact Email (shown on site)" },
];

const LOGO_SHAPES: { value: "circle" | "square" | "rectangle"; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "square", label: "Square" },
  { value: "rectangle", label: "Rectangle" },
];

const SettingsManager = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    settingsApi
      .get()
      .then((res) => setSettings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { data } = await settingsApi.update(settings);
      setSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-maroon" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white rounded-2xl border border-charcoal/10 p-6 space-y-6">
      <h3 className="font-display font-semibold text-lg text-charcoal">
        Owner Profile & Site Settings
      </h3>

      <ImageInput
        label="Business Logo"
        value={settings.logoUrl}
        onChange={(url) => setSettings({ ...settings, logoUrl: url })}
        previewShape={settings.logoShape}
        helperText="Works with any shape photo — square, rectangle, or circle. Choose how it should display below."
      />

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Logo Display Shape</label>
        <div className="flex gap-2">
          {LOGO_SHAPES.map((shape) => (
            <button
              key={shape.value}
              type="button"
              onClick={() => setSettings({ ...settings, logoShape: shape.value })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                settings.logoShape === shape.value
                  ? "bg-maroon text-ivory border-maroon"
                  : "bg-white text-charcoal border-charcoal/15 hover:border-maroon"
              }`}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      <ImageInput
        label="Owner Photo"
        value={settings.ownerPhoto}
        onChange={(url) => setSettings({ ...settings, ownerPhoto: url })}
        previewShape="circle"
        helperText="Shown in the 'About Owner' section of the website"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        {TEXT_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-charcoal mb-1.5">
              {field.label}
            </label>
            <input
              value={(settings[field.key] as string) || ""}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Business Address</label>
        <input
          value={settings.address || ""}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Owner Bio / Welcome Message</label>
        <textarea
          value={settings.ownerBio || ""}
          onChange={(e) => setSettings({ ...settings, ownerBio: e.target.value })}
          rows={4}
          className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-6 py-2.5 font-semibold text-ivory hover:bg-maroon-dark transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
};

export default SettingsManager;
