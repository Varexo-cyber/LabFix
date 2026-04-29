'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { createContactMessage } from '@/lib/store';

export default function ContactPage() {
  const { t, locale } = useApp();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await createContactMessage(formData);
    
    setLoading(false);
    
    if (result.success) {
      setSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } else {
      setError(result.error || 'Er is iets misgegaan');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 animate-fade-in-up">{t('contact.title')}</h1>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6 animate-fade-in-left delay-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact.name')} *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required 
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact.email')} *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {locale === 'nl' ? 'Onderwerp' : 'Subject'}
              </label>
              <input 
                type="text" 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('contact.message')} *</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5} 
                required 
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-primary-500 resize-none"
              ></textarea>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> {locale === 'nl' ? 'Versturen...' : 'Sending...'}</>
              ) : sent ? (
                <><CheckCircle size={18} /> {t('contact.success')}</>
              ) : (
                <><Send size={18} /> {t('contact.send')}</>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-8 animate-fade-in-right delay-200">
            <h2 className="text-xl font-bold mb-6">{t('footer.contact')}</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-accent-500 flex-shrink-0" size={20} />
                <a href="mailto:info@labfix.nl" className="text-primary-500 hover:underline">info@labfix.nl</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-accent-500 flex-shrink-0" size={20} />
                <a href="tel:+31651131133" className="text-primary-500 hover:underline">+31 6 5113 1133</a>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-8 text-white animate-fade-in-right delay-400">
            <h3 className="text-xl font-bold mb-2">
              {locale === 'nl' ? 'Openingstijden' : 'Business Hours'}
            </h3>
            <div className="space-y-2 text-blue-100">
              <p>{locale === 'nl' ? 'Maandag - Vrijdag: 09:00 - 17:00' : 'Monday - Friday: 09:00 - 17:00'}</p>
              <p>{locale === 'nl' ? 'Zaterdag - Zondag: Gesloten' : 'Saturday - Sunday: Closed'}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 animate-fade-in-right delay-600">
            <h3 className="text-xl font-bold mb-4">
              {locale === 'nl' ? 'Bedrijfsgegevens' : 'Company Details'}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold">KvK:</span> 42035906</p>
              <p><span className="font-semibold">BTW:</span> NL005445900B06</p>
              <p><span className="font-semibold">Bank:</span> NL36INGB0115171061</p>
              <p><span className="font-semibold">{locale === 'nl' ? 'T.n.v.' : 'Attn:'}</span> LabFix</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
