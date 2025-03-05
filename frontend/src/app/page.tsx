'use client'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios'


export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sentMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages([ ...messages, newMessage ]);

    setLoading(true)

    try{
      const response = await axios.post("http://localhost:8000/chat", { 
      message: input
    });
    
    setMessages([ ...messages, newMessage, { role: "ai", content: response.data.reply }]);
    setInput("")
  }
  
    catch (error){
      console.log("error with backend connection: ", error)
    } finally {
      setInput("") //reset input field after sending the message :)
      setLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sentMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); 

  return (
    <main className="chat-container">
      <h1 className="chat-title"> Welcome to Hafeef<em>Ai</em> ! </h1>
      <h2> ai </h2>

      <section className="messages-container">
        {messages.map((msg, index) => (
          <article key={index} className={`message ${msg.role === "user" ? "user-message" : "ai-message"}`}>
            <span className="role">{msg.role === "user" ? "You" : "AI"}:</span> {msg.content}
          </article>
        ))}
        {loading && <p className="loading">AI is typing...</p>}
        <div ref={messagesEndRef}></div>
      </section>

      <footer className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="input"
        />
        <button onClick={sentMessage} className="send-button">
          Send
        </button>
      </footer>
      <div className='helpful-tip'> If I'm not working, it likely means there is a server overload on Anothropic's side, nothing really wrong with me! Just try again later :D</div>
  </main>  );
}
