import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import OwnerProfile from "../components/OwnerProfile";
import Gallery from "../components/Gallery";
import EnquiryForm from "../components/EnquiryForm";
import Footer from "../components/Footer";
import QuickActions from "../components/QuickActions";
import { settingsApi } from "../api/client";
import type { SiteSettings } from "../types";

const Home = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    settingsApi
      .get()
      .then((res) => setSettings(res.data))
      .catch(() => setSettings(null));
  }, []);

  return (
    <div className="min-h-screen">
      <Header settings={settings} />
      <Hero settings={settings} />
      <Services />
      <OwnerProfile settings={settings} />
      <Gallery />
      <EnquiryForm />
      <Footer settings={settings} />
      <QuickActions settings={settings} />
    </div>
  );
};

export default Home;
