import PricingFirstScreen from "../components/pricing/PricingFirstScreen";
import PricingSecondScreen from "./../components/pricing/PricingSecondScreen";
import PricingSpecialText from "./../components/pricing/PricingSpecialText";
import PricingFooter from "./../components/pricing/PricingFooter";
export default function Pricing() {
  return (
    <div>
      <PricingFirstScreen />
      <PricingSecondScreen />
      <PricingSpecialText />
      <PricingFooter />
    </div>
  );
}
