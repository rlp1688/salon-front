import { useState } from 'react';
import axios from 'axios';

export default function VeloraChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    
  
    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    
    try {
     
      const res = await axios.post('http://localhost:5000/api/ai/chat', {
        prompt: input,
        role: 'customer'
      });
     
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'ai' }]);
    } catch (err) { 
      alert("AI service unavailable. Make sure your server is running!"); 
    }
    
    setInput('');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #e5c158', background: '#000', marginTop: '20px' }}>
      <div style={{ height: '150px', overflowY: 'auto', marginBottom: '10px', borderBottom: '1px solid #333' }}>
        {messages.map((m, i) => (
          <p key={i} style={{ color: m.sender === 'ai' ? '#e5c158' : '#fff', margin: '5px 0' }}>
            <strong>{m.sender.toUpperCase()}:</strong> {m.text}
          </p>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask for beauty advice..." 
          style={{ flex: 1, padding: '10px', background: '#000', border: '1px solid #e5c158', color: '#fff' }} 
        />
        <button onClick={sendMessage} style={{ padding: '10px', background: '#e5c158', border: 'none', cursor: 'pointer' }}>
          SEND
        </button>
      </div>
    </div>
  );
}