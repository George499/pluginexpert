import PricingFirstScreen from "@/components/pricing/PricingFirstScreen";
import PricingSecondScreen from "@/components/pricing/PricingSecondScreen";
import PricingSpecialText from "@/components/pricing/PricingSpecialText";
import Footer from "@/components/main-page/Footer";
export default function Pricing() {
  return (
    <div>
      <PricingFirstScreen />
      <PricingSecondScreen />
      <PricingSpecialText />
      <Footer />
    </div>
  );
}
