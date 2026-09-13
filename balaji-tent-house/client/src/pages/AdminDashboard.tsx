import { useState } from "react";
import { LogOut, Images, MessageSquare, Settings, Tent, UserCog } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import GalleryManager from "../admin/components/GalleryManager";
import EnquiryManager from "../admin/components/EnquiryManager";
import SettingsManager from "../admin/components/SettingsManager";
import AccountManager from "../admin/components/AccountManager";

type Tab = "enquiries" | "gallery" | "settings" | "account";

const TABS: { id: Tab; label: string; icon: typeof Images }[] = [
  { id: "enquiries", label: "Enquiries", icon: MessageSquare },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "settings", label: "Site Settings", icon: Settings },
  { id: "account", label: "Account", icon: UserCog },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("enquiries");

  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-maroon text-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-full bg-marigold flex items-center justify-center">
              <Tent className="h-4 w-4 text-maroon" />
            </span>
            <span className="font-display font-semibold">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-ivory/80 hidden sm:inline">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-sm font-medium bg-ivory/10 hover:bg-ivory/20 px-3.5 py-2 rounded-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 border-b border-charcoal/10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-maroon text-maroon"
                  : "border-transparent text-charcoal/60 hover:text-charcoal"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "enquiries" && <EnquiryManager />}
        {tab === "gallery" && <GalleryManager />}
        {tab === "settings" && <SettingsManager />}
        {tab === "account" && <AccountManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;
