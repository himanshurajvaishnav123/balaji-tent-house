import { useState, FormEvent } from "react";
import { Loader2, Save, CheckCircle2, KeyRound } from "lucide-react";
import { authApi } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const AccountManager = () => {
  const { user, refreshUser } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSaved(false);
    setProfileSaving(true);
    try {
      await authApi.updateProfile(profile);
      await refreshUser();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || "Failed to update account details.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (passwords.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      await authApi.changePassword(passwords.currentPassword, passwords.newPassword);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-charcoal/10 p-6 space-y-5">
        <h3 className="font-display font-semibold text-lg text-charcoal">Admin Account Details</h3>
        <p className="text-sm text-charcoal/60 -mt-3">
          This is the email and name used to log in to this dashboard — separate from the public contact email shown on the website.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Name</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Phone</label>
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-charcoal mb-1.5">Login Email (Gmail or any email)</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
            />
          </div>
        </div>

        {profileError && <p className="text-sm text-red-600">{profileError}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={profileSaving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-6 py-2.5 font-semibold text-ivory hover:bg-maroon-dark transition-colors disabled:opacity-60"
          >
            {profileSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {profileSaving ? "Saving..." : "Save Account Details"}
          </button>
          {profileSaved && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-charcoal/10 p-6 space-y-5">
        <h3 className="font-display font-semibold text-lg text-charcoal flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-maroon" />
          Change Password
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
                minLength={8}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full rounded-lg border border-charcoal/15 px-3 py-2 focus:border-maroon outline-none"
                minLength={8}
                required
              />
            </div>
          </div>
        </div>

        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={passwordSaving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-maroon px-6 py-2.5 font-semibold text-ivory hover:bg-maroon-dark transition-colors disabled:opacity-60"
          >
            {passwordSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
          {passwordSaved && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" /> Password updated
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AccountManager;
