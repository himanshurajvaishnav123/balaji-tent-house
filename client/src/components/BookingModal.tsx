import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calendar, Phone, MapPin, CheckCircle2, AlertCircle, User, Sparkles } from 'lucide-react';
import { api } from '../api/client';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Wedding / Vivah',
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    eventType: defaultService,
    eventDate: '',
    location: '',
    details: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      setStatus('error');
      setErrorMessage('Name and phone number are required.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await api.post('/enquiries', formData);
      if (res.data?.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(res.data?.message || 'Submission failed.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to connect to booking server. Please call Yamuna Shankar Bairagi directly at +919783950350.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gold-500/40"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-maroon-950 via-maroon-900 to-maroon-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-300 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Balaji Tent House</span>
          </div>
          <h3 className="font-serif-royal text-2xl font-bold text-white">
            Book Event & Rent Equipment
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            We will call you back within minutes to confirm availability and discuss custom pricing.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-4 animate-bounce" />
              <h4 className="font-serif-royal text-2xl font-bold text-maroon-950">
                Booking Request Received!
              </h4>
              <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
                Thank you. Yamuna Shankar Bairagi (+919783950350) has received your event request and will call you soon.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-maroon-900 text-gold-300 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Your Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-maroon-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 97839 50350"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-maroon-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:border-maroon-800 focus:outline-none"
                  >
                    <option value="Wedding / Vivah">Royal Wedding</option>
                    <option value="Waterproof Tent (Monsoon)">Waterproof Tent</option>
                    <option value="Catering Utensils Rental">Utensils Rental</option>
                    <option value="Bhagwat Katha / Satsang">Bhagwat Katha</option>
                    <option value="Birthday / Party">Birthday Party</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:border-maroon-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Location / Village
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bijoliya / Malka khera"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-maroon-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Notes / Required Utensils
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Need 500 chairs, waterproof tent, large Kadai & Bhagone..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:border-maroon-800 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-xl bg-maroon-900 hover:bg-maroon-800 text-gold-300 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{status === 'submitting' ? 'Submitting...' : 'Confirm Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
