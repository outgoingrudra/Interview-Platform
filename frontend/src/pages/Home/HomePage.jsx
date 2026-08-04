import Navbar from "../../components/layout/Navbar";

import HeroSection from "./Hero";
import FeaturesSection from "./Features";
import WhyChooseSection from "./WhyChoose";
import HowItWorksSection from "./HowItWorks";
import StatsSection from "./Stats";
import CallToAction from "./CallToAction";





export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <Navbar />

      <HeroSection />

      <FeaturesSection />

      <WhyChooseSection />

      <HowItWorksSection />

      <StatsSection />

      <CallToAction />
    </main>
  );
}