import { useRef, useEffect, useState } from "react";
import { ChatWindow } from "./ChatWindow"; 
import { ChatFooter } from "./ChatFooter"; 
import { useChat } from "../../contexts/ChatContext"; 
import { fetchAIResponse } from "../../utils/api"; 
import styles from "./Chat.module.css";

export function Chat() {
  const { messages, setMessages, selectedModel, saveMessage, loading, error } = useChat(); 
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef([]); 

  // ✅ Debugging: Check if Chat is rendering multiple times
  useEffect(() => {
    console.log("Chat component rendered!");
  }, []); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  async function handleUserMessage(content) {
    if (!content.trim()) return;

    const userMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(userMessage);
    setIsTyping(true);

    try {
      const updatedMessages = [...messagesRef.current, userMessage];
      const aiResponse = await fetchAIResponse(selectedModel, updatedMessages);
      const assistantMessage = { role: "assistant", content: aiResponse };

      setMessages((prev) => [...prev, assistantMessage]);
      await saveMessage(assistantMessage);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ AI is currently unavailable. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  }
  
  return (
    <div className={styles.ChatContainer}> 
      {error && <div className={styles.Error}>⚠️ {error}</div>}
      {loading && <div className={styles.Loading}>Loading chat history...</div>}

      <ChatWindow messages={messages} isTyping={isTyping} />
      <ChatFooter onSendMessage={handleUserMessage} setIsTyping={setIsTyping} />

      {/* Ensures auto-scroll works */}
      <div ref={messagesEndRef} style={{ height: "1px" }} />
    </div>
  );
}
