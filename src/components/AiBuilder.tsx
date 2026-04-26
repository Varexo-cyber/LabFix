'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Eye, Loader2 } from 'lucide-react';

interface Message {
  type: 'user' | 'ai' | 'error';
  text: string;
  timestamp: Date;
}

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  type: string;
}

export default function AiBuilder() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<ConfigItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch('/api/ai-builder');
      const data = await res.json();
      if (data.success) {
        setConfig(data.config || []);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { type: 'user', text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.text })
      });

      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, { type: 'ai', text: data.message, timestamp: new Date() }]);
        // Reload config to show updates
        await loadConfig();
      } else {
        setMessages(prev => [...prev, { type: 'error', text: data.message || 'Commando niet herkend', timestamp: new Date() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', text: 'Verbindingsfout. Probeer opnieuw.', timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: '➕', label: 'Navigatie', example: 'Voeg "Aanbiedingen" toe aan navigatie' },
    { icon: '📝', label: 'Footer', example: 'Verander footer tekst naar "© 2024 LabFix"' },
    { icon: '📁', label: 'Categorie', example: 'Voeg categorie "Smartwatch" toe' },
    { icon: '🎨', label: 'Kleur', example: 'Verander primaire kleur naar #ff0000' },
    { icon: '📱', label: 'Social', example: 'Update Facebook link naar facebook.com/labfix' },
    { icon: '📢', label: 'Banner', example: 'Toon banner met "Gratis verzending vanaf €50"' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header - Clean, neutral design */}
      <div className="bg-gray-800 rounded-t-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center border border-gray-600">
            <Sparkles size={24} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Assistant</h2>
            <p className="text-gray-400 text-sm">Pas je website aan met natuurlijke taal</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-gray-50 border-x border-b border-gray-200 rounded-b-2xl p-4">
        {/* Messages */}
        <div className="bg-white rounded-xl border border-gray-200 h-80 overflow-y-auto p-4 mb-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} className="text-gray-600" />
              </div>
              <p className="font-medium text-gray-700 mb-2">👋 Hallo! Ik ben je AI assistant</p>
              <p className="text-sm mb-4">Je kunt me vragen om je website aan te passen:</p>
              <div className="text-left max-w-md mx-auto space-y-1 text-sm">
                <p className="text-gray-600">• "Maak een nieuw merk HP"</p>
                <p className="text-gray-600">• "Verwijder categorie Apple"</p>
                <p className="text-gray-600">• "Verander kleur naar blauw"</p>
                <p className="text-gray-600">• "Laat alleen Samsung zien"</p>
                <p className="text-gray-600">• "Zet Google in meer"</p>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.type === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : msg.type === 'error'
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {msg.timestamp.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">AI denkt na...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Typ je commando... (bijv: Voeg aanbiedingen toe aan navigatie)"
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>

        {/* Quick Actions */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">Snelle acties</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => setInput(action.example)}
                className="bg-white border border-gray-200 hover:border-primary-500 hover:bg-primary-50 rounded-lg px-3 py-2 text-sm transition-all"
              >
                <span className="mr-1">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Capabilities Reference - Clean design */}
        <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-green-600" /> Wat kan de AI allemaal doen?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {/* Navigation */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">🧭 Navigatie</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Voeg Aanbiedingen toe"</li>
                <li>• "Verwijder Contact uit menu"</li>
                <li>• "Zet alleen Apple, Samsung, Xiaomi in menu"</li>
                <li>• "Verplaats Google naar meer"</li>
              </ul>
            </div>

            {/* Footer */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">📝 Footer</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Verander footer tekst naar..."</li>
                <li>• "Update email naar info@labfix.nl"</li>
                <li>• "Update telefoonnummer"</li>
              </ul>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">📁 Merken & Categorieën</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Maak een nieuw merk HP"</li>
                <li>• "Voeg categorie Smartwatches toe"</li>
                <li>• "Verwijder merk Huawei"</li>
                <li>• "HP staat er al, zet in meer"</li>
              </ul>
            </div>

            {/* Theme */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">🎨 Thema & Kleuren</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Verander kleur naar blauw"</li>
                <li>• "Maak de header rood"</li>
                <li>• "Update accent kleur naar #2563eb"</li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">📱 Social Media</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Update Facebook link"</li>
                <li>• "Nieuw Instagram account"</li>
                <li>• "Verander Twitter URL"</li>
              </ul>
            </div>

            {/* Banner */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">📢 Banner & Meldingen</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• "Toon banner: Gratis verzending!"</li>
                <li>• "Verwijder de banner"</li>
                <li>• "Nieuwe melding: Kerst aanbieding"</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>💡 Tip:</strong> Praat gewoon normaal! De AI begrijpt wat je bedoelt. Je hoeft geen exacte commando's te gebruiken.
            </p>
          </div>
        </div>

        {/* Current Config */}
        {config.length > 0 && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
              <Eye size={16} /> Huidige aanpassingen ({config.length})
            </h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {config.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-700">{item.key}</span>
                    <span className="text-xs text-gray-400 ml-2">({item.type})</span>
                  </div>
                  <span className="text-gray-500 truncate max-w-[200px] text-xs">
                    {typeof item.value === 'string' ? item.value : JSON.stringify(item.value).slice(0, 50)}...
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
