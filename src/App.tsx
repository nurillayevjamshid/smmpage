import { useMemo, useState } from 'react';
import {
  Archive,
  Bell,
  CheckCheck,
  ChevronDown,
  FileText,
  Image,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  Smile,
  Star,
  UserPlus,
  Users,
  Video,
  X,
} from 'lucide-react';

type Chat = {
  id: number;
  name: string;
  handle: string;
  preview: string;
  time: string;
  avatar: string;
  color: string;
  online?: boolean;
  unread?: number;
  muted?: boolean;
};

type Message = {
  id: number;
  text: string;
  time: string;
  mine?: boolean;
  read?: boolean;
};

const chats: Chat[] = [
  { id: 1, name: 'Sofia Bennett', handle: '@sofiab', preview: 'That sounds perfect! See you soon.', time: '10:42 AM', avatar: 'SB', color: 'coral', online: true, unread: 2 },
  { id: 2, name: 'Marcus Chen', handle: '@marcus', preview: 'The product notes are ready.', time: '9:18 AM', avatar: 'MC', color: 'blue', online: true },
  { id: 3, name: 'Design Circle', handle: '8 members', preview: 'Maya: Added the latest screens', time: 'Yesterday', avatar: 'DC', color: 'purple', unread: 5 },
  { id: 4, name: 'Elena Rodriguez', handle: '@elena.r', preview: 'Thanks for sending this over!', time: 'Yesterday', avatar: 'ER', color: 'green', muted: true },
  { id: 5, name: 'James Wilson', handle: '@jamesw', preview: 'Photo', time: 'Mon', avatar: 'JW', color: 'amber', muted: true },
  { id: 6, name: 'Daily Team', handle: '12 members', preview: 'You: Let’s ship it.', time: 'Sun', avatar: 'DT', color: 'navy' },
];

const initialMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: 'Hey! Are we still on for coffee this afternoon?', time: '10:38 AM' },
    { id: 2, text: 'Absolutely. I found a new place near the park.', time: '10:40 AM', mine: true, read: true },
    { id: 3, text: 'That sounds perfect! See you soon.', time: '10:42 AM' },
  ],
  2: [
    { id: 1, text: 'Hey Marcus, how is the launch checklist looking?', time: '9:12 AM', mine: true, read: true },
    { id: 2, text: 'The product notes are ready.', time: '9:18 AM' },
  ],
  3: [{ id: 1, text: 'Maya: Added the latest screens', time: 'Yesterday' }],
  4: [{ id: 1, text: 'Thanks for sending this over!', time: 'Yesterday' }],
  5: [{ id: 1, text: 'Photo', time: 'Mon' }],
  6: [{ id: 1, text: 'You: Let’s ship it.', time: 'Sun', mine: true, read: true }],
};

function Avatar({ chat, size = 'md' }: { chat: Chat; size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`avatar avatar-${chat.color} avatar-${size}`}>{chat.avatar}</div>;
}

export default function App() {
  const [activeId, setActiveId] = useState(1);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [showProfile, setShowProfile] = useState(false);
  const activeChat = chats.find((chat) => chat.id === activeId) ?? chats[0];
  const visibleChats = useMemo(() => chats.filter((chat) => `${chat.name} ${chat.preview}`.toLowerCase().includes(query.toLowerCase())), [query]);

  function sendMessage() {
    const text = message.trim();
    if (!text) return;
    setMessages((current) => ({ ...current, [activeId]: [...(current[activeId] ?? []), { id: Date.now(), text, time: 'Now', mine: true, read: true }] }));
    setMessage('');
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">d</div>
          <span className="brand-name">daily</span>
          <button className="icon-button menu-button" aria-label="Menu"><Menu size={19} /></button>
        </div>
        <div className="profile-mini" onClick={() => setShowProfile(true)}>
          <div className="avatar avatar-lilac avatar-sm">AY</div>
          <div className="profile-copy"><strong>Azizbek Y.</strong><span>Online</span></div>
          <ChevronDown size={16} className="muted-icon" />
        </div>
        <div className="search-wrap"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" /></div>
        <div className="section-label"><span>Messages</span><button className="new-chat"><Plus size={15} /> New</button></div>
        <nav className="chat-list">
          {visibleChats.map((chat) => <button className={`chat-row ${chat.id === activeId ? 'active' : ''}`} key={chat.id} onClick={() => setActiveId(chat.id)}><Avatar chat={chat} /><span className="chat-copy"><span className="chat-top"><strong>{chat.name}</strong><time>{chat.time}</time></span><span className="chat-bottom"><span className="truncate">{chat.preview}</span>{chat.unread ? <b className="unread">{chat.unread}</b> : null}</span></span></button>)}
        </nav>
        <div className="sidebar-footer"><button><Archive size={18} /> Archived</button><button onClick={() => setShowProfile(true)}><Settings size={18} /> Settings</button></div>
      </aside>

      <section className="conversation">
        <header className="conversation-header"><div className="contact-info"><Avatar chat={activeChat} size="md" /><div><h1>{activeChat.name}</h1><p>{activeChat.online ? <><span className="online-dot" /> Active now</> : activeChat.handle}</p></div></div><div className="header-actions"><button className="icon-button"><Phone size={19} /></button><button className="icon-button"><Video size={20} /></button><button className="icon-button"><Search size={19} /></button><button className="icon-button"><MoreHorizontal size={21} /></button></div></header>
        <div className="message-area"><div className="date-divider"><span>Today</span></div>{(messages[activeId] ?? []).map((item) => <div className={`message-line ${item.mine ? 'mine' : ''}`} key={item.id}><div className={`bubble ${item.mine ? 'bubble-mine' : ''}`}><p>{item.text}</p><span>{item.time} {item.mine && <CheckCheck size={14} className={item.read ? 'read' : ''} />}</span></div></div>)}<div className="typing"><span className="typing-avatar">SB</span><span>Sofia is typing</span><i /><i /><i /></div></div>
        <div className="composer"><button className="composer-icon"><Paperclip size={20} /></button><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Write a message..." /><button className="composer-icon"><Smile size={21} /></button><button className="send-button" onClick={sendMessage} aria-label="Send"><Send size={18} /></button></div>
      </section>

      <aside className="details-panel"><div className="details-top"><span>Contact info</span><button className="icon-button"><X size={18} /></button></div><div className="details-avatar"><Avatar chat={activeChat} size="lg" /><h2>{activeChat.name}</h2><p>{activeChat.handle}</p><span className="active-label"><span className="online-dot" /> Active now</span></div><div className="quick-actions"><button><Bell size={18} /><span>Mute</span></button><button><Search size={18} /><span>Search</span></button><button><Star size={18} /><span>Starred</span></button></div><div className="detail-block"><label>About</label><p>Building something meaningful, one day at a time.</p></div><div className="detail-block"><label>Shared media</label><div className="media-grid"><div><Image size={20} /><span>Photos</span></div><div><FileText size={20} /><span>Files</span></div></div></div><button className="add-people"><UserPlus size={18} /> Add people</button></aside>

      {showProfile && <div className="modal-backdrop" onClick={() => setShowProfile(false)}><div className="profile-modal" onClick={(event) => event.stopPropagation()}><button className="close-modal" onClick={() => setShowProfile(false)}><X size={19} /></button><div className="avatar avatar-lilac avatar-xl">AY</div><h2>Azizbek Yoqubov</h2><p className="handle">@azizbeky</p><div className="profile-field"><label>Phone</label><span>+998 90 000 00 00</span></div><div className="profile-field"><label>Bio</label><span>Building something meaningful, one day at a time.</span></div><button className="edit-profile">Edit profile</button></div></div>}
    </main>
  );
}

export { MessageCircle, Users };
