'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, Shield, Lock, Eye, FileText, Server, UserX, Cookie, Globe, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { locale } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/" className="text-gray-500 hover:text-primary-600 flex items-center gap-2 text-sm">
            <ChevronLeft size={16} />
            {locale === 'nl' ? 'Terug naar home' : 'Back to home'}
          </Link>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Shield className="text-primary-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {locale === 'nl' ? 'Privacy Policy' : 'Privacy Policy'}
              </h1>
              <p className="text-gray-500 mt-1">
                {locale === 'nl' ? 'Laatst bijgewerkt: 21 april 2026' : 'Last updated: April 21, 2026'}
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-blue-800 text-sm">
              <strong>{locale === 'nl' ? 'Jouw privacy is belangrijk:' : 'Your privacy matters:'}</strong>{' '}
              {locale === 'nl' 
                ? 'LabFix respecteert jouw privacy en beschermt je persoonsgegegens volgens de AVG (GDPR). In dit document lees je hoe we omgaan met jouw data.'
                : 'LabFix respects your privacy and protects your personal data according to GDPR. This document explains how we handle your data.'}
            </p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {locale === 'nl' ? 'Inhoudsopgave' : 'Table of Contents'}
          </h2>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              { id: 'wie', label: locale === 'nl' ? '1. Wie zijn wij?' : '1. Who we are' },
              { id: 'data', label: locale === 'nl' ? '2. Welke data verzamelen we?' : '2. What data we collect' },
              { id: 'waarom', label: locale === 'nl' ? '3. Waarom verzamelen we data?' : '3. Why we collect data' },
              { id: 'bewaring', label: locale === 'nl' ? '4. Hoelang bewaren we data?' : '4. How long we keep data' },
              { id: 'delen', label: locale === 'nl' ? '5. Met wie delen we data?' : '5. Who we share data with' },
              { id: 'beveiliging', label: locale === 'nl' ? '6. Beveiliging' : '6. Security' },
              { id: 'rechten', label: locale === 'nl' ? '7. Jouw rechten' : '7. Your rights' },
              { id: 'cookies', label: locale === 'nl' ? '8. Cookies' : '8. Cookies' },
              { id: 'internationaal', label: locale === 'nl' ? '9. Internationale transfers' : '9. International transfers' },
              { id: 'contact', label: locale === 'nl' ? '10. Contact' : '10. Contact' },
            ].map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                className="text-primary-600 hover:text-primary-800 hover:underline text-sm py-1"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-10">

          {/* 1. Wie zijn wij */}
          <section id="wie">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Wie zijn wij?
            </h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>LabFix</strong> is een eenmanszaak. Wij zijn verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze privacy policy.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="font-semibold text-gray-800 mb-2">Onze contactgegevens:</p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> <span className="text-gray-400">[TE VERVULLEN]</span></li>
                  <li className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /> <span className="text-gray-400">[TE VERVULLEN]</span></li>
                  <li><span className="text-gray-400">[TE VERVULLEN]</span></li>
                  <li>KVK: [TE VERVULLEN]</li>
                </ul>
              </div>
              
              <p>Onze Functionaris Gegevensbescherming (FG) is te bereiken voor alle vragen over privacy en gegevensbescherming.</p>
            </div>
          </section>

          {/* 2. Welke data verzamelen we */}
          <section id="data">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Welke persoonsgegevens verzamelen we?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We verzamelen verschillende soorten persoonsgegevens, afhankelijk van hoe je met ons interacteert:</p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Account en Bestellingen</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Naam (bedrijfsnaam en contactpersoon)</li>
                    <li>E-mailadres</li>
                    <li>Telefoonnummer</li>
                    <li>Adresgegevens (straat, huisnummer, postcode, stad, land)</li>
                    <li>KVK-nummer (voor zakelijke klanten)</li>
                    <li>BTW-nummer (voor zakelijke klanten)</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Betalingen</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Bankrekeningnummer/IBAN (alleen voor terugbetalingen)</li>
                    <li>Betaalhistorie en facturen</li>
                    <li>Transactiegegevens (worden niet door ons opgeslagen maar door onze payment providers)</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Reparatie Afspraken</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Naam en contactgegevens</li>
                    <li>Apparaat informatie (type, model, probleembeschrijving)</li>
                    <li>Afspraakgegevens en geschiedenis</li>
                    <li>Servicevoorkeuren (ophalen/brengen)</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Nieuwsbrief</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>E-mailadres</li>
                    <li>Voorkeuren en interesses (indien aangegeven)</li>
                    <li>Openings- en klikstatistieken</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">Technische Gegevens</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>IP-adres</li>
                    <li>Browser type en versie</li>
                    <li>Besturingssysteem</li>
                    <li>Apparaatgegevens</li>
                    <li>Referral URL en klikgedrag</li>
                    <li>Cookies en vergelijkbare technologieën</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Waarom verzamelen we data */}
          <section id="waarom">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Waarom verzamelen we deze gegevens?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We verwerken je persoonsgegevens voor de volgende doeleinden, gebaseerd op verschillende rechtsgronden:</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-semibold">Doel</th>
                      <th className="text-left p-3 font-semibold">Rechtsgrond</th>
                      <th className="text-left p-3 font-semibold">Beschrijving</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Account beheer</td>
                      <td className="p-3">Uitvoering overeenkomst</td>
                      <td className="p-3">Creëren en beheren van je account</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Bestellingen afhandelen</td>
                      <td className="p-3">Uitvoering overeenkomst</td>
                      <td className="p-3">Verwerken, verzenden en factureren van bestellingen</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Reparatie afspraken</td>
                      <td className="p-3">Uitvoering overeenkomst</td>
                      <td className="p-3">Inplannen en uitvoeren van reparatiediensten</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Klantenservice</td>
                      <td className="p-3">Uitvoering overeenkomst / Gerechtvaardigd belang</td>
                      <td className="p-3">Beantwoorden van vragen en oplossen van problemen</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Nieuwsbrief</td>
                      <td className="p-3">Toestemming</td>
                      <td className="p-3">Versturen van marketingcommunicatie (alleen met jouw toestemming)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Website verbetering</td>
                      <td className="p-3">Gerechtvaardigd belang</td>
                      <td className="p-3">Analyseren van websitegebruik voor optimalisatie</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Fraudepreventie</td>
                      <td className="p-3">Gerechtvaardigd belang / Wettelijke verplichting</td>
                      <td className="p-3">Beschermen tegen fraude en misbruik</td>
                    </tr>
                    <tr>
                      <td className="p-3">Wettelijke verplichtingen</td>
                      <td className="p-3">Wettelijke verplichting</td>
                      <td className="p-3">Belastingaangifte, boekhouding, juridische verplichtingen</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 4. Hoelang bewaren we data */}
          <section id="bewaring">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Hoelang bewaren we je gegevens?
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>We bewaren je persoonsgegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor ze zijn verzameld, of dan wettelijk is vereist:</p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Accountgegevens:</strong> Zolang je account actief is. Na verwijdering bewaren we minimale gegevens 7 jaar voor fiscale verplichtingen.</li>
                <li><strong>Bestelgegevens:</strong> 7 jaar (wettelijke bewaarplicht boekhouding).</li>
                <li><strong>Reparatiegegevens:</strong> 2 jaar na afronding van de reparatie (garantiedoeleinden).</li>
                <li><strong>Nieuwsbrief inschrijvingen:</strong> Zolang je niet uitschrijft. Na uitschrijving bewaren we je e-mail 30 dagen om te voorkomen dat je opnieuw wordt toegevoegd.</li>
                <li><strong>Contactformulieren:</strong> 1 jaar na afhandeling van je vraag.</li>
                <li><strong>Cookies:</strong> Zie onze <a href="#cookies" className="text-primary-600 hover:underline">cookie uitleg</a>.</li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Let op:</strong> In sommige gevallen moeten we gegevens langer bewaren, bijvoorbeeld bij lopende juridische procedures of geschillen.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Met wie delen we data */}
          <section id="delen">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
              Met wie delen we je gegevens?
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We verkopen je gegevens nooit aan derden. We delen je gegevens alleen wanneer dit noodzakelijk is voor onze dienstverlening:</p>
              
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Verwerkers (Processors)</h3>
                  <p className="text-sm mb-2">Deze partijen verwerken gegevens namens ons:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><strong>Hosting provider:</strong> Voor het hosten van onze website en database</li>
                    <li><strong>Payment providers (Mollie, Stripe):</strong> Voor veilige betalingsverwerking</li>
                    <li><strong>Verzendpartners (PostNL, DHL, DPD):</strong> Voor bezorging van pakketten</li>
                    <li><strong>E-mail service provider (SendGrid, Mailgun):</strong> Voor transactie-e-mails en nieuwsbrieven</li>
                    <li><strong>Analytics providers (Google Analytics):</strong> Voor website-statistieken (geanonimiseerd)</li>
                    <li><strong>Cloud storage (AWS, Google Cloud):</strong> Voor back-ups</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Derden bij wettelijke verplichting</h3>
                  <p className="text-sm">We kunnen gegevens verstrekken aan:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Belastingdienst en andere overheidsinstanties (wettelijke verplichting)</li>
                    <li>Recherche en justitie (bij wettelijk verzoek)</li>
                    <li>Juridische adviseurs (bij geschillen)</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Bij bedrijfsoverdracht</h3>
                  <p className="text-sm">Bij fusie, overname of verkoop van bedrijfsactiva kunnen klantgegevens worden overgedragen aan de overnemende partij, onder voorbehoud van dezelfde privacy bescherming.</p>
                </div>
              </div>
              
              <p className="text-sm">Alle verwerkers hebben een verwerkersovereenkomst (DPA) met ons getekend en voldoen aan de AVG.</p>
            </div>
          </section>

          {/* 6. Beveiliging */}
          <section id="beveiliging">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Lock className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
              Beveiliging van je gegevens
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We nemen de bescherming van je gegevens serieus en hebben passende technische en organisatorische maatregelen getroffen:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Server size={16} /> Technische maatregelen
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-green-700">
                    <li>SSL/TLS encryptie (HTTPS)</li>
                    <li>Database encryptie</li>
                    <li>Firewall bescherming</li>
                    <li>Regelmatige beveiligingsupdates</li>
                    <li>Multi-factor authenticatie voor medewerkers</li>
                    <li>Automatische back-ups</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Eye size={16} /> Organisatorische maatregelen
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1 text-blue-700">
                    <li>Privacy training voor medewerkers</li>
                    <li>Toegangsbeheer (need-to-know basis)</li>
                    <li>Vertrouwelijkheidsverklaringen</li>
                    <li>Incident response plan</li>
                    <li>Periodieke beveiligingsaudits</li>
                    <li>Data Protection Impact Assessments (DPIA)</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm mt-4">Ondanks onze zorgvuldigheid kan geen enkele beveiliging 100% waterdicht zijn. Bij een datalek zullen we dit direct melden bij de Autoriteit Persoonsgegevens en, indien van toepassing, bij de betrokkenen.</p>
            </div>
          </section>

          {/* 7. Jouw rechten */}
          <section id="rechten">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <UserX className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
              Jouw rechten onder de AVG
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>De Algemene Verordening Gegevensbescherming (AVG) geeft je diverse rechten met betrekking tot je persoonsgegevens:</p>
              
              <div className="space-y-3">
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">1. Recht op inzage (Art. 15 AVG)</h3>
                  <p className="text-sm">Je hebt het recht om te weten welke persoonsgegevens we van je hebben en hoe we deze gebruiken.</p>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">2. Recht op rectificatie (Art. 16 AVG)</h3>
                  <p className="text-sm">Je kunt ons vragen om onjuiste gegevens te corrigeren of onvolledige gegevens aan te vullen.</p>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">3. Recht op verwijdering ("Recht om vergeten te worden") (Art. 17 AVG)</h3>
                  <p className="text-sm">Je kunt ons vragen om je gegevens te verwijderen, tenzij we ze moeten bewaren vanwege wettelijke verplichtingen.</p>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">4. Recht op beperking van verwerking (Art. 18 AVG)</h3>
                  <p className="text-sm">In bepaalde situaties kun je vragen om de verwerking van je gegevens tijdelijk te beperken.</p>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">5. Recht op dataportabiliteit (Art. 20 AVG)</h3>
                  <p className="text-sm">Je hebt het recht om je gegevens in een gestructureerd, gangbaar formaat te ontvangen en over te dragen aan een andere organisatie.</p>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">6. Recht van bezwaar (Art. 21 AVG)</h3>
                  <p className="text-sm">Je kunt bezwaar maken tegen de verwerking van je gegevens voor direct marketing of andere verwerkingen gebaseerd op gerechtvaardigd belang.</p>
                </div>
                
                <div className="border-l-4 border-primary-200 pl-4">
                  <h3 className="font-semibold text-gray-800">7. Recht op menselijke interventie bij geautomatiseerde besluitvorming (Art. 22 AVG)</h3>
                  <p className="text-sm">We maken geen gebruik van volledig geautomatiseerde besluitvorming met juridische gevolgen voor jou.</p>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4 mt-4">
                <p className="font-semibold text-gray-800 mb-2">Hoe je je rechten kunt uitoefenen:</p>
                <p className="text-sm">Stuur een verzoek naar <a href="mailto:privacy@labfix.nl" className="text-primary-600 hover:underline">privacy@labfix.nl</a> met vermelding van "AVG-verzoek". We reageren binnen 30 dagen. Voor je bescherming kunnen we je vragen om je identiteit te verifiëren.</p>
                <p className="text-sm mt-2">Je hebt ook het recht om een klacht in te dienen bij de <strong>Autoriteit Persoonsgegevens</strong> via <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">autoriteitpersoonsgegevens.nl</a>.</p>
              </div>
            </div>
          </section>

          {/* 8. Cookies */}
          <section id="cookies">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Cookie className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
              Cookies en vergelijkbare technologieën
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>We gebruiken cookies en vergelijkbare technologieën voor diverse doeleinden:</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-semibold">Soort</th>
                      <th className="text-left p-3 font-semibold">Doel</th>
                      <th className="text-left p-3 font-semibold">Bewaartermijn</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Noodzakelijk</td>
                      <td className="p-3">Essentiële functionaliteit (winkelwagen, login)</td>
                      <td className="p-3">Sessie - 1 jaar</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Voorkeuren</td>
                      <td className="p-3">Taal, valuta, en andere instellingen</td>
                      <td className="p-3">1 jaar</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Statistieken</td>
                      <td className="p-3">Anonieme website analyse (Google Analytics)</td>
                      <td className="p-3">2 jaar</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Marketing</td>
                      <td className="p-3">Gerichte advertenties (alleen met toestemming)</td>
                      <td className="p-3">Max 2 jaar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <p className="text-sm">Je kunt je cookie-voorkeuren op elk moment wijzigen via je browserinstellingen. Let op: het uitschakelen van noodzakelijke cookies kan de werking van de website beïnvloeden.</p>
            </div>
          </section>

          {/* 9. Internationale transfers */}
          <section id="internationaal">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Globe className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
              Internationale gegevensoverdracht
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>We streven ernaar om je gegevens binnen de Europese Economische Ruimte (EER) te verwerken. In sommige gevallen kunnen gegevens worden doorgegeven aan landen buiten de EER:</p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Verenigde Staten:</strong> Voor sommige diensten (zoals Google Analytics, SendGrid) kunnen gegevens naar de VS worden overgedragen. Deze transfers zijn beschermd door Standard Contractual Clauses (SCC's) goedgekeurd door de Europese Commissie.</li>
                <li><strong>Andere landen:</strong> We werken alleen met partijen die adequate beschermingsmaatregelen bieden zoals vastgelegd in de AVG.</li>
              </ul>
              
              <p className="text-sm">We zorgen er altijd voor dat dergelijke transfers voldoen aan de vereisten van de AVG en dat je gegevens adequaat worden beschermd.</p>
            </div>
          </section>

          {/* 10. Contact */}
          <section id="contact">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
              Contact over privacy
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Heb je vragen over onze privacy policy of wil je je rechten uitoefenen? Neem contact met ons op:</p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Functionaris Gegevensbescherming</h3>
                    <p className="text-sm text-gray-400">[TE VERVULLEN]</p>
                    <p className="text-sm">Voor alle privacy-gerelateerde vragen</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Algemene vragen</h3>
                    <p className="text-sm text-gray-400">[TE VERVULLEN]</p>
                    <p className="text-sm text-gray-400">[TE VERVULLEN]</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-800 mb-2">Adres:</p>
                  <p className="text-sm text-gray-400">[TE VERVULLEN]</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Toezichthouder</h3>
                <p className="text-sm text-blue-700">
                  Je hebt het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens als je denkt dat we niet goed omgaan met je gegevens:
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  <strong>Autoriteit Persoonsgegevens</strong><br />
                  <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">autoriteitpersoonsgegevens.nl</a>
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t pt-6 mt-8 text-center">
            <p className="text-sm text-gray-500">
              Deze privacy policy kan van tijd tot tijd worden gewijzigd. Wij raden je aan om regelmatig terug te kijken op deze pagina.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              © {new Date().getFullYear()} LabFix - Alle rechten voorbehouden
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
