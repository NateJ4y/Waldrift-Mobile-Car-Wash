import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MessageSquare, Send, Car, CheckCheck, Clock, ShieldCheck } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { currentUser, messages, sendMessage, markMessagesAsRead, vehicles } = useApp();
  const [inputText, setInputText] = useState('');
  const [selectedPlate, setSelectedPlate] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markMessagesAsRead();
  }, [messages]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText, selectedPlate || undefined);
    setInputText('');
  };

  const handleQuickPreset = (text: string) => {
    sendMessage(text, selectedPlate || undefined);
  };

  const userVehicles = currentUser ? vehicles.filter((v) => v.user_id === currentUser.id) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-700 uppercase tracking-widest text-red-500">
              Live Service Bay Comms
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="font-oswald font-700 text-3xl sm:text-4xl uppercase text-white mt-0.5">
            STAFF &amp; CUSTOMER CHAT
          </h1>
          <p className="text-xs text-neutral-400">
            {currentUser?.role === 'customer'
              ? 'Direct channel with Waldrift Car Wash operators at 19 Andesite Ave'
              : 'Operational customer dispatch and bay readiness updates'}
          </p>
        </div>

        {/* Plate tag if customer has cars */}
        {userVehicles.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-mono">Vehicle:</span>
            <select
              value={selectedPlate}
              onChange={(e) => setSelectedPlate(e.target.value)}
              className="bg-neutral-900 border border-neutral-700 text-amber-400 font-mono text-xs px-2.5 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="">General Bay Inquiry</option>
              {userVehicles.map((v) => (
                <option key={v.id} value={v.plate_number}>
                  {v.plate_number} ({v.make})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Staff Quick Status Snippets */}
      {(currentUser?.role === 'staff' || currentUser?.role === 'admin') && (
        <div className="bg-neutral-900/80 border border-neutral-800 p-3 rounded-xl space-y-2">
          <span className="text-[11px] font-700 uppercase tracking-wider text-red-400 block">
            Staff Quick Dispatch Snippets:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() =>
                handleQuickPreset(
                  'Your vehicle has entered the wash bay! Hand wash & foam soak underway.'
                )
              }
              className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-700 text-neutral-300 hover:text-white hover:border-red-500 transition-colors"
            >
              + Wash Started
            </button>
            <button
              onClick={() =>
                handleQuickPreset(
                  'Your car is ready for collection! Sparkle clean with tyre shine.'
                )
              }
              className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-700 text-neutral-300 hover:text-white hover:border-red-500 transition-colors"
            >
              + Car Ready
            </button>
            <button
              onClick={() =>
                handleQuickPreset(
                  'Mobile wash van is dispatched and en route to your address within 15 minutes.'
                )
              }
              className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-700 text-neutral-300 hover:text-white hover:border-red-500 transition-colors"
            >
              + Mobile En Route
            </button>
          </div>
        </div>
      )}

      {/* Chat Window */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="text-center py-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 bg-neutral-950/80 px-3 py-1 rounded-full border border-neutral-800">
              Encrypted Operational Channel &bull; Waldrift Vereeniging
            </span>
          </div>

          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUser?.id;
            const isStaff = msg.sender_role === 'staff' || msg.sender_role === 'admin';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[11px] font-700 text-neutral-300">
                    {msg.sender_name}
                  </span>
                  {isStaff && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.2 rounded">
                      Staff
                    </span>
                  )}
                  {msg.plate_number && (
                    <span className="text-[10px] font-mono text-amber-400 bg-black/60 px-1.5 py-0.2 rounded border border-neutral-800">
                      {msg.plate_number}
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-md leading-relaxed ${
                    isMe
                      ? 'bg-red-600 text-white rounded-tr-none'
                      : 'bg-neutral-950 text-neutral-100 border border-neutral-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-500 px-1 font-mono">
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-red-400" />}
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-neutral-950 border-t border-neutral-800 flex gap-2">
          <input
            type="text"
            placeholder={
              currentUser?.role === 'customer'
                ? 'Type message to Waldrift bay staff...'
                : 'Type customer response or update...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-xl bg-neutral-900 border border-neutral-700 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
          />
          <Button type="submit" variant="primary" size="md" className="px-5">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
