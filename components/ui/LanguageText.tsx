
"use client";

import React, { useEffect, useState } from 'react';

interface LanguageTextProps {
  en: string;
  bn: string;
}

export default function LanguageText({ en, bn }: LanguageTextProps) {
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app-lang') as 'en' | 'bn';
    if (saved) setLang(saved);
    
    const handleLangChange = () => {
      const current = localStorage.getItem('app-lang') as 'en' | 'bn';
      setLang(current || 'en');
    };

    window.addEventListener('storage', handleLangChange);
    return () => window.removeEventListener('storage', handleLangChange);
  }, []);

  return (
    <span className={lang === 'bn' ? 'font-bengali' : ''}>
      {lang === 'bn' ? bn : en}
    </span>
  );
}
