'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { fetchNews, NewsArticle } from '@/lib/store';
import {
  MessageCircle,
  X,
  Phone,
  Mail,
  HelpCircle,
  ExternalLink,
  Send,
  Home,
  Newspaper,
  ChevronRight,
  Bot,
} from 'lucide-react';

// WhatsApp icon component
const WhatsAppIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

type WidgetTab = 'home' | 'bot' | 'help' | 'news';

interface BotMessage {
  role: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
}

function getLabFixAnswer(question: string, nl: boolean): string {
  const q = question.toLowerCase();

  const outOfScope = /weer|voetbal|sport|politiek|recept|koken|film|muziek|game|crypto|bitcoin|aandelen|beleggen|dating|grap|mop|gedicht|verhaal/;
  if (outOfScope.test(q)) {
    return nl
      ? 'Sorry, ik kan alleen helpen met LabFix-gerelateerde vragen over onze producten, verzending, betalingen en services.'
      : 'Sorry, I can only help with LabFix-related questions about our products, shipping, payments and services.';
  }

  if (/verzend|shipping|lever|deliver|bezorg/.test(q)) {
    return nl
      ? 'We verzenden via DHL, FedEx, UPS, PostNL en DPD. Gratis verzending bij bestellingen boven €150. Levertijd is 1-3 werkdagen binnen de EU.'
      : 'We ship via DHL, FedEx, UPS, PostNL and DPD. Free shipping on orders above €150. Delivery time is 1-3 business days within the EU.';
  }
  if (/betal|payment|pay|ideal|visa|mastercard|paypal/.test(q)) {
    return nl
      ? 'We accepteren Visa, Mastercard, PayPal, iDEAL, Bancontact, SEPA, Apple Pay, Google Pay, Klarna en bankoverschrijving.'
      : 'We accept Visa, Mastercard, PayPal, iDEAL, Bancontact, SEPA, Apple Pay, Google Pay, Klarna and bank transfer.';
  }
  if (/retour|return|terugstuur|refund/.test(q)) {
    return nl
      ? '30 dagen retourbeleid op ongebruikte producten in originele verpakking. Neem contact op via info@labfix.nl om een retour aan te vragen.'
      : '30-day return policy on unused products in original packaging. Contact info@labfix.nl to request a return.';
  }
  if (/garantie|warranty/.test(q)) {
    return nl
      ? 'Al onze onderdelen hebben garantie. Als een product defect is, neem contact op met ons supportteam voor een vervanging.'
      : 'All our parts come with warranty. If a product is defective, contact our support team for a replacement.';
  }
  if (/registr|account|aanmeld|sign.?up|kvk/.test(q)) {
    return nl
      ? 'LabFix is alleen voor zakelijke klanten. Om je te registreren heb je een geldig KVK-nummer nodig. Ga naar de registratiepagina op onze website.'
      : 'LabFix is for business customers only. You need a valid Chamber of Commerce number to register. Go to the registration page on our website.';
  }
  if (/prijs|price|korting|discount/.test(q)) {
    return nl
      ? 'Onze prijzen zijn zichtbaar na registratie en inloggen. We bieden staffelkortingen bij grotere bestellingen. Neem contact op voor een offerte.'
      : 'Our prices are visible after registration and login. We offer volume discounts on larger orders. Contact us for a quote.';
  }
  if (/bestell|order|track/.test(q)) {
    return nl
      ? 'Je kunt je bestellingen volgen via je account op onze website. Ga naar "Mijn Account" > "Bestellingen" om de status te zien.'
      : 'You can track your orders through your account on our website. Go to "My Account" > "Orders" to see the status.';
  }
  if (/iphone|apple|ipad|macbook|airpod|watch/.test(q)) {
    return nl
      ? 'We hebben onderdelen voor alle Apple producten: iPhone (5 t/m 16 Pro Max), iPad (alle generaties), MacBook Pro/Air, Apple Watch en AirPods. Bekijk ons assortiment onder het merk Apple.'
      : 'We carry parts for all Apple products: iPhone (5 through 16 Pro Max), iPad (all generations), MacBook Pro/Air, Apple Watch and AirPods. Browse our Apple brand section.';
  }
  if (/samsung|galaxy/.test(q)) {
    return nl
      ? 'We hebben onderdelen voor Samsung Galaxy S-serie (S5 t/m S26), A-serie, Z Fold/Flip, Note-serie, Tab-serie en meer. Bekijk ons Samsung assortiment.'
      : 'We carry parts for Samsung Galaxy S-series (S5 through S26), A-series, Z Fold/Flip, Note series, Tab series and more. Browse our Samsung section.';
  }
  if (/contact|email|telefoon|phone|bel/.test(q)) {
    return nl
      ? 'Je kunt ons bereiken via: E-mail: info@labfix.nl | Telefoon/WhatsApp: +31 6 5113 1133 | Ma-Vr 09:00-17:00.'
      : 'You can reach us via: Email: info@labfix.nl | Phone/WhatsApp: +31 6 5113 1133 | Mon-Fri 09:00-17:00.';
  }
  if (/wie|what|wat is labfix|about/.test(q)) {
    return nl
      ? 'LabFix is een Nederlandse B2B groothandel in reparatieonderdelen voor smartphones, tablets en laptops. We leveren door heel Europa aan professionele reparateurs.'
      : 'LabFix is a Dutch B2B wholesale supplier of repair parts for smartphones, tablets and laptops. We deliver throughout Europe to professional repair shops.';
  }
  if (/scherm|screen|display|lcd|oled/.test(q)) {
    return nl
      ? 'We hebben schermen (LCD/OLED) voor alle populaire merken: Apple, Samsung, Huawei, Google, Xiaomi, Motorola en meer. Zowel origineel als compatibel. Bekijk ons productassortiment.'
      : 'We carry screens (LCD/OLED) for all popular brands: Apple, Samsung, Huawei, Google, Xiaomi, Motorola and more. Both original and compatible. Browse our product range.';
  }
  if (/batterij|battery|accu/.test(q)) {
    return nl
      ? 'We leveren batterijen voor alle populaire smartphone en tablet modellen. Hoge kwaliteit met garantie. Bekijk ons assortiment in de productcatalogus.'
      : 'We supply batteries for all popular smartphone and tablet models. High quality with warranty. Check our product catalog.';
  }
  if (/hallo|hello|hi|hey|hoi/.test(q)) {
    return nl
      ? 'Hallo! Ik ben de LabFix assistent. Ik kan je helpen met vragen over onze producten, verzending, betalingen, retourzendingen en meer. Wat wil je weten?'
      : 'Hello! I\'m the LabFix assistant. I can help you with questions about our products, shipping, payments, returns and more. What would you like to know?';
  }

  return nl
    ? 'Ik kan je helpen met vragen over LabFix producten, verzending, betalingen, retouren, garantie en registratie. Stel gerust een specifiekere vraag! Voor complexere vragen, neem contact op via info@labfix.nl.'
    : 'I can help you with questions about LabFix products, shipping, payments, returns, warranty and registration. Feel free to ask a more specific question! For complex inquiries, contact info@labfix.nl.';
}

export default function HelpWidget() {
  const { locale } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>('home');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
  const [botInput, setBotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const nl = locale === 'nl';

  useEffect(() => {
    fetchNews().then(articles => setNewsArticles(articles.filter(a => a.published)));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [botMessages, typedText, isTyping]);

  // Clear typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBotSend = () => {
    if (!botInput.trim() || isTyping) return;
    const userMsg = botInput.trim();
    setBotInput('');
    setBotMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    // Show typing indicator after 400ms delay (natural feel)
    setTimeout(() => {
      setIsTyping(true);
      
      // Get the answer
      const answer = getLabFixAnswer(userMsg, nl);
      
      // Simulate "thinking" time with loading dots (1-2 seconds)
      const thinkingTime = 1000 + Math.random() * 1000; // 1-2 seconds
      
      setTimeout(() => {
        setIsTyping(false);
        
        // Start typing effect - character by character
        let charIndex = 0;
        setTypedText('');
        
        // Add empty bot message first
        setBotMessages(prev => [...prev, { role: 'bot', text: '', isTyping: true }]);
        
        // Type out characters smoothly
        typingIntervalRef.current = setInterval(() => {
          if (charIndex <= answer.length) {
            const currentText = answer.slice(0, charIndex);
            setTypedText(currentText);
            setBotMessages(prev => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg && lastMsg.role === 'bot') {
                lastMsg.text = currentText;
              }
              return newMessages;
            });
            charIndex++;
          } else {
            // Done typing
            if (typingIntervalRef.current) {
              clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
            }
            setBotMessages(prev => {
              const newMessages = [...prev];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg && lastMsg.role === 'bot') {
                lastMsg.text = answer;
                lastMsg.isTyping = false;
              }
              return newMessages;
            });
            setTypedText('');
          }
        }, 25); // 25ms per character for smooth typing effect
        
      }, thinkingTime);
      
    }, 400);
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50">
      {/* Popup */}
      <div
        className={`absolute bottom-16 right-0 w-[370px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gray-900 text-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-0.5 inline-block">
                <img src="/logo.png" alt="LabFix" className="h-7 w-auto object-contain" />
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="h-[380px] overflow-y-auto">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div>
              <div className="px-5 pt-5 pb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {nl ? 'Hoe kunnen we helpen?' : 'How can we help?'}
                </h2>
              </div>

              {/* Ask AI */}
              <div className="mx-4 mb-3">
                <button
                  onClick={() => setActiveTab('bot')}
                  className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Bot size={20} className="text-primary-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 text-sm">{nl ? 'Stel een vraag' : 'Ask a question'}</p>
                      <p className="text-xs text-gray-500">{nl ? 'AI Assistent kan helpen' : 'AI Assistant can help'}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              </div>

              {/* WhatsApp Direct */}
              <div className="mx-4 mb-3">
                <a
                  href="https://wa.me/31651131133"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl p-4 hover:bg-[#25D366]/20 hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                      <WhatsAppIcon size={22} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 text-sm">WhatsApp</p>
                      <p className="text-xs text-gray-500">{nl ? 'Direct chatten via WhatsApp' : 'Chat directly on WhatsApp'}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-[#25D366]" />
                </a>
              </div>

              {/* News articles */}
              {newsArticles.length > 0 && (
                <div className="px-4 pb-4">
                  {newsArticles.slice(0, 3).map((article) => (
                    <div key={article.id} className="mb-3 border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {article.image && (
                        <img src={article.image} alt="" className="w-full h-32 object-cover" />
                      )}
                      <div className="p-3">
                        <h3 className="font-bold text-sm text-gray-800">
                          {nl ? article.title : (article.titleEn || article.title)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {nl ? article.summary : (article.summaryEn || article.summary)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          {new Date(article.createdAt).toLocaleDateString(nl ? 'nl-NL' : 'en-GB')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOT TAB */}
          {activeTab === 'bot' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 space-y-3 overflow-y-auto min-h-[280px]">
                {botMessages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                      <Bot size={28} className="text-primary-600" />
                    </div>
                    <h3 className="font-bold text-gray-800">LabFix AI</h3>
                    <p className="text-xs text-gray-500 mt-1 px-4">
                      {nl
                        ? 'Stel me een vraag over LabFix producten, verzending, betalingen of services.'
                        : 'Ask me about LabFix products, shipping, payments or services.'}
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-3 px-2">
                      {(nl
                        ? ['Wat is LabFix?', 'Hoe verzenden jullie?', 'Welke betaalmethoden?', 'iPhone onderdelen']
                        : ['What is LabFix?', 'Shipping options?', 'Payment methods?', 'iPhone parts']
                      ).map((q) => (
                        <button
                          key={q}
                          onClick={() => { setBotInput(q); }}
                          className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {botMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}>
                      {msg.text}
                      {msg.isTyping && (
                        <span className="inline-block w-2 h-4 ml-0.5 bg-gray-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
                {/* Typing indicator with animated dots */}
                {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t p-3 flex gap-2">
                <input
                  type="text"
                  value={botInput}
                  onChange={(e) => setBotInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleBotSend()}
                  placeholder={isTyping ? (nl ? 'AI typt...' : 'AI is typing...') : (nl ? 'Typ je vraag...' : 'Type your question...')}
                  disabled={isTyping}
                  className={`flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500 transition-all duration-300 ${
                    isTyping ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
                  }`}
                />
                <button
                  onClick={handleBotSend}
                  disabled={isTyping || !botInput.trim()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                    isTyping || !botInput.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-110 active:scale-95'
                  }`}
                >
                  <Send size={16} className={`transition-transform duration-300 ${isTyping ? '' : 'hover:translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          )}

          {/* HELP TAB */}
          {activeTab === 'help' && (
            <div className="py-2">
              <div className="px-5 pt-3 pb-2">
                <h3 className="font-bold text-gray-900">{nl ? 'Neem contact op' : 'Get in touch'}</h3>
              </div>

              {/* Phone */}
              <a href="tel:+31651131133" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800 text-sm">{nl ? 'Telefoon' : 'Phone'}</span>
                  <p className="text-xs text-gray-500">+31 6 5113 1133</p>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/31651131133" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800 text-sm">WhatsApp</span>
                  <p className="text-xs text-gray-500">{nl ? 'Stuur een bericht' : 'Send a message'}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </a>

              {/* Email */}
              <a href="mailto:info@labfix.nl" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800 text-sm">E-mail</span>
                  <p className="text-xs text-gray-500">info@labfix.nl</p>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </a>

              {/* FAQs */}
              <Link href="/faq" onClick={handleClose}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <HelpCircle size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-800 text-sm">FAQ&apos;s</span>
                  <p className="text-xs text-gray-500">{nl ? 'Veelgestelde vragen' : 'Frequently asked questions'}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400" />
              </Link>

              <div className="mx-5 mt-3 p-3 bg-gray-50 rounded-xl text-xs text-gray-500 text-center">
                {nl ? 'Ma - Vr: 09:00 - 17:00 | Za - Zo: Gesloten' : 'Mon - Fri: 09:00 - 17:00 | Sat - Sun: Closed'}
              </div>
            </div>
          )}

          {/* NEWS TAB */}
          {activeTab === 'news' && (
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-3">{nl ? 'Laatste Nieuws' : 'Latest News'}</h3>
              {newsArticles.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  {nl ? 'Nog geen nieuwsartikelen.' : 'No news articles yet.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {newsArticles.map((article) => (
                    <div key={article.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {article.image && (
                        <img src={article.image} alt="" className="w-full h-28 object-cover" />
                      )}
                      <div className="p-3">
                        <h4 className="font-bold text-sm text-gray-800">
                          {nl ? article.title : (article.titleEn || article.title)}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                          {nl ? (article.content || article.summary) : (article.contentEn || article.content || article.summaryEn || article.summary)}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          {new Date(article.createdAt).toLocaleDateString(nl ? 'nl-NL' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <div className="border-t border-gray-200 flex bg-white">
          {([
            { key: 'home' as WidgetTab, icon: Home, label: 'Home' },
            { key: 'bot' as WidgetTab, icon: MessageCircle, label: nl ? 'Berichten' : 'Messages' },
            { key: 'help' as WidgetTab, icon: HelpCircle, label: nl ? 'Hulp' : 'Help' },
            { key: 'news' as WidgetTab, icon: Newspaper, label: nl ? 'Nieuws' : 'News' },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center py-2.5 text-[10px] font-medium transition-colors ${
                activeTab === key ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={18} />
              <span className="mt-0.5">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => {
          if (isOpen) handleClose();
          else { setIsOpen(true); setActiveTab('home'); }
        }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-gray-700 hover:bg-gray-800' : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Notification badge */}
      {!isOpen && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </div>
  );
}
