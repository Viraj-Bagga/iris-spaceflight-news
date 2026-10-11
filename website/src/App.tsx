import { Starfield } from "./components/Starfield";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HowItWorks, WhyIris, Setup, About } from "./components/ContentSections";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <Starfield />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <WhyIris />
        <Setup />
        <About />
      </main>
      <Footer />
    </>
  );
}

export default App;
