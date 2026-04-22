'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { fetchNews, NewsArticle } from '@/lib/store';
import { Newspaper, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
  const { locale, t } = useApp();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const nl = locale === 'nl';

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    const data = await fetchNews();
    setArticles(data.filter(a => a.published).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Newspaper size={48} className="text-primary-300" />
            <div className="absolute -inset-2 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500">{nl ? 'Nieuws laden...' : 'Loading news...'}</p>
        </div>
      </div>
    );
  }

  // Article detail view
  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 animate-fade-in">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            {nl ? 'Terug naar overzicht' : 'Back to overview'}
          </button>

          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {selectedArticle.image && (
              <div className="w-full h-64 md:h-96">
                <img
                  src={selectedArticle.image}
                  alt={nl ? selectedArticle.title : (selectedArticle.titleEn || selectedArticle.title)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6 md:p-10">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <Calendar size={16} />
                {new Date(selectedArticle.createdAt).toLocaleDateString(nl ? 'nl-NL' : 'en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                {nl ? selectedArticle.title : (selectedArticle.titleEn || selectedArticle.title)}
              </h1>
              {(nl ? selectedArticle.summary : (selectedArticle.summaryEn || selectedArticle.summary)) && (
                <p className="text-lg text-gray-600 mb-6 italic">
                  {nl ? selectedArticle.summary : (selectedArticle.summaryEn || selectedArticle.summary)}
                </p>
              )}
              <div className="prose prose-blue max-w-none">
                {(nl ? selectedArticle.content : (selectedArticle.contentEn || selectedArticle.content))?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper className="text-primary-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">
              {nl ? 'Nieuws' : 'News'}
            </h1>
          </div>
          <p className="text-gray-600">
            {nl 
              ? 'Blijf op de hoogte van het laatste nieuws van LabFix' 
              : 'Stay up to date with the latest news from LabFix'}
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              {nl ? 'Geen nieuwsartikelen' : 'No news articles'}
            </h2>
            <p className="text-gray-500">
              {nl ? 'Er zijn momenteel geen nieuwsartikelen beschikbaar.' : 'There are currently no news articles available.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {article.image ? (
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={nl ? article.title : (article.titleEn || article.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <Newspaper size={48} className="text-primary-400" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                    <Calendar size={14} />
                    {new Date(article.createdAt).toLocaleDateString(nl ? 'nl-NL' : 'en-GB')}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {nl ? article.title : (article.titleEn || article.title)}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {nl ? (article.summary || article.content?.substring(0, 150) + '...') : 
                          (article.summaryEn || article.summary || article.contentEn?.substring(0, 150) + '...' || article.content?.substring(0, 150) + '...')}
                  </p>
                  <div className="mt-4 flex items-center text-primary-600 text-sm font-medium">
                    {nl ? 'Lees meer' : 'Read more'}
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
