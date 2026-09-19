import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Image,
  Layers,
  Inbox,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  Save,
  RefreshCw,
  Eye,
  Lock,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  UploadCloud,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../api/client';
import { ISiteSettings, IService, IGalleryItem, IEnquiry, GalleryCategory, EnquiryStatus } from '../types';

const compressAndLoadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const { settings, refreshSettings, updateSettingsState } = useSettings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'gallery' | 'services' | 'enquiries' | 'profile'>('overview');

  // Dashboard Data States
  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [gallery, setGallery] = useState<IGalleryItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<ISiteSettings>({ ...settings });

  // Gallery Add/Edit Modal State
  const [galleryModal, setGalleryModal] = useState<{ isOpen: boolean; item: Partial<IGalleryItem> | null }>({
    isOpen: false,
    item: null,
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Service Add/Edit Modal State
  const [serviceModal, setServiceModal] = useState<{ isOpen: boolean; item: Partial<IService> | null }>({
    isOpen: false,
    item: null,
  });

  // Admin Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  });

  // Enquiries Filter
  const [enquiryFilter, setEnquiryFilter] = useState<string>('All');

  // Load all initial data
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const [enqRes, srvRes, galRes] = await Promise.allSettled([
        api.get('/enquiries'),
        api.get('/services'),
        api.get('/gallery'),
      ]);

      if (enqRes.status === 'fulfilled' && enqRes.value.data?.success) {
        setEnquiries(enqRes.value.data.enquiries || []);
      }
      if (srvRes.status === 'fulfilled' && srvRes.value.data?.success) {
        setServices(srvRes.value.data.services || []);
      }
      if (galRes.status === 'fulfilled' && galRes.value.data?.success) {
        setGallery(galRes.value.data.items || []);
      }
    } catch (err) {
      console.warn('Dashboard data fetch warning', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: '',
      });
    }
  }, [user]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/settings', settingsForm);
      if (res.data?.success) {
        updateSettingsState(res.data.settings);
        showFeedback('success', 'Site settings & branding updated live!');
      } else {
        showFeedback('error', res.data?.message || 'Failed to save settings.');
      }
    } catch (err: any) {
      showFeedback('error', err.response?.data?.message || 'Failed to save settings.');
    }
  };

  // --- ENQUIRIES HANDLERS ---
  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      const res = await api.patch(`/enquiries/${id}/status`, { status: newStatus });
      if (res.data?.success) {
        setEnquiries((prev) =>
          prev.map((enq) => (enq._id === id ? { ...enq, status: newStatus } : enq))
        );
        showFeedback('success', `Enquiry status marked as ${newStatus}.`);
      }
    } catch (err: any) {
      showFeedback('error', 'Could not update status.');
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await api.delete(`/enquiries/${id}`);
      if (res.data?.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
        showFeedback('success', 'Enquiry deleted.');
      }
    } catch (err: any) {
      showFeedback('error', 'Could not delete enquiry.');
    }
  };

  // --- GALLERY HANDLERS ---
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryModal.item?.title || !galleryModal.item?.imageUrl || !galleryModal.item?.category) {
      showFeedback('error', 'Please fill in Title, upload a Photo from your device, and select Category.');
      return;
    }

    try {
      if (galleryModal.item._id) {
        // Update
        const res = await api.put(`/gallery/${galleryModal.item._id}`, galleryModal.item);
        if (res.data?.success) {
          setGallery((prev) =>
            prev.map((g) => (g._id === galleryModal.item!._id ? res.data.item : g))
          );
          showFeedback('success', 'Gallery item updated successfully.');
        }
      } else {
        // Create
        const res = await api.post('/gallery', galleryModal.item);
        if (res.data?.success) {
          setGallery((prev) => [res.data.item, ...prev]);
          showFeedback('success', 'New gallery photo added.');
        }
      }
      setGalleryModal({ isOpen: false, item: null });
    } catch (err: any) {
      showFeedback('error', err.response?.data?.message || 'Error saving gallery item.');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.data?.success) {
        setGallery((prev) => prev.filter((g) => g._id !== id));
        showFeedback('success', 'Gallery item deleted.');
      }
    } catch (err: any) {
      showFeedback('error', 'Error deleting item.');
    }
  };

  // --- SERVICES HANDLERS ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceModal.item?.title || !serviceModal.item?.description) {
      showFeedback('error', 'Title and Description are required.');
      return;
    }

    try {
      if (serviceModal.item._id) {
        // Update
        const res = await api.put(`/services/${serviceModal.item._id}`, serviceModal.item);
        if (res.data?.success) {
          setServices((prev) =>
            prev.map((s) => (s._id === serviceModal.item!._id ? res.data.service : s))
          );
          showFeedback('success', 'Service updated successfully.');
        }
      } else {
        // Create
        const res = await api.post('/services', serviceModal.item);
        if (res.data?.success) {
          setServices((prev) => [...prev, res.data.service]);
          showFeedback('success', 'New service offering added.');
        }
      }
      setServiceModal({ isOpen: false, item: null });
    } catch (err: any) {
      showFeedback('error', err.response?.data?.message || 'Error saving service.');
    }
  };

  const handleToggleService = async (service: IService) => {
    try {
      const res = await api.put(`/services/${service._id}`, {
        isAvailable: !service.isAvailable,
      });
      if (res.data?.success) {
        setServices((prev) =>
          prev.map((s) => (s._id === service._id ? { ...s, isAvailable: !s.isAvailable } : s))
        );
        showFeedback('success', `Service availability set to ${!service.isAvailable ? 'Available' : 'Unavailable'}.`);
      }
    } catch (err) {
      showFeedback('error', 'Could not toggle availability.');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Remove this service offering?')) return;
    try {
      const res = await api.delete(`/services/${id}`);
      if (res.data?.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        showFeedback('success', 'Service removed.');
      }
    } catch (err: any) {
      showFeedback('error', 'Error removing service.');
    }
  };

  // --- ADMIN PROFILE HANDLER ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', profileForm);
      if (res.data?.success) {
        updateUser(res.data.user);
        setProfileForm((prev) => ({ ...prev, password: '' }));
        showFeedback('success', 'Admin profile and credentials updated.');
      }
    } catch (err: any) {
      showFeedback('error', err.response?.data?.message || 'Could not update profile.');
    }
  };

  // Filtered Enquiries
  const filteredEnquiries =
    enquiryFilter === 'All'
      ? enquiries
      : enquiries.filter((e) => e.status === enquiryFilter);

  const pendingCount = enquiries.filter((e) => e.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#f4ece9] text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#300505] text-white border-b border-gold-500/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-400 text-maroon-950 flex items-center justify-center font-bold shadow-gold-glow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif-royal text-lg font-bold text-white leading-tight">
                {settings.businessName}
              </h1>
              <span className="text-[10px] text-gold-300 uppercase tracking-widest font-semibold block">
                Admin Control Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-gold-300 hover:text-white bg-maroon-900 border border-gold-500/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Toast Feedback Message */}
      {feedback && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold flex items-center gap-2.5 animate-fadeIn border ${
            feedback.type === 'success'
              ? 'bg-emerald-800 text-white border-emerald-500'
              : 'bg-rose-800 text-white border-rose-500'
          }`}
        >
          {feedback.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-maroon-900 text-gold-300 shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
              activeTab === 'enquiries'
                ? 'bg-maroon-900 text-gold-300 shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Enquiries</span>
            {pendingCount > 0 && (
              <span className="ml-1 bg-amber-500 text-maroon-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-maroon-900 text-gold-300 shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Branding & Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'gallery'
                ? 'bg-maroon-900 text-gold-300 shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Gallery Management</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-maroon-900 text-gold-300 shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services & Rentals</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-maroon-900 text-gold-300 shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Login</span>
          </button>
        </div>

        {/* ------------------- TAB 1: OVERVIEW ------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Pending Requests</span>
                  <h3 className="text-3xl font-black text-amber-600 mt-1">{pendingCount}</h3>
                  <span className="text-xs text-slate-500">Requires follow-up</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Total Enquiries</span>
                  <h3 className="text-3xl font-black text-maroon-950 mt-1">{enquiries.length}</h3>
                  <span className="text-xs text-slate-500">Customer leads recorded</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-maroon-50 text-maroon-900 flex items-center justify-center">
                  <Inbox className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Active Services</span>
                  <h3 className="text-3xl font-black text-emerald-600 mt-1">
                    {services.filter((s) => s.isAvailable).length}
                  </h3>
                  <span className="text-xs text-slate-500">Out of {services.length} items</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Gallery Items</span>
                  <h3 className="text-3xl font-black text-blue-600 mt-1">{gallery.length}</h3>
                  <span className="text-xs text-slate-500">Showcased projects</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Image className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Enquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Enquiries Preview */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-serif-royal text-xl font-bold text-maroon-950">Recent Customer Bookings</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Latest booking inquiries from Bijoliya & nearby villages</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs font-bold text-maroon-800 hover:text-maroon-950 hover:underline"
                  >
                    View All →
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <p className="text-sm text-slate-500 py-8 text-center">No enquiries yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                          <th className="pb-3 font-semibold">Customer</th>
                          <th className="pb-3 font-semibold">Event / Date</th>
                          <th className="pb-3 font-semibold">Location</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {enquiries.slice(0, 5).map((enq) => (
                          <tr key={enq._id} className="hover:bg-slate-50/80">
                            <td className="py-3.5">
                              <div className="font-bold text-slate-900">{enq.customerName}</div>
                              <div className="text-xs text-slate-500">{enq.phone}</div>
                            </td>
                            <td className="py-3.5">
                              <div className="font-medium text-slate-800">{enq.eventType}</div>
                              <div className="text-xs text-slate-500">{enq.eventDate || 'Date not set'}</div>
                            </td>
                            <td className="py-3.5 text-xs text-slate-600">{enq.location || 'Bijoliya'}</td>
                            <td className="py-3.5">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                                  enq.status === 'Pending'
                                    ? 'bg-amber-100 text-amber-800'
                                    : enq.status === 'Contacted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <a
                                href={`tel:${enq.phone}`}
                                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Owner Info & Quick Settings Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-serif-royal text-lg font-bold text-maroon-950 mb-4">
                    Active Business Identity
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={
                        settings.ownerPhotoUrl ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
                      }
                      alt={settings.ownerName}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-gold-400 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{settings.ownerName}</h4>
                      <span className="text-xs text-slate-500 block">Proprietor & Manager</span>
                      <span className="text-xs font-semibold text-emerald-600 block mt-0.5">{settings.phone}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <strong className="block text-slate-700 mb-1">Registered Address:</strong>
                    {settings.address}
                  </div>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full mt-4 py-2.5 rounded-xl border border-maroon-800 text-maroon-900 hover:bg-maroon-50 text-xs font-bold transition-colors"
                  >
                    Edit Branding & Owner Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------- TAB 2: ENQUIRIES ------------------- */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-serif-royal text-2xl font-bold text-maroon-950">Customer Booking Enquiries</h2>
                <p className="text-xs text-slate-500 mt-1">Manage, call, and update customer booking statuses.</p>
              </div>

              {/* Status Filter Badges */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Pending', 'Contacted', 'Resolved'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setEnquiryFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      enquiryFilter === st
                        ? 'bg-maroon-900 text-gold-300 shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Inbox className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No enquiries found under "{enquiryFilter}" filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                      <th className="pb-3 font-semibold">Customer Details</th>
                      <th className="pb-3 font-semibold">Event & Date</th>
                      <th className="pb-3 font-semibold">Location</th>
                      <th className="pb-3 font-semibold">Requirements / Notes</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq._id} className="hover:bg-slate-50/80">
                        <td className="py-4">
                          <div className="font-bold text-slate-900">{enq.customerName}</div>
                          <div className="text-xs text-slate-500 font-mono">{enq.phone}</div>
                          <a
                            href={`tel:${enq.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1 hover:underline"
                          >
                            <Phone className="w-3 h-3" /> Call Customer
                          </a>
                        </td>
                        <td className="py-4">
                          <div className="font-medium text-slate-800">{enq.eventType}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{enq.eventDate || 'No date specified'}</span>
                          </div>
                        </td>
                        <td className="py-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{enq.location || 'Bijoliya area'}</span>
                          </div>
                        </td>
                        <td className="py-4 max-w-xs text-xs text-slate-600">
                          <p className="line-clamp-2">{enq.details || 'No additional note.'}</p>
                        </td>
                        <td className="py-4">
                          <select
                            value={enq.status}
                            onChange={(e) => handleStatusChange(enq._id, e.target.value as EnquiryStatus)}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                              enq.status === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : enq.status === 'Contacted'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleDeleteEnquiry(enq._id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ------------------- TAB 3: BRANDING & SETTINGS ------------------- */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h2 className="font-serif-royal text-2xl font-bold text-maroon-950">
                  Branding & Dynamic Site Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Updates reflect instantly across all visitor pages without code redeployments.
                </p>
              </div>
              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-gold-500 text-maroon-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-gold-glow transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.businessName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Proprietor / Owner Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.ownerName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Primary Phone Number (Calls & WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Business Physical Address
                </label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Owner Photo URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.ownerPhotoUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ownerPhotoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm font-mono text-xs"
                  />
                  {settingsForm.ownerPhotoUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={settingsForm.ownerPhotoUrl}
                        alt="Owner Preview"
                        className="w-16 h-16 rounded-xl object-cover border-2 border-gold-400"
                      />
                      <span className="text-xs text-slate-500">Live Preview</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Hero Banner Background Image URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.heroBannerUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBannerUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm font-mono text-xs"
                  />
                  {settingsForm.heroBannerUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={settingsForm.heroBannerUrl}
                        alt="Banner Preview"
                        className="w-24 h-14 rounded-lg object-cover border border-slate-300"
                      />
                      <span className="text-xs text-slate-500">Live Preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Hero Section Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm font-serif-royal font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Hero Section Subtitle
                  </label>
                  <textarea
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Owner Welcome & About Us Narrative
                  </label>
                  <textarea
                    value={settingsForm.aboutText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-maroon-800 text-sm resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="bg-maroon-900 hover:bg-maroon-800 text-gold-300 font-bold px-8 py-3 rounded-xl text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Branding Changes</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ------------------- TAB 4: GALLERY MANAGEMENT ------------------- */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-serif-royal text-2xl font-bold text-maroon-950">Gallery Projects</h2>
                <p className="text-xs text-slate-500 mt-1">Upload and organize past wedding, monsoon tent, and utensil rentals.</p>
              </div>
              <button
                onClick={() =>
                  setGalleryModal({
                    isOpen: true,
                    item: {
                      title: '',
                      description: '',
                      imageUrl: '',
                      location: 'Bijoliya, Bhilwara',
                      category: 'Tent Decoration',
                    },
                  })
                }
                className="flex items-center gap-2 bg-maroon-900 hover:bg-maroon-800 text-gold-300 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-900">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-maroon-950/90 text-gold-300 border border-gold-400/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h4 className="font-serif-royal font-bold text-maroon-950 text-base">{item.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gold-600" />
                        <span>{item.location}</span>
                      </p>
                      {item.description && (
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-200/60 mt-2 pt-3">
                    <button
                      onClick={() => setGalleryModal({ isOpen: true, item })}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-maroon-900"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteGallery(item._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Gallery Modal */}
            {galleryModal.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gold-500/40">
                  <div className="bg-maroon-950 text-white p-5 flex items-center justify-between">
                    <h3 className="font-serif-royal text-lg font-bold">
                      {galleryModal.item?._id ? 'Edit Gallery Photo' : 'Add Project Photo'}
                    </h3>
                    <button
                      onClick={() => setGalleryModal({ isOpen: false, item: null })}
                      className="text-slate-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveGallery} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={galleryModal.item?.title || ''}
                        onChange={(e) =>
                          setGalleryModal({
                            ...galleryModal,
                            item: { ...galleryModal.item, title: e.target.value },
                          })
                        }
                        required
                        placeholder="e.g. Royal Wedding Mandap"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Category *
                      </label>
                      <select
                        value={galleryModal.item?.category || 'Tent Decoration'}
                        onChange={(e) =>
                          setGalleryModal({
                            ...galleryModal,
                            item: { ...galleryModal.item, category: e.target.value as GalleryCategory },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                      >
                        <option value="Tent Decoration">Tent Decoration</option>
                        <option value="Waterproof Tents">Waterproof Tents</option>
                        <option value="Utensils Rental">Utensils Rental</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Upload Project Photo from Gallery / Device *
                      </label>
                      {galleryModal.item?.imageUrl ? (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-gold-400 bg-black group">
                          <img
                            src={galleryModal.item.imageUrl}
                            alt="Selected project"
                            className="w-full h-52 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="cursor-pointer bg-gold-400 hover:bg-gold-300 text-maroon-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105">
                              <UploadCloud className="w-4 h-4" />
                              <span>Choose Different Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setIsUploadingImage(true);
                                  try {
                                    const base64 = await compressAndLoadImage(file);
                                    setGalleryModal((prev) => ({
                                      ...prev,
                                      item: { ...prev.item, imageUrl: base64 },
                                    }));
                                    showFeedback('success', `Photo "${file.name}" loaded.`);
                                  } catch (err: any) {
                                    showFeedback('error', err.message || 'Could not load photo.');
                                  } finally {
                                    setIsUploadingImage(false);
                                  }
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setGalleryModal((prev) => ({
                                  ...prev,
                                  item: { ...prev.item, imageUrl: '' },
                                }))
                              }
                              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-maroon-950/80 text-gold-300 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-gold-400/40">
                            Photo Loaded from Device • Hover to change
                          </div>
                        </div>
                      ) : (
                        <label
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={async (e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (!file) return;
                            setIsUploadingImage(true);
                            try {
                              const base64 = await compressAndLoadImage(file);
                              setGalleryModal((prev) => ({
                                ...prev,
                                item: { ...prev.item, imageUrl: base64 },
                              }));
                              showFeedback('success', `Photo "${file.name}" loaded.`);
                            } catch (err: any) {
                              showFeedback('error', err.message || 'Could not load photo.');
                            } finally {
                              setIsUploadingImage(false);
                            }
                          }}
                          className="border-2 border-dashed border-gold-400/70 hover:border-gold-500 bg-gold-50/30 hover:bg-gold-50/70 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center group"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploadingImage(true);
                              try {
                                const base64 = await compressAndLoadImage(file);
                                setGalleryModal((prev) => ({
                                  ...prev,
                                  item: { ...prev.item, imageUrl: base64 },
                                }));
                                showFeedback('success', `Photo "${file.name}" loaded.`);
                              } catch (err: any) {
                                showFeedback('error', err.message || 'Could not load photo.');
                              } finally {
                                setIsUploadingImage(false);
                              }
                            }}
                          />
                          <div className="w-14 h-14 rounded-2xl bg-gold-400/20 text-maroon-950 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8 text-maroon-900" />
                          </div>
                          <p className="text-sm font-bold text-maroon-950">
                            Select a photo from your computer / gallery
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            JPG, PNG, WEBP • Click to browse or drag & drop file
                          </p>
                          <span className="mt-3 px-4 py-1.5 rounded-full bg-maroon-900 hover:bg-maroon-950 text-gold-300 text-xs font-bold shadow-sm">
                            Browse Photo File
                          </span>
                        </label>
                      )}
                      {isUploadingImage && (
                        <p className="text-xs text-amber-700 font-semibold mt-1.5 animate-pulse flex items-center gap-1">
                          <span className="inline-block animate-spin">⟳</span>
                          <span>Processing and optimizing photo...</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={galleryModal.item?.location || ''}
                        onChange={(e) =>
                          setGalleryModal({
                            ...galleryModal,
                            item: { ...galleryModal.item, location: e.target.value },
                          })
                        }
                        placeholder="Bijoliya, Bhilwara"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Description / Notes
                      </label>
                      <textarea
                        value={galleryModal.item?.description || ''}
                        onChange={(e) =>
                          setGalleryModal({
                            ...galleryModal,
                            item: { ...galleryModal.item, description: e.target.value },
                          })
                        }
                        rows={2}
                        placeholder="Setup details..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm resize-none"
                      />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setGalleryModal({ isOpen: false, item: null })}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-maroon-900 text-gold-300 font-bold px-6 py-2 rounded-xl text-xs shadow-md"
                      >
                        Save Photo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------- TAB 5: SERVICES & RENTALS ------------------- */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-serif-royal text-2xl font-bold text-maroon-950">Service Offerings & Cookware Fleet</h2>
                <p className="text-xs text-slate-500 mt-1">Manage event services, catering cookware catalog, and availability switches.</p>
              </div>
              <button
                onClick={() =>
                  setServiceModal({
                    isOpen: true,
                    item: {
                      title: '',
                      description: '',
                      iconName: 'Tent',
                      imageUrl: '',
                      priceTag: 'Custom Wedding Packages',
                      isAvailable: true,
                    },
                  })
                }
                className="flex items-center gap-2 bg-maroon-900 hover:bg-maroon-800 text-gold-300 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv._id}
                  className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    srv.isAvailable
                      ? 'bg-white border-slate-200 shadow-sm'
                      : 'bg-slate-50 border-slate-300 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold-100 text-maroon-950 border border-gold-300">
                        {srv.priceTag}
                      </span>
                      <button
                        onClick={() => handleToggleService(srv)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                          srv.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {srv.isAvailable ? '✓ Available' : '✕ Unavailable'}
                      </button>
                    </div>

                    <h3 className="font-serif-royal font-bold text-lg text-maroon-950">{srv.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{srv.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setServiceModal({ isOpen: true, item: srv })}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-maroon-900"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Service</span>
                    </button>
                    <button
                      onClick={() => handleDeleteService(srv._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Modal */}
            {serviceModal.isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gold-500/40">
                  <div className="bg-maroon-950 text-white p-5 flex items-center justify-between">
                    <h3 className="font-serif-royal text-lg font-bold">
                      {serviceModal.item?._id ? 'Edit Service Offering' : 'Add New Service'}
                    </h3>
                    <button
                      onClick={() => setServiceModal({ isOpen: false, item: null })}
                      className="text-slate-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Service Title *
                      </label>
                      <input
                        type="text"
                        value={serviceModal.item?.title || ''}
                        onChange={(e) =>
                          setServiceModal({
                            ...serviceModal,
                            item: { ...serviceModal.item, title: e.target.value },
                          })
                        }
                        required
                        placeholder="e.g. Waterproof Monsoon Tents"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Price Tag / Pricing Text
                      </label>
                      <input
                        type="text"
                        value={serviceModal.item?.priceTag || ''}
                        onChange={(e) =>
                          setServiceModal({
                            ...serviceModal,
                            item: { ...serviceModal.item, priceTag: e.target.value },
                          })
                        }
                        placeholder="Custom Packages / Per Event"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={serviceModal.item?.imageUrl || ''}
                        onChange={(e) =>
                          setServiceModal({
                            ...serviceModal,
                            item: { ...serviceModal.item, imageUrl: e.target.value },
                          })
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Description *
                      </label>
                      <textarea
                        value={serviceModal.item?.description || ''}
                        onChange={(e) =>
                          setServiceModal({
                            ...serviceModal,
                            item: { ...serviceModal.item, description: e.target.value },
                          })
                        }
                        required
                        rows={3}
                        placeholder="Detailed service explanation..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm resize-none"
                      />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setServiceModal({ isOpen: false, item: null })}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-maroon-900 text-gold-300 font-bold px-6 py-2 rounded-xl text-xs shadow-md"
                      >
                        Save Service
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------- TAB 6: SECURITY & PROFILE ------------------- */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-xl mx-auto">
            <h2 className="font-serif-royal text-2xl font-bold text-maroon-950 mb-2">
              Admin Account & Security
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Update your administrative profile details and login password.
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admin Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Admin Phone
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Change Password (Leave empty to keep current)
                </label>
                <input
                  type="password"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-maroon-900 hover:bg-maroon-800 text-gold-300 font-bold py-3 rounded-xl text-sm shadow-md transition-all"
              >
                Save Account Credentials
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
