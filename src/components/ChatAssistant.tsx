import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, MessageSquare, Pin, Trash2, Edit3, Check, 
  Copy, RefreshCw, Square, Plus, Search, FolderOpen, AlertCircle,
  Clock, Brain, HelpCircle, ChevronRight, ChevronLeft
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatSession, BrandVoice } from '../types';

interface ChatAssistantProps {
  chats: ChatSession[];
  brandVoices: BrandVoice[];
  activeBrandVoiceId: string;
  onSetActiveBrandVoiceId: (id: string) => void;
  onCreateChat: (title: string) => Promise<ChatSession>;
  onDeleteChat: (id: string) => Promise<void>;
  onPinChat: (id: string, pin: boolean) => Promise<void>;
  onRenameChat: (id: string, title: string) => Promise<void>;
  onSendMessage: (chatId: string, text: string) => Promise<any>;
}

export default function ChatAssistant({
  chats,
  brandVoices,
  activeBrandVoiceId,
  onSetActiveBrandVoiceId,
  onCreateChat,
  onDeleteChat,
  onPinChat,
  onRenameChat,
  onSendMessage
}: ChatAssistantProps) {
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  
  // Renaming state
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-select first chat or create one
  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  // Scroll to bottom when message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId, isGenerating]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleCreateNewChat = async () => {
    const newChat = await onCreateChat('New Conversation');
    setActiveChatId(newChat.id);
    setShowMobileSidebar(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChatId || isGenerating) return;

    const textToSend = inputText;
    setInputText('');
    setIsGenerating(true);

    try {
      await onSendMessage(activeChatId, textToSend);
    } catch (e) {
      console.error('Error sending message:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRenameSubmit = async (chatId: string) => {
    if (renameValue.trim()) {
      await onRenameChat(chatId, renameValue.trim());
    }
    setEditingChatId(null);
  };

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const filteredChats = chats.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div id="chat-assistant-panel" className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-140px)] max-w-7xl mx-auto">
      
      {/* Sidebar - Conversations list */}
      <div className={`md:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-full ${showMobileSidebar ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Create Chat action button */}
        <button 
          onClick={handleCreateNewChat}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-md shadow-violet-100 transition-all flex items-center justify-center space-x-2 mb-4 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        {/* Search Conversation */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder-slate-400"
          />
        </div>

        {/* Chats list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {sortedChats.length > 0 ? (
            sortedChats.map((c) => {
              const isActive = c.id === activeChatId;
              const isEditing = c.id === editingChatId;

              return (
                <div 
                  key={c.id}
                  onClick={() => {
                    if (!isEditing) {
                      setActiveChatId(c.id);
                      setShowMobileSidebar(false);
                    }
                  }}
                  className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive 
                      ? 'bg-violet-50/50 border-violet-100 text-violet-700' 
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                    
                    {isEditing ? (
                      <input 
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => handleRenameSubmit(c.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(c.id)}
                        autoFocus
                        className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                    ) : (
                      <span className="text-xs font-bold truncate block">{c.title}</span>
                    )}
                  </div>

                  {/* Actions for each chat item */}
                  {!isEditing && (
                    <div className="hidden group-hover:flex items-center space-x-1.5 ml-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onPinChat(c.id, !c.isPinned);
                        }}
                        className="text-slate-400 hover:text-slate-600"
                        title={c.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className={`w-3 h-3 ${c.isPinned ? 'fill-violet-500 text-violet-500' : ''}`} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingChatId(c.id);
                          setRenameValue(c.title);
                        }}
                        className="text-slate-400 hover:text-slate-600"
                        title="Rename"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(c.id);
                        }}
                        className="text-slate-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Pin indicator when not hovered */}
                  {!isEditing && c.isPinned && !isActive && (
                    <Pin className="w-3 h-3 text-violet-500 fill-violet-400 group-hover:hidden" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400">
              <FolderOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-[11px] font-medium">No conversations found</p>
            </div>
          )}
        </div>

      </div>

      {/* Primary Chat Window Area */}
      <div className={`md:col-span-3 bg-white border border-slate-200 rounded-2xl flex flex-col h-full overflow-hidden ${!showMobileSidebar ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Top bar - active chat settings */}
        <div className="border-b border-slate-100 p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2 text-left">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="md:hidden p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-500 mr-1 flex-shrink-0"
              title="Back to Chats"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-left">
              <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>{activeChat ? activeChat.title : 'AI Content Assistant'}</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">Multi-Provider Router Activated</p>
            </div>
          </div>

          {/* Brand Voice integration */}
          <div className="flex items-center space-x-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Apply Brand Voice:</label>
            <select 
              value={activeBrandVoiceId}
              onChange={(e) => onSetActiveBrandVoiceId(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="">None (Standard AI Tone)</option>
              {brandVoices.map(bv => (
                <option key={bv.id} value={bv.id}>{bv.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Message logs list container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeChat && activeChat.messages.length > 0 ? (
            activeChat.messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser 
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-100 rounded-tr-none text-left' 
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none text-left'
                  }`}>
                    
                    {/* Role header */}
                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200/20 text-[10px] font-bold uppercase tracking-wider opacity-80">
                      <span>{isUser ? 'You' : 'ContentForge Assistant'}</span>
                      <div className="flex items-center space-x-2">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {!isUser && (
                          <button 
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="hover:text-violet-600 transition-colors cursor-pointer"
                            title="Copy response"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-green-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Rendering Markdown correctly */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div className="markdown-body prose max-w-none prose-slate prose-sm text-slate-800">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 max-w-md mx-auto text-slate-400 space-y-4">
              <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm">Interactive Content Assistant</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Brainstorm copy angles, ask to rewrite paragraphs, or brainstorm outlines. Enforce your active brand blueprint for tailored tone matching.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left pt-4">
                <button 
                  onClick={() => setInputText('Give me 5 viral hooks for SaaS launching campaigns.')}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-violet-100 hover:bg-violet-50/20 text-[11px] font-bold text-slate-600 text-left transition-all"
                >
                  "SaaS Hooks" →
                </button>
                <button 
                  onClick={() => setInputText('Suggest an optimized blog outline about remote work trends.')}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-violet-100 hover:bg-violet-50/20 text-[11px] font-bold text-slate-600 text-left transition-all"
                >
                  "Blog outline" →
                </button>
              </div>
            </div>
          )}

          {/* Loading status for generation */}
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-slate-50 text-slate-700 rounded-2xl rounded-tl-none p-4 max-w-[85%] border border-slate-100">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500 animate-spin" />
                  <span>ContentForge AI is crafting response...</span>
                </div>
                <div className="flex space-x-1 items-center py-2 px-1">
                  <div className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Text Input area form */}
        <div className="border-t border-slate-100 p-4 bg-slate-50/50">
          <form onSubmit={handleSend} className="relative flex items-center">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type your copywriting instruction here... (Shift+Enter for newline, Enter to send)"
              className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 placeholder-slate-400 resize-none font-medium shadow-sm"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all ${
                inputText.trim() && !isGenerating
                  ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-100 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <p className="text-[10px] text-slate-400 mt-2 text-center font-medium">
            AI content is dynamic. Check and edit all outputs for safety and brand compliance.
          </p>
        </div>

      </div>

    </div>
  );
}
