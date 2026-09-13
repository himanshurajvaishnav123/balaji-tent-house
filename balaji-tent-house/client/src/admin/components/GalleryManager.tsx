import { useEffect, useState, FormEvent } from "react";
import { Trash2, Plus, Loader2, ImageIcon } from "lucide-react";
import { galleryApi } from "../../api/client";
import ImageInput from "../../components/ImageInput";
import type { GalleryItem } from "../../types";

const EVENT_TYPES = ["Wedding", "Birthday", "Corporate", "Social Gathering", "Other"] as const;

const emptyForm = {
  title: "",
  description: "",
  imageUrl: "",
  eventLocation: "",
  eventType: "Wedding" as (typeof EVENT_TYPES)[number],
  featured: false,
};

const GalleryManager = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    galleryApi
      .getAll()
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.description || !form.imageUrl || !form.eventLocation) {
      setError("Please fill in all fields.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await galleryApi.create(form);
      // Append the new item without touching the rest of the list
      setItems((prev) => [data, ...prev]);
      setForm(emptyForm);
    } catch {
      setError("Failed to add gallery item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery item? This cannot be undone.")) return;
    // Optimistic UI update, synced with backend delete
    setItems((prev) => prev.filter((item) => item._id !== id));
    try {
      await galleryApi.remove(id);
    } catch {
      load(); // revert on failure
    }
  };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-charcoal/10 p-6 h-fit space-y-4"
      >
        <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2">
          <Plus className="h-5 w-5 text-maroon" />
          Add Past Work
        </h3>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
            placeholder="Sharma Wedding Reception"
          />
        </div>

        <ImageInput
          label="Event Photo"
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
          previewShape="rectangle"
          helperText="Upload from your phone's gallery, or paste an image link"
        />

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Event Type</label>
          <select
            value={form.eventType}
            onChange={(e) => setForm({ ...form, eventType: e.target.value as any })}
            className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none bg-white"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Location</label>
          <input
            value={form.eventLocation}
            onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
            className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
            placeholder="Bijoliya, Bhilwara"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none resize-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Feature this on the homepage
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-5 py-2.5 font-semibold text-ivory hover:bg-maroon-dark transition-colors disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Adding..." : "Add to Gallery"}
        </button>
      </form>

      <div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-maroon" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-charcoal/50 border border-dashed border-charcoal/20 rounded-2xl">
            <ImageIcon className="h-8 w-8 mx-auto mb-2" />
            No gallery items yet. Add your first one.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-charcoal/10 overflow-hidden"
              >
                <img src={item.imageUrl} alt={item.title} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-charcoal">{item.title}</h4>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 shrink-0"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-charcoal/60 mt-1">{item.eventLocation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
