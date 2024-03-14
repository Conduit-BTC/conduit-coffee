import "./App.css";
import HeaderLayout from "./layouts/HeaderLayout";
import BodyLayout from "./layouts/BodyLayout";
import FooterLayout from "./layouts/FooterLayout";
import "@fontsource/fira-code/400.css";
import "@fontsource/fira-code/700.css";
import "@fontsource/fira-sans";

function App() {
  return (
    <main className="p-2 bg-cyan-700 h-screen">
      <section className="bg-black/50 flex flex-col justify-between w-full h-full p-2 border-4 border-cyan-500">
        <HeaderLayout />
        <BodyLayout />
        <FooterLayout />
      </section>
    </main>
  );
}

export default App;
