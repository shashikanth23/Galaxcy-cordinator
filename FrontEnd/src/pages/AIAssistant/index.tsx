import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Plus, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiApi } from '../../api/client';
import { useAuthStore } from '../../store/stores';

interface Msg { role:'user'|'assistant'; content:string; }

const STARTERS = [
  'How do black holes form?',
  'What is the Great Red Spot on Jupiter?',
  'How far is the nearest star?',
  'Explain dark matter simply',
  'What would happen if you fell into a black hole?',
  'How are planets formed?',
];

function Bubble({ msg }:{ msg:Msg }) {
  const isUser = msg.role==='user';
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={`flex gap-3 ${isUser?'flex-row-reverse':''}`}>
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${isUser?'bg-aurora/20 border-aurora/40':'bg-nova/20 border-nova/40'}`}>
        {isUser ? <User className="w-4 h-4 text-aurora"/> : <Bot className="w-4 h-4 text-nova"/>}
      </div>
      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap border
        ${isUser?'bg-aurora/15 border-aurora/20 rounded-tr-sm':'bg-stellar/30 border-glassborder rounded-tl-sm text-white/90'}`}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function AIAssistantPage() {
  const [messages, setMessages]         = useState<Msg[]>([]);
  const [input, setInput]               = useState('');
  const [streaming, setStreaming]       = useState(false);
  const [convId, setConvId]             = useState<string|null>(null);
  const [currentResp, setCurrentResp]  = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}); },[messages,currentResp]);

  const send = async (text:string) => {
    if (!text.trim() || streaming) return;
    setMessages(p=>[...p,{role:'user',content:text}]);
    setInput(''); setStreaming(true); setCurrentResp('');
    try {
      let acc = '';
      await aiApi.chatStream(text, convId, messages,
        chunk=>{ acc+=chunk; setCurrentResp(acc); },
        id=>{ setConvId(id); }
      );
      setMessages(p=>[...p,{role:'assistant',content:acc}]);
    } catch {
      setMessages(p=>[...p,{role:'assistant',content:'❌ Failed to get response. Please try again.'}]);
    } finally { setStreaming(false); setCurrentResp(''); }
  };

  if (!isAuthenticated) return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="glass-card p-10 text-center max-w-sm">
        <div className="text-5xl mb-4">🤖</div>
        <h2 className="text-xl font-bold text-white mb-2">AI Astronomy Assistant</h2>
        <p className="text-white/50 text-sm mb-6">Sign in to chat with your personal space expert</p>
        <Link to="/auth/login" className="btn-primary mx-auto">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-glassborder flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-nova/15 border border-nova/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-nova"/>
          </div>
          <div>
            <p className="font-semibold text-white">Galaxcy AI</p>
            <p className="text-white/40 text-xs">Astronomy Expert · Powered by Claude</p>
          </div>
        </div>
        <button onClick={()=>{setMessages([]);setConvId(null);setCurrentResp('');}} className="btn-ghost px-3 py-1.5 text-xs">
          <Plus className="w-3 h-3"/> New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-5">
        {messages.length===0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">🌌</div>
            <h3 className="text-xl font-bold text-white mb-2">Ask me anything about space</h3>
            <p className="text-white/40 text-sm mb-8 max-w-sm">Astrophysics, space missions, celestial objects, cosmology — I know it all.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {STARTERS.map(s=>(
                <button key={s} onClick={()=>send(s)}
                  className="glass-card p-3 text-left text-sm text-white/60 hover:text-aurora hover:border-aurora/30 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m,i)=><Bubble key={i} msg={m}/>)}
        {streaming && currentResp && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-nova/20 border border-nova/40 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-nova"/>
            </div>
            <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tl-sm text-sm bg-stellar/30 border border-glassborder text-white/90 whitespace-pre-wrap">
              {currentResp}<span className="inline-block w-0.5 h-4 bg-aurora ml-0.5 animate-pulse"/>
            </div>
          </motion.div>
        )}
        {streaming && !currentResp && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-nova/20 border border-nova/40 flex items-center justify-center flex-shrink-0">
              <Loader className="w-4 h-4 text-nova animate-spin"/>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-stellar/30 border border-glassborder flex gap-1 items-center">
              {[0,1,2].map(i=><span key={i} className="w-1.5 h-1.5 rounded-full bg-nova/60 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div className="px-4 md:px-8 py-4 border-t border-glassborder flex-shrink-0">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&(e.preventDefault(),send(input))}
            placeholder="Ask about any celestial object or space concept..."
            className="input-space flex-1" disabled={streaming}/>
          <button onClick={()=>send(input)} disabled={streaming||!input.trim()} className="btn-primary px-4 disabled:opacity-40">
            <Send className="w-4 h-4"/>
          </button>
        </div>
        <p className="text-center text-white/20 text-xs mt-2">Powered by Anthropic Claude · Astronomy-tuned</p>
      </div>
    </div>
  );
}
