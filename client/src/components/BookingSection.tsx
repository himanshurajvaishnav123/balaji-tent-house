import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles, User } from 'lucide-react';
import { api } from '../api/client';
import { useSettings } from '../context/SettingsContext';

interface BookingSectionProps {
  prefilledService?: string;
}

export const BookingSection: React.FC<BookingSectionProps> = ({ prefilledService }) => {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    eventType: prefilledService || 'Wedding / Vivah',
    eventDate: '',
    location: '',
    details: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      setStatus('error');
      setErrorMessage('Please fill in your Name and Mobile Number.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await api.post('/enquiries', formData);
      if (res.data?.success) {
        setStatus('success');
        setFormData({
          customerName: '',
          phone: '',
          eventType: 'Wedding / Vivah',
          eventDate: '',
          location: '',
          details: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(res.data?.message || 'Submission failed.');
      }
    } catch (err: any) {
      // If server is not reachable, display friendly message
      setStatus('error');
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to send online enquiry. Please directly call or WhatsApp Yamuna Shankar Bairagi at +919783950350.'
      );
    }
  };

  return (
    <section id="booking" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#300505] via-[#520909] to-[#200404] rounded-3xl p-8 sm:p-12 lg:p-16 border-2 border-gold-400/40 shadow-festive text-white relative overflow-hidden">
          {/* Subtle gold glow & decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left Column: Callout and Direct Contacts */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/50 px-3.5 py-1 rounded-full text-gold-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Fast Free Quotation</span>
              </div>

              <h2 className="font-serif-royal text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Plan Your Event With Balaji Tent House
              </h2>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Whether you need a grand royal wedding mandap, heavy monsoon waterproof tents, or traditional catering utensils (Bhagone, Kadai, Bhati), we provide top-tier event equipment with timely setup.
              </p>

              <div className="space-y-4 pt-4 border-t border-maroon-700/60">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-maroon-900/80 border border-gold-500/30 hover:border-gold-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gold-300 block font-medium">Direct Phone & WhatsApp</span>
                    <span className="text-base font-bold text-white tracking-wide">{settings.phone}</span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-maroon-900/80 border border-gold-500/30">
                  <div className="w-10 h-10 rounded-lg bg-maroon-800 text-gold-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-gold-300 block font-medium">Office & Warehouse Location</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">{settings.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Form */}
            <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gold-400/40">
              <h3 className="font-serif-royal text-2xl font-bold text-maroon-950 mb-2">
                Send Booking Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Fill the form below and Yamuna Shankar Bairagi will call you with dates availability and the best custom pricing.
              </p>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm sm:text-base">Inquiry Submitted Successfully!</h4>
                    <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                      Dhanyawad! We have received your booking details. We will contact you at your phone number shortly.
                    </p>
                  </div>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 flex items-start gap-3"
                >
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Submission Notice</h4>
                    <p className="text-xs text-rose-700 mt-1">{errorMessage}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Event / Service Type
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 text-sm bg-white"
                    >
                      <option value="Wedding / Vivah">Royal Wedding / Vivah</option>
                      <option value="Waterproof Tent (Monsoon)">Waterproof Tent (Barsat Setup)</option>
                      <option value="Catering Utensils Rental">Catering Utensils Rental (Bhagone, Kadai, Bhati)</option>
                      <option value="Bhagwat Katha / Satsang">Bhagwat Katha / Satsang</option>
                      <option value="Birthday / Anniversary">Birthday / Anniversary / Party</option>
                      <option value="Corporate / Public Event">Corporate / Public Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Approx Event Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 text-sm bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Event Village / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Bijoliya / Malka khera / Nearby village"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Estimated Guest Count & Special Requirements
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. 500 Guests, Need Waterproof Tent, 4 Big Bhagone, 2 Kadai, 3 Bhatti, and stage lighting."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 focus:ring-2 focus:ring-maroon-800/20 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-950 hover:from-maroon-800 hover:to-maroon-900 text-gold-300 font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <span className="inline-block animate-spin mr-2">⟳</span>
                  ) : (
                    <Send className="w-5 h-5 text-gold-400" />
                  )}
                  <span>{status === 'submitting' ? 'Submitting Inquiry...' : 'Submit Booking Inquiry'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
