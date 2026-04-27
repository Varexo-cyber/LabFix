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
  Wrench,
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

interface ConversationContext {
  lastTopic: string | null;
  lastBrand: string | null;
  askedAboutShipping: boolean;
  askedAboutPayment: boolean;
  conversationTurn: number;
  previousResponses: Set<string>;
}

function createContext(): ConversationContext {
  return {
    lastTopic: null,
    lastBrand: null,
    askedAboutShipping: false,
    askedAboutPayment: false,
    conversationTurn: 0,
    previousResponses: new Set()
  };
}

function classifyIntent(q: string): { intent: string; confidence: number; entities: string[] } {
  const entities: string[] = [];
  let intent = 'unknown';
  let confidence = 0;
  
  // Entity extraction
  const brandPatterns = [
    { pattern: /\biphone\b|\bapple\b|\bipad\b|\bmacbook\b|\bairpod\b/, brand: 'Apple' },
    { pattern: /\bsamsung\b|\bgalaxy\b/, brand: 'Samsung' },
    { pattern: /\bhuawei\b/, brand: 'Huawei' },
    { pattern: /\bxiaomi\b|\bmi\s/, brand: 'Xiaomi' },
    { pattern: /\bgoogle\b|\bpixel\b/, brand: 'Google' },
    { pattern: /\bmotorola\b|\bmoto\s/, brand: 'Motorola' },
    { pattern: /\bsony\b|\bxperia\b/, brand: 'Sony' },
    { pattern: /\blg\b/, brand: 'LG' },
    { pattern: /\boneplus\b/, brand: 'OnePlus' },
    { pattern: /\boppo\b/, brand: 'Oppo' },
    { pattern: /\bvivo\b/, brand: 'Vivo' },
    { pattern: /\bnokia\b/, brand: 'Nokia' },
  ];
  
  for (const bp of brandPatterns) {
    if (bp.pattern.test(q)) {
      entities.push(bp.brand);
    }
  }
  
  // Product type detection
  const productPatterns = [
    { pattern: /\bscherm\b|\bscreen\b|\bdisplay\b|\blcd\b|\boled\b/, product: 'screen' },
    { pattern: /\bbatterij\b|\bbattery\b|\baccu\b/, product: 'battery' },
    { pattern: /\bcamera\b|\blens\b/, product: 'camera' },
    { pattern: /\bback\s*cover\b|\bachterkant\b|\b housing\b/, product: 'back_cover' },
    { pattern: /\bcharging\s*port\b|\bcharger\b|\b laad\b|\b oplaad\b/, product: 'charging' },
    { pattern: /\bbutton\b|\bknoop\b|\bknop\b/, product: 'buttons' },
    { pattern: /\bspeaker\b|\bspeaker\b/, product: 'speaker' },
    { pattern: /\bmicrophone\b|\bmic\b/, product: 'microphone' },
  ];
  
  for (const pp of productPatterns) {
    if (pp.pattern.test(q)) {
      entities.push(pp.product);
    }
  }
  
  // Intent classification with scoring
  const intents: { [key: string]: RegExp[] } = {
    'shipping': [/\bverzend|lever|bezorg|shipping|delivery|waneer\s*(komt|is)|hoe\s*lang\s*duurt|track/i],
    'payment': [/\bbetal|payment|pay|ideal|klarna|bank|geld|kosten|prijs/i],
    'returns': [/\bretour|return|terug|ruilen|omruilen|refund|terugsturen/i],
    'warranty': [/\bgarantie|warranty|defect|stuk|kapot|werkt\s*niet/i],
    'account': [/\bregistr|account|aanmeld|inlog|login|kvk|zakelijk|business/i],
    'pricing': [/\bprijs|price|korting|discount|kosten|hoe\s*veel|wat\s*kost/i],
    'order_status': [/\bbestell|order|status|waar\s*is|tracking|volg/i],
    'product_info': [/\biphone|apple|samsung|galaxy|onderdeel|part|scherm|batterij|screen|battery|compatible|geschikt\s*voor/i],
    'contact': [/\bcontact|email|telefoon|phone|bel|bereiken|spreken/i],
    'about': [/\bwie|what\s*is|wat\s*is\s*labfix|about|bedrijf|company/i],
    'greeting': [/\bhallo|hello|hi|hey|hoi|goedemorgen|goedemiddag/i],
    'availability': [/\bop\s*voorraad|stock|available|beschikbaar|wanneer\s*weer/i],
    'bulk': [/\bgroot|bulk|wholesale|staffel|hoeveelheid|quantity|reseller/i],
    'compatibility': [/\bpass|compatible|geschikt|werkt\s*met|past\s*in|welke\s*onderdelen/i],
  };
  
  let maxScore = 0;
  for (const [int, patterns] of Object.entries(intents)) {
    let score = 0;
    for (const pattern of patterns) {
      if (pattern.test(q)) score += 1;
      // Check for multiple matches to increase confidence
      const matches = q.match(pattern);
      if (matches && matches.length > 1) score += 0.5;
    }
    if (score > maxScore) {
      maxScore = score;
      intent = int;
    }
  }
  
  confidence = Math.min(maxScore / 2, 1);
  
  return { intent, confidence, entities };
}

function generateSmartResponse(
  question: string, 
  nl: boolean, 
  context: ConversationContext
): { response: string; followUp: string | null } {
  const q = question.toLowerCase();
  const { intent, entities } = classifyIntent(q);
  
  // Prevent duplicate responses
  const responseKey = `${intent}-${entities.join('-')}`;
  const isRepeat = context.previousResponses.has(responseKey);
  context.previousResponses.add(responseKey);
  context.conversationTurn++;
  
  let response = '';
  let followUp = null;
  
  // Handle out-of-scope topics
  const outOfScope = /\b(weer|voetbal|sport|politiek|recept|koken|film|muziek|game|crypto|bitcoin|aandelen|beleggen|dating|grap|mop|gedicht|verhaal|vacature|baan|werk)\b/i;
  if (outOfScope.test(q)) {
    return {
      response: nl
        ? 'Ik ben gespecialiseerd in LabFix producten en services. Ik kan je helpen met vragen over reparatieonderdelen, verzending, betalingen, garantie en ons zakelijke aanbod. Waarmee kan ik je van dienst zijn?'
        : 'I specialize in LabFix products and services. I can help you with questions about repair parts, shipping, payments, warranty and our business offerings. How can I assist you?',
      followUp: null
    };
  }
  
  // Check for repeated questions with variation
  if (isRepeat && context.conversationTurn > 1) {
    if (intent === 'payment') {
      response = nl
        ? `Je vroeg al eerder over betalingen. Om samen te vatten: we accepteren iDEAL en Klarna voor zakelijke klanten. Prijzen zijn pas zichtbaar na registratie met een geldig KVK-nummer. Wil je meer weten over het registratieproces?`
        : `You asked about payments before. To summarize: we accept iDEAL and Klarna for business customers. Prices are only visible after registration with a valid Chamber of Commerce number. Would you like to know more about the registration process?`;
      followUp = nl ? 'Registratieproces uitleggen' : 'Explain registration process';
      return { response, followUp };
    }
    if (intent === 'shipping') {
      response = nl
        ? `Je vroeg al eerder over verzending. Ik herhaal: we verzenden met DHL, FedEx, UPS, PostNL en DPD. Levertijd 1-3 werkdagen EU, gratis verzending vanaf €150. Wil je weten hoe je je bestelling kunt volgen?`
        : `You asked about shipping before. To repeat: we ship with DHL, FedEx, UPS, PostNL and DPD. Delivery 1-3 business days EU, free shipping from €150. Want to know how to track your order?`;
      followUp = nl ? 'Bestelling volgen' : 'Track order';
      return { response, followUp };
    }
  }
  
  // Context-aware responses based on intent
  switch (intent) {
    case 'shipping':
      context.askedAboutShipping = true;
      const hasBrand = entities.some(e => ['Apple', 'Samsung', 'Huawei', 'Xiaomi'].includes(e));
      if (hasBrand) {
        const brand = entities.find(e => ['Apple', 'Samsung', 'Huawei', 'Xiaomi'].includes(e));
        response = nl
          ? `Voor ${brand}-onderdelen geldt onze standaard verzending: 1-3 werkdagen binnen de EU via DHL, FedEx, UPS, PostNL of DPD. Gratis verzending vanaf €150. Heb je haast? We kunnen ook express verzending regelen - neem hiervoor contact op.`
          : `For ${brand} parts, our standard shipping applies: 1-3 business days within the EU via DHL, FedEx, UPS, PostNL or DPD. Free shipping from €150. In a hurry? We can arrange express shipping - contact us for this.`;
      } else {
        response = nl
          ? `We verzenden dagelijks met DHL, FedEx, UPS, PostNL en DPD. Binnen Nederland meestal volgende dag, EU-wide 1-3 werkdagen. Vanaf €150 is verzending gratis. Je ontvangt automatisch een track & trace link zodra je bestelling verzonden is.`
          : `We ship daily with DHL, FedEx, UPS, PostNL and DPD. Within the Netherlands usually next day, EU-wide 1-3 business days. Free shipping from €150. You automatically receive a track & trace link once your order ships.`;
      }
      followUp = nl ? 'Wat is de levertijd naar België?' : 'What is delivery time to Germany?';
      break;
      
    case 'payment':
      context.askedAboutPayment = true;
      response = nl
        ? `Voor zakelijke klanten bieden we iDEAL en Klarna als betaalmethoden. Prijzen zijn zichtbaar na registratie met je KVK-nummer. Voor grotere bestellingen (€1000+) kunnen we betalingstermijnen bespreken. Belangrijk: je moet ingelogd zijn om prijzen te zien.`
        : `For business customers we offer iDEAL and Klarna. Prices are visible after registration with your Chamber of Commerce number. For larger orders (€1000+) we can discuss payment terms. Important: you must be logged in to see prices.`;
      followUp = nl ? 'Hoe registreer ik mij?' : 'How do I register?';
      break;
      
    case 'returns':
      response = nl
        ? `We hanteren een 30-dagen retourbeleid voor ongebruikte producten in originele verpakking. Voor defecte producten (DOA) geldt uiteraard gratis vervanging. Stuur een e-mail naar info@labfix.nl met je bestelnummer en reden van retour. Retourkosten zijn voor de klant, tenzij het onze fout is.`
        : `We have a 30-day return policy for unused products in original packaging. For defective products (DOA), free replacement of course. Email info@labfix.nl with your order number and return reason. Return shipping is at customer cost, unless it's our error.`;
      followUp = nl ? 'Product is defect bij ontvangst' : 'Product is defective on arrival';
      break;
      
    case 'warranty':
      const productType = entities.find(e => ['screen', 'battery', 'camera'].includes(e));
      if (productType) {
        response = nl
          ? `Ja, al onze ${productType === 'screen' ? 'schermen' : productType === 'battery' ? 'batterijen' : 'camera\'s'} komen met garantie. Bij fabricagefouten of DOA (Dead On Arrival) vervangen we het product gratis. Garantie geldt niet voor beschadiging door verkeerd monteren. Neem binnen 14 dagen contact op bij problemen.`
          : `Yes, all our ${productType}s come with warranty. For manufacturing defects or DOA we replace the product for free. Warranty doesn't cover damage from incorrect installation. Contact us within 14 days for issues.`;
      } else {
        response = nl
          ? `Alle producten van LabFix hebben garantie. De duur varieert per productcategorie: schermen en batterijen hebben uitgebreide garantie op fabricagefouten. Bij DOA (defect bij aankomst) vervangen we direct. Bewaar altijd je bestelbevestiging als garantiebewijs.`
          : `All LabFix products have warranty. Duration varies by category: screens and batteries have extensive warranty on manufacturing defects. For DOA we replace immediately. Always keep your order confirmation as proof of warranty.`;
      }
      followUp = nl ? 'Hoe claim ik garantie?' : 'How do I claim warranty?';
      break;
      
    case 'account':
      response = nl
        ? `LabFix is exclusief voor zakelijke klanten (B2B). Registratie vereist een geldig KVK-nummer. Na goedkeuring (meestal binnen 24 uur) krijg je toegang tot onze prijzen en kun je bestellen. Registreren kan via de "Account" knop bovenaan de pagina. Zonder KVK-nummer kun je wel de site bekijken maar niet bestellen.`
        : `LabFix is exclusively for business customers (B2B). Registration requires a valid Chamber of Commerce number. After approval (usually within 24 hours) you get access to our prices and can order. Register via the "Account" button at the top. Without a Chamber of Commerce number you can browse but not order.`;
      followUp = nl ? 'Ik heb geen KVK-nummer' : 'I don\'t have a Chamber of Commerce number';
      break;
      
    case 'pricing':
      response = nl
        ? `Onze prijzen zijn exclusief voor geregistreerde zakelijke klanten. Na registratie met KVK-nummer en goedkeuring zie je direct alle prijzen. We bieden staffelkortingen: hogere volumes = lagere prijzen per stuk. Voor grote projecten (100+ stuks) maken we graag een offerte op maat. Registreren is gratis.`
        : `Our prices are exclusive to registered business customers. After registration with Chamber of Commerce number and approval, you immediately see all prices. We offer volume discounts: higher volumes = lower per-unit prices. For large projects (100+ units) we're happy to make a custom quote. Registration is free.`;
      followUp = nl ? 'Registreren als klant' : 'Register as customer';
      break;
      
    case 'order_status':
      response = nl
        ? `Je kunt je bestelling 24/7 volgen via "Mijn Account" > "Bestellingen". Daar zie je de huidige status en track & trace code. Heb je geen account aangemaakt tijdens bestelling? Neem dan contact op via info@labfix.nl met je bestelnummer. We reageren meestal binnen 2 uur op werkdagen.`
        : `You can track your order 24/7 via "My Account" > "Orders". There you see current status and track & trace code. Didn't create an account during order? Contact info@labfix.nl with your order number. We usually respond within 2 hours on business days.`;
      followUp = nl ? 'Track & trace werkt niet' : 'Track & trace not working';
      break;
      
    case 'product_info':
      const brand = entities.find(e => ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Google', 'Motorola'].includes(e));
      const product = entities.find(e => ['screen', 'battery', 'camera', 'back_cover', 'charging'].includes(e));
      
      if (brand && product) {
        response = nl
          ? `Ja, we hebben ${product === 'screen' ? 'schermen' : product === 'battery' ? 'batterijen' : product === 'camera' ? 'camera\'s' : 'onderdelen'} voor ${brand}! Onze ${brand}-range is zeer uitgebreid: van de nieuwste modellen tot oudere series. Alle onderdelen worden getest op kwaliteit. Log in om prijzen en voorraad te zien. Twijfel je over compatibiliteit? Onze support helpt graag.`
          : `Yes, we have ${product}s for ${brand}! Our ${brand} range is very extensive: from latest models to older series. All parts are quality tested. Log in to see prices and stock. Unsure about compatibility? Our support is happy to help.`;
      } else if (brand) {
        response = nl
          ? `We hebben een uitgebreid assortiment ${brand}-onderdelen: schermen (LCD/OLED), batterijen, camera\'s, back covers, charging ports en meer. Van oudere modellen tot de nieuwste releases. Gebruik de zoekfunctie op de site of filter op merk om snel te vinden wat je zoekt. Heb je een specifiek modelnummer?`
          : `We have an extensive range of ${brand} parts: screens (LCD/OLED), batteries, cameras, back covers, charging ports and more. From older models to latest releases. Use the search function or filter by brand to quickly find what you need. Do you have a specific model number?`;
      } else if (product) {
        response = nl
          ? `We hebben ${product === 'screen' ? 'schermen' : product === 'battery' ? 'batterijen' : 'onderdelen'} voor vrijwel alle populaire merken: Apple, Samsung, Google, Huawei, Xiaomi, Motorola, en vele anderen. Zowel originele kwaliteit als premium compatible opties. Elk product wordt gecontroleerd op functionaliteit voor verzending.`
          : `We have ${product}s for almost all popular brands: Apple, Samsung, Google, Huawei, Xiaomi, Motorola, and many others. Both original quality and premium compatible options. Every product is checked for functionality before shipping.`;
      } else {
        response = nl
          ? `LabFix levert premium reparatieonderdelen voor smartphones, tablets en laptops. Ons assortiment omvat: schermen (LCD/OLED), batterijen, camera\'s, back covers, charging ports, knoppen en meer. We hebben onderdelen voor 100+ merken en 1000+ modellen. Alle producten zijn getest en hebben garantie.`
          : `LabFix supplies premium repair parts for smartphones, tablets and laptops. Our range includes: screens (LCD/OLED), batteries, cameras, back covers, charging ports, buttons and more. We have parts for 100+ brands and 1000+ models. All products are tested and have warranty.`;
      }
      followUp = nl ? 'Wat is het verschil tussen LCD en OLED?' : 'What is the difference between LCD and OLED?';
      break;
      
    case 'contact':
      response = nl
        ? `Je kunt ons op verschillende manieren bereiken:\n📧 Email: info@labfix.nl (antwoord binnen 2 uur op werkdagen)\n📱 WhatsApp: +31 6 5113 1133 (ook voor urgente vragen)\n📞 Telefoon: +31 6 5113 1133\n🕐 Beschikbaar: Ma-Vr 09:00-17:00\n\nVoor support vragen: support@labfix.nl\nVoor sales/offertes: sales@labfix.nl`
        : `You can reach us in several ways:\n📧 Email: info@labfix.nl (reply within 2 hours on business days)\n📱 WhatsApp: +31 6 5113 1133 (also for urgent questions)\n📞 Phone: +31 6 5113 1133\n🕐 Available: Mon-Fri 09:00-17:00\n\nFor support: support@labfix.nl\nFor sales/quotes: sales@labfix.nl`;
      followUp = nl ? 'Ik heb een dringende vraag' : 'I have an urgent question';
      break;
      
    case 'about':
      response = nl
          ? `LabFix is een toonaangevende Nederlandse B2B groothandel gespecialiseerd in reparatieonderdelen voor mobiele apparaten. Sinds onze oprichting bedienen we professionele reparatiebedrijven door heel Europa.\n\nWat ons onderscheidt:\n✓ Ruimste assortiment (100+ merken, 50.000+ producten)\n✓ Strikte kwaliteitscontrole (elk product wordt getest)\n✓ Snelle levering (1-3 dagen EU)\n✓ Deskundige support (reparateurs met jaren ervaring)\n✓ Scherpe prijzen voor zakelijke klanten\n\nWe zijn meer dan een leverancier - we zijn je partner in reparatie.`
          : `LabFix is a leading Dutch B2B wholesale company specialized in repair parts for mobile devices. Since our founding we serve professional repair shops throughout Europe.\n\nWhat sets us apart:\n✓ Widest range (100+ brands, 50,000+ products)\n✓ Strict quality control (every product tested)\n✓ Fast delivery (1-3 days EU)\n✓ Expert support (repairers with years of experience)\n✓ Sharp prices for business customers\n\nWe're more than a supplier - we're your repair partner.`;
      followUp = nl ? 'Waar is LabFix gevestigd?' : 'Where is LabFix located?';
      break;
      
    case 'availability':
      response = nl
        ? `Onze voorraad wordt real-time bijgewerkt. Producten gemarkeerd als "Op voorraad" zijn direct leverbaar. Is iets tijdelijk uitverkocht? Je kunt een mail alert instellen en we mailen zodra het weer beschikbaar is. De meeste populaire onderdelen (iPhone, Samsung schermen/batterijen) hebben we altijd op voorraad. Zeldzamere modellen soms binnen 2-3 dagen te leveren vanuit onze centrale voorraad.`
        : `Our stock updates in real-time. Products marked "In stock" are immediately available. Something temporarily out of stock? You can set a mail alert and we'll email when available again. Most popular parts (iPhone, Samsung screens/batteries) we always have in stock. Rarer models sometimes available within 2-3 days from our central warehouse.`;
      followUp = nl ? 'Product is uitverkocht' : 'Product is out of stock';
      break;
      
    case 'bulk':
      response = nl
        ? `Als B2B groothandel zijn we gespecialiseerd in grotere volumes. Onze staffelkortingen werken als volgt:\n• 10-49 stuks: 5% korting\n• 50-99 stuks: 10% korting\n• 100-499 stuks: 15% korting\n• 500+ stuks: 20% korting of meer\n\nVoor projecten (bijv. 100+ schermen voor een refresh) maken we graag een maatwerk offerte. Neem contact op met sales@labfix.nl met je specificaties.`
        : `As a B2B wholesaler we specialize in larger volumes. Our volume discounts work as follows:\n• 10-49 units: 5% discount\n• 50-99 units: 10% discount\n• 100-499 units: 15% discount\n• 500+ units: 20% discount or more\n\nFor projects (e.g. 100+ screens for a refresh) we're happy to make a custom quote. Contact sales@labfix.nl with your specifications.`;
      followUp = nl ? 'Offerte aanvragen' : 'Request quote';
      break;
      
    case 'compatibility':
      response = nl
        ? `Compatibiliteit is cruciaal bij reparatieonderdelen. Op onze productpagina\'s zie je exact welke modellen compatible zijn. Let op: zelfs binnen een serie (bijv. iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max) zijn onderdelen vaak verschillend!\n\nTwijfel je? Onze support kan helpen met het vinden van het juiste onderdeel. Stuur een foto of modelnummer naar info@labfix.nl. We checken het gratis voor je voordat je bestelt.`
        : `Compatibility is crucial with repair parts. On our product pages you see exactly which models are compatible. Note: even within a series (e.g. iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max) parts are often different!\n\nUnsure? Our support can help find the right part. Send a photo or model number to info@labfix.nl. We check it free for you before you order.`;
      followUp = nl ? 'Hoe vind ik mijn modelnummer?' : 'How do I find my model number?';
      break;
      
    case 'greeting':
      const greetings = nl ? [
        'Hallo! Leuk je te spreken. Ik ben de LabFix AI-assistent en ik help je graag met alles wat met onze reparatieonderdelen en services te maken heeft. Wat kan ik voor je doen?',
        'Goedendag! Welkom bij LabFix. Ik ben er om je te helpen met vragen over onze producten, verzending, betalingen of wat dan ook. Waar ben je naar op zoek?',
        'Hoi! Ik ben de digitale helper van LabFix. Ik weet alles over ons assortiment van 50.000+ reparatieonderdelen. Stel me gerust je vraag!',
      ] : [
        'Hello! Nice to speak with you. I\'m the LabFix AI assistant and I\'m happy to help with everything related to our repair parts and services. What can I do for you?',
        'Good day! Welcome to LabFix. I\'m here to help with questions about our products, shipping, payments or whatever you need. What are you looking for?',
        'Hi! I\'m the digital helper of LabFix. I know all about our range of 50,000+ repair parts. Feel free to ask your question!',
      ];
      response = greetings[Math.floor(Math.random() * greetings.length)];
      break;
      
    default:
      // Check if this is a follow-up question
      if (context.lastTopic) {
        if (/ja|yes|graag|please|ok/.test(q)) {
          if (context.lastTopic === 'shipping') {
            response = nl
              ? `Top! Om je bestelling te volgen: log in op je account en ga naar "Mijn Account" > "Bestellingen". Daar zie je alle details en de track & trace code. Werkt de tracking niet? Soms duurt het 24 uur voordat het systeem update. Neem gerust contact op als je hulp nodig hebt!`
              : `Great! To track your order: log in to your account and go to "My Account" > "Orders". There you see all details and the track & trace code. Tracking not working? Sometimes it takes 24 hours for the system to update. Feel free to contact us if you need help!`;
          } else if (context.lastTopic === 'payment') {
            response = nl
              ? `Perfect! Om te registreren: klik op "Account" bovenaan de pagina, kies "Registreren" en vul je bedrijfsgegevens + KVK-nummer in. We keuren meestal binnen 24 uur goed. Daarna kun je direct bestellen en zie je alle prijzen.`
              : `Perfect! To register: click "Account" at the top of the page, choose "Register" and fill in your company details + Chamber of Commerce number. We usually approve within 24 hours. Then you can order immediately and see all prices.`;
          }
        }
      }
      
      if (!response) {
        response = nl
          ? `Ik begrijp je vraag, maar wil zeker weten dat ik je goed help. Kun je iets specifieker zijn? Bijvoorbeeld:\n• "Wat kost een iPhone 15 scherm?"\n• "Hoe snel leveren jullie naar België?"\n• "Hoe registreer ik mijn bedrijf?"\n• "Hebben jullie batterijen voor Samsung Galaxy S24?"\n\nOf type "help" voor een overzicht van wat ik allemaal weet.`
          : `I understand your question, but want to make sure I help you well. Could you be more specific? For example:\n• "What does an iPhone 15 screen cost?"\n• "How fast do you deliver to Germany?"\n• "How do I register my company?"\n• "Do you have batteries for Samsung Galaxy S24?"\n\nOr type "help" for an overview of what I know.`;
      }
  }
  
  context.lastTopic = intent !== 'unknown' ? intent : context.lastTopic;
  context.lastBrand = entities.find(e => ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Google', 'Motorola'].includes(e)) || context.lastBrand;
  
  return { response, followUp };
}

function getLabFixAnswer(question: string, nl: boolean, context?: ConversationContext): string {
  const ctx = context || createContext();
  const result = generateSmartResponse(question, nl, ctx);
  return result.response;
}

export default function HelpWidget() {
  const { locale } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>('home');
  const [prevTab, setPrevTab] = useState<WidgetTab>('home');
  const [isAnimating, setIsAnimating] = useState(false);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
  const [botInput, setBotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const widgetRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const contextRef = useRef<ConversationContext>(createContext());

  const nl = locale === 'nl';

  // Handle close with context reset for bot
  const handleClose = () => {
    setIsOpen(false);
    if (activeTab === 'bot') {
      setTimeout(() => {
        contextRef.current = createContext();
        setBotMessages([]);
        setBotInput('');
      }, 300);
    }
  };

  useEffect(() => {
    fetchNews().then(articles => setNewsArticles(articles.filter(a => a.published)));
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (chatEndRef.current && botMessages.length > 0) {
      const container = chatEndRef.current.parentElement;
      if (container && container.scrollHeight > container.clientHeight) {
        chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [botMessages, typedText, isTyping]);

  // Clear typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const handleTabChange = (newTab: WidgetTab) => {
    if (newTab === activeTab || isAnimating) return;
    setIsAnimating(true);
    setPrevTab(activeTab);
    setActiveTab(newTab);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleBotSend = () => {
    if (!botInput.trim() || isTyping) return;
    const userMsg = botInput.trim();
    setBotInput('');
    setBotMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    
    // Show typing indicator after 400ms delay (natural feel)
    setTimeout(() => {
      setIsTyping(true);
      
      // Get the answer with context
      const answer = getLabFixAnswer(userMsg, nl, contextRef.current);
      
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
        <div className="bg-primary-600 text-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-0.1 inline-block">
                <img src="/logo.png" alt="LabFix" className="h-12 w-auto object-contain" />
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
        <div className="h-[380px] relative">
          {/* HOME TAB */}
          <div className={`absolute inset-0 overflow-y-auto transition-all duration-200 ${activeTab === 'home' ? 'opacity-100 translate-x-0 z-10' : prevTab === 'home' ? 'opacity-0 -translate-x-4 z-0' : 'opacity-0 translate-x-4 z-0 pointer-events-none'}`}>
              {/* News Banner */}
              {newsArticles.length > 0 && (
                <div className="mx-4 mt-4">
                  <Link href="/nieuws" onClick={handleClose}>
                    <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-3 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <Newspaper size={16} className="text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-primary-700 truncate">
                            {nl ? 'Bekijk onze recente nieuwsartikelen' : 'View our recent news articles'}
                          </p>
                          <p className="text-[10px] text-primary-500 truncate">
                            {newsArticles[0] && (nl ? newsArticles[0].title : (newsArticles[0].titleEn || newsArticles[0].title))}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-primary-400 flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="px-5 pt-4 pb-3">
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

              {/* Repair Link */}
              <div className="mx-4 mb-3">
                <Link href="/repair" onClick={handleClose}>
                  <div className="w-full flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                        <Wrench size={20} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800 text-sm">{nl ? 'Reparatie nodig?' : 'Need a repair?'}</p>
                        <p className="text-xs text-gray-500">{nl ? 'Vul het formulier in voor een afspraak' : 'Fill in the form for an appointment'}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-amber-500" />
                  </div>
                </Link>
              </div>

              {/* News articles */}
              {newsArticles.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase">{nl ? 'Nieuws' : 'News'}</span>
                    <button 
                      onClick={() => handleTabChange('news')}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                    >
                      {nl ? 'Alles bekijken' : 'View all'} <ChevronRight size={14} />
                    </button>
                  </div>
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

          {/* BOT TAB */}
          <div className={`absolute inset-0 transition-all duration-200 ${activeTab === 'bot' ? 'opacity-100 translate-x-0 z-10' : prevTab === 'bot' ? 'opacity-0 -translate-x-4 z-0' : 'opacity-0 translate-x-4 z-0 pointer-events-none'}`}>
            <div className="flex flex-col h-full">
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
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
          </div>

          {/* HELP TAB */}
          <div className={`absolute inset-0 overflow-y-auto transition-all duration-200 ${activeTab === 'help' ? 'opacity-100 translate-x-0 z-10' : prevTab === 'help' ? 'opacity-0 -translate-x-4 z-0' : 'opacity-0 translate-x-4 z-0 pointer-events-none'}`}>
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
          </div>

          {/* NEWS TAB */}
          <div className={`absolute inset-0 overflow-y-auto transition-all duration-200 ${activeTab === 'news' ? 'opacity-100 translate-x-0 z-10' : prevTab === 'news' ? 'opacity-0 -translate-x-4 z-0' : 'opacity-0 translate-x-4 z-0 pointer-events-none'}`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{nl ? 'Laatste Nieuws' : 'Latest News'}</h3>
                <Link 
                  href="/nieuws" 
                  onClick={handleClose}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  {nl ? 'Alles bekijken' : 'View all'} <ChevronRight size={14} />
                </Link>
              </div>
              {newsArticles.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  {nl ? 'Nog geen nieuwsartikelen.' : 'No news articles yet.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {newsArticles.map((article) => (
                    <Link 
                      key={article.id} 
                      href={`/nieuws`}
                      onClick={handleClose}
                      className="block border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
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
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
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
              onClick={() => handleTabChange(key)}
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
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 bg-primary-600 hover:bg-primary-700`}
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
