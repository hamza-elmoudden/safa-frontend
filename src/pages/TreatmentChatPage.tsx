import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ImagePlus, X, ArrowLeft, Stethoscope } from 'lucide-react';
import api, { API_BASE } from '../api';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  imageUrl?: string;
  loading?: boolean;
}

interface Treatment {
  id: string;
  title: string;
  concern_type: string;
  status: string;
  improvement_pct?: number | null;
  initial_photo_url?: string;
}


const renderMarkdown = (text: string): string => {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #eee;margin:10px 0"/>')
    .replace(/^#{1,3} (.+)$/gm, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '• $1')
    .replace(/\n/g, '<br/>');
};

const TreatmentChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/treatment/${id}`).then(r => setTreatment(r.data)).catch(() => {});
    api.get(`/chattreatment/${id}`).then(r => {
      const chats = r.data || [];
      const msgs: Message[] = chats.flatMap((c: any) => [
        { id: c.id + '-u', role: 'user' as const, text: c.user_message, imageUrl: c.image_url },
        { id: c.id + '-a', role: 'ai' as const, text: c.ai_response },
      ]);
      setMessages(msgs);
    }).catch(() => {});
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImage(f);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const autoResize = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
  };

  const send = useCallback(async () => {
    if (!input.trim() && !image) return;
    if (sending || !id) return;

    const userMsg: Message = { id: Date.now() + '-u', role: 'user', text: input, imageUrl: imagePreview || undefined };
    const aiMsg: Message = { id: Date.now() + '-a', role: 'ai', text: '', loading: true };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    const sentInput = input;
    const sentImage = image;
    setInput('');
    setImage(null);
    setImagePreview(null);
    setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const token = localStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('text', sentInput);
      if (sentImage) formData.append('image', sentImage);

      const response = await fetch(`${API_BASE}/ai/treatment?treatmentId=${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, loading: false } : m));

      let fullText = '';
      if (reader) {
        let done = false;
        while (!done) {
          const result = await reader.read();
          done = result.done;
          if (!done && result.value) {
            fullText += decoder.decode(result.value, { stream: true });
            setMessages(prev =>
              prev.map(m => m.id === aiMsg.id ? { ...m, text: fullText } : m)
            );
          }
        }
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, text: 'Sorry, something went wrong.', loading: false } : m));
    } finally {
      setSending(false);
    }
  }, [input, image, imagePreview, sending, id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px', background: 'var(--white)',
        borderBottom: '1px solid var(--blush)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => navigate('/app/treatments')} style={{ background: 'none', color: 'var(--charcoal)', padding: 4 }}>
          <ArrowLeft size={20} />
        </button>

        {treatment?.initial_photo_url ? (
          <img src={treatment.initial_photo_url} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#8fc6a0,#5a9e72)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={18} color='white' />
          </div>
        )}

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <p style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {treatment?.title || 'Treatment Chat'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--sage)' }}>● Dr. Safa · Dermatology AI</p>
        </div>

        {treatment?.improvement_pct != null && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--sage)' }}>{Number(treatment.improvement_pct).toFixed(0)}%</p>
            <p style={{ fontSize: 10, color: 'var(--muted)' }}>improved</p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', animation: 'fadeIn 0.6s ease' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
              background: 'linear-gradient(135deg,#8fc6a0,#5a9e72)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Stethoscope size={28} color='white' />
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Dr. Safa is ready</h3>
            <p style={{ fontSize: 14, color: 'var(--warm-gray)', lineHeight: 1.7, maxWidth: 300, margin: '0 auto' }}>
              Share a progress photo or describe how your skin is doing. Dr. Safa will analyze and update your treatment plan.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {['كيف تطورت بشرتي؟', 'هل هناك تحسن؟', "Here's my progress photo", 'Update my treatment plan'].map(s => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  style={{
                    background: 'rgba(90,158,114,0.1)', border: '1px solid rgba(90,158,114,0.3)',
                    borderRadius: 20, padding: '7px 14px', fontSize: 12,
                    color: 'var(--sage)', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.3s ease',
              gap: 8, alignItems: 'flex-end',
            }}
          >
            {msg.role === 'ai' && (
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg,#8fc6a0,#5a9e72)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Stethoscope size={13} color='white' />
              </div>
            )}

            <div style={{
              maxWidth: '75%',
              background: msg.role === 'user' ? 'var(--rose-deep)' : 'var(--white)',
              color: msg.role === 'user' ? 'white' : 'var(--charcoal)',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding: '12px 16px',
              boxShadow: msg.role === 'ai' ? 'var(--shadow)' : 'none',
              fontSize: 14, lineHeight: 1.7,
            }}>
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl} alt="uploaded"
                  style={{ width: '100%', maxWidth: 240, borderRadius: 10, marginBottom: 8, display: 'block', objectFit: 'cover' }}
                />
              )}
              {msg.loading ? (
                <div style={{ display: 'flex', gap: 5, padding: '2px 0' }}>
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              ) : msg.role === 'ai' ? (
                <div style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
              ) : (
                <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px 16px', background: 'var(--white)', borderTop: '1px solid var(--blush)' }}>
        {imagePreview && (
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
            <img src={imagePreview} alt="preview" style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', border: '2px solid var(--sage-light)' }} />
            <button
              onClick={() => { setImage(null); setImagePreview(null); }}
              style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: 'var(--rose-deep)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
            >
              <X size={11} />
            </button>
          </div>
        )}

        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 10,
          background: 'var(--cream)', borderRadius: 20,
          border: '1.5px solid var(--blush)', padding: '8px 12px',
        }}>
          <button onClick={() => fileRef.current?.click()} style={{ background: 'none', color: 'var(--muted)', padding: 4 }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--sage)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
            <ImagePlus size={20} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="Share your progress or ask Dr. Safa…"
            rows={1}
            style={{ flex: 1, resize: 'none', background: 'none', border: 'none', fontSize: 14, color: 'var(--charcoal)', lineHeight: 1.6, maxHeight: 120, overflowY: 'auto' }}
          />

          <button
            onClick={send}
            disabled={!input.trim() && !image}
            style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: (input.trim() || image) ? '#5a9e72' : 'var(--sage-light)',
              color: (input.trim() || image) ? 'white' : 'var(--muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? (
              <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentChatPage;
