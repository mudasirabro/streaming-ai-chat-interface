import { ChatContainer } from "@/components/chat/ChatContainer";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col w-full h-[100dvh] overflow-hidden">
      <ChatContainer />
    </main>
  );
}
