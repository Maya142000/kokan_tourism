import Home from "../components/Home/home";
import Navbar from "../components/Navbar/navbar";
import Preloader from "../components/Preloader/preloader";
import ChatBot from "../components/ChatBot/chatbot";

export default function Page() {
  return (
    <main>
      <Preloader />
      <Home />
      <Navbar />
      {/* <ChatBot /> */}
    </main>
  );
}