import FirstScreen from "./components/main-page/FirstScreen";
import SecondScreen from "./components/main-page/SecondScreen";
import ThirdScreen from "./components/main-page/ThirdScreen";
import ForthScreen from "./components/main-page/ForthScreen";
import FifthScreen from "./components/main-page/FifthScreen";
import PopularSpeakers from "./components/main-page/PopularSpeakers";
import Contacts from "./components/main-page/Contacts";
import SpecialText from "./components/main-page/SpecialText";
import Footer from "./components/main-page/Footer";

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
