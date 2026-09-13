import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { enquiryApi } from "../api/client";
import type { EnquiryEventType, EnquiryFormData } from "../types";

const EVENT_TYPES: EnquiryEventType[] = [
  "Wedding",
  "Birthday",
  "Meeting",
  "Utensils Rental",
  "Waterproof Tent",
  "Other",
];

const initialForm: EnquiryFormData = {
  customerName: "",
  phoneNumber: "",
  eventType: "Wedding",
  eventDate: "",
  location: "",
  additionalDetails: "",
};

const EnquiryForm = () => {
  const [form, setForm] = useState<EnquiryFormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.customerName || !form.phoneNumber || !form.eventDate || !form.location) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await enquiryApi.submit(form);
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquiry" className="py-20 md:py-28 bg-maroon relative overflow-hidden">
      <div className="absolute inset-0 bg-drape-pattern opacity-20" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-marigold font-semibold text-sm tracking-wide">Book us</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold text-ivory">
            Tell us about your event
          </h2>
          <p className="mt-3 text-ivory/75">
            Share a few details and we'll call you back with a quote, usually within the day.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-ivory rounded-2xl p-10 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-maroon mx-auto" />
            <h3 className="mt-4 text-xl font-display font-semibold text-charcoal">
              Enquiry received
            </h3>
            <p className="mt-2 text-charcoal/70">
              Thank you! We've noted your details and will reach out shortly to confirm.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-maroon font-semibold underline underline-offset-4"
            >
              Submit another enquiry
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-ivory rounded-2xl p-6 sm:p-10 grid sm:grid-cols-2 gap-5"
          >
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Full Name *
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-charcoal/15 px-4 py-2.5 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none"
                placeholder="Your name"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Phone Number *
              </label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                type="tel"
                className="w-full rounded-lg border border-charcoal/15 px-4 py-2.5 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Event Type *
              </label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                className="w-full rounded-lg border border-charcoal/15 px-4 py-2.5 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none bg-white"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Event Date *
              </label>
              <input
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                required
                type="date"
                className="w-full rounded-lg border border-charcoal/15 px-4 py-2.5 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Location *
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-charcoal/15 px-4 py-2.5 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none"
                placeholder="Village / area, Bhilwara"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Additional Details
              </label>
              <textarea
                name="additionalDetails"
                value={form.additionalDetails}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-charcoal/15 px-4 py-2.5 focus:border-maroon focus:ring-1 focus:ring-maroon outline-none resize-none"
                placeholder="Guest count, tent size, any specific requirements..."
              />
            </div>

            {error && (
              <p className="sm:col-span-2 text-sm text-red-600 font-medium">{error}</p>
            )}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-7 py-3.5 font-semibold text-ivory hover:bg-maroon-dark transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default EnquiryForm;
