import FirstScreen from "./components/FirstScreen";
import SecondScreen from "./components/SecondScreen";
import ThirdScreen from "./components/ThirdScreen";
import ForthScreen from "./components/ForthScreen";
import FifthScreen from "./components/FifthScreen";
import PopularSpeakers from "./components/PopularSpeakers";
import Contacts from "./components/Contacts";
import SpecialText from "./components/SpecialText";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <div>
      <FirstScreen />
      <SecondScreen />
      <ThirdScreen />
      <ForthScreen />
      <FifthScreen />
      <PopularSpeakers />
      <Contacts />
      <SpecialText />
      <Footer />
    </div>
  );
}
