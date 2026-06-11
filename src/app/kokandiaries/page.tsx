import KokanDiaries from "@/src/components/Kokan_Diaries/kokandiaries";
import Navbar from "@/src/components/Navbar/navbar";
import ChatBot from "@/src/components/ChatBot/chatbot";

export default function KokanDiariesPage() {
  return (
    <main>
      <KokanDiaries />
      <Navbar />
      <ChatBot />
    </main>
  );
}
