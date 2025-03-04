'use client'
import { useState } from 'react';
import axios from 'axios'


export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])

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

  return (
    <section>
      {messages.map((msg, index) => (
        <div key={index} style={{ color: msg.role === "user" ? "pink" : "green" }}>
          {msg.role}: {msg.content}
        </div>
      ))}

      {loading && <div> Loading... </div>}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sentMessage}>Send</button>
    </section>
  );
}
