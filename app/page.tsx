import Hero from "./Components/Hero";
import Footer from "./Components/Footer";
import Header from "./Components/Header";

export default function Home() {
  return (
    <main className="relative w-full max-w-full overflow-x-hidden">
      <Header />
      <Hero />
      <Footer />
    </main>
  );
}
