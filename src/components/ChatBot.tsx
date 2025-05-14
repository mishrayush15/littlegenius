import { Bot, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI("AIzaSyDExh3-irPk8fIPwztWhSTWbNdgV-FOy_c");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your Little Genius Assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage("");

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Check if user wants to end conversation
      const endPrompt = `Answer in yes or no if the user wants to end the conversation!: ${userMessage}`;
      const endResponse = await model.generateContent(endPrompt);

      const endText = endResponse.response.text();
      // if (endText?.toLowerCase().includes("yes")) {
      //   setMessages((prev) => [
      //     ...prev,
      //     { role: "assistant", content: "Keep learning! Goodbye!" },
      //   ]);
      //   setTimeout(() => setIsOpen(false), 2000);
      //   return;
      // }

      // Get AI response
      const prompt = `
        You are Little Bot, an advanced AI chatbot created for the educational platform LittleGenius. You can engage in basic conversations like greetings, but your primary function is to assist users with questions strictly related to Programming (including writing, debugging, and explaining code), Design, Business, Marketing, Money Management, Computational Thinking, and any topic directly related to education. You must provide accurate, clear, and learner-friendly responses that support the user’s educational journey. If a question is outside these areas and not connected to education, respond professionally with: "I'm here to help with topics related to Programming, Design, Business, Marketing, Money Management, Computational Thinking, or anything educational. For other topics, I’m not currently allowed to respond. Let’s stick to learning together!" Always maintain a professional and educational tone in your responses..
        User message: ${userMessage}`;

      const aiResponse = await model.generateContent(prompt);
      const response = aiResponse.response.text();
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I apologize, but I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 p-0 flex items-center justify-center"
        size="icon"
      >
        <Bot className="h-8 w-8 text-primary-foreground animate-bounce" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90%] max-w-[400px] h-[600px] p-0 gap-0 bg-white rounded-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold">Little Genius Assistant</h2>
            </div>
          </div>

          {/* Chat Area - Made scrollable with fixed height */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""
                      }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-lg shadow-sm max-w-[80%] ${msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-white"
                        }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm">Typing...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Message Input - Fixed at bottom */}
          <div className="border-t bg-white p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="rounded-full px-4"
                disabled={!message.trim() || isLoading}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBot;
