'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, FileText, Scale, Truck, RotateCcw, CreditCard, Shield, AlertCircle, HelpCircle } from 'lucide-react';

export default function AlgemeneVoorwaardenPage() {
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
              <FileText className="text-primary-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {locale === 'nl' ? 'Algemene Voorwaarden' : 'General Terms and Conditions'}
              </h1>
              <p className="text-gray-500 mt-1">
                {locale === 'nl' ? 'Laatst bijgewerkt: 21 april 2026' : 'Last updated: April 21, 2026'}
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>{locale === 'nl' ? 'Belangrijk:' : 'Important:'}</strong>{' '}
              {locale === 'nl' 
                ? 'Door gebruik te maken van onze website en diensten gaat u akkoord met deze algemene voorwaarden. Lees ze zorgvuldig door.'
                : 'By using our website and services, you agree to these general terms and conditions. Please read them carefully.'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          
          {/* Artikel 1 */}
          <section id="artikel-1">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 1</span>
              Definities
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>In deze algemene voorwaarden wordt verstaan onder:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>LabFix:</strong> De eenmanszaak gevestigd te Roosendaal, KVK-nummer: 12345678, handelend onder de naam LabFix.</li>
                <li><strong>Klant:</strong> De natuurlijke of rechtspersoon die een overeenkomst aangaat met LabFix voor de levering van producten en/of diensten.</li>
                <li><strong>Overeenkomst:</strong> De overeenkomst tussen LabFix en de Klant betreffende de levering van producten en/of diensten.</li>
                <li><strong>Producten:</strong> Alle elektronische componenten, reparatieonderdelen, tools en accessoires die LabFix aanbiedt.</li>
                <li><strong>Diensten:</strong> Alle reparatiediensten, technische ondersteuning en advies die LabFix levert.</li>
                <li><strong>Website:</strong> De website van LabFix, bereikbaar via www.labfix.nl.</li>
              </ul>
            </div>
          </section>

          {/* Artikel 2 */}
          <section id="artikel-2">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 2</span>
              Toepasselijkheid
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, offertes, overeenkomsten en leveringen van LabFix, tenzij uitdrukkelijk anders overeengekomen.</p>
              <p>2. Afwijkingen van deze algemene voorwaarden zijn slechts geldig indien deze uitdrukkelijk en schriftelijk zijn overeengekomen.</p>
              <p>3. Indien één of meerdere bepalingen in deze algemene voorwaarden nietig of vernietigbaar zijn, blijven de overige bepalingen onverminderd van kracht.</p>
              <p>4. LabFix behoudt zich het recht voor om deze algemene voorwaarden van tijd tot tijd te wijzigen. De meest actuele versie is altijd beschikbaar op de website.</p>
            </div>
          </section>

          {/* Artikel 3 */}
          <section id="artikel-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 3</span>
              Offertes en Prijzen
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Alle offertes van LabFix zijn vrijblijvend en geldig gedurende 14 dagen na datum van uitgifte, tenzij anders vermeld.</p>
              <p>2. Prijzen worden vermeld in Euro's en zijn exclusief BTW, tenzij anders aangegeven.</p>
              <p>3. Verzendkosten worden apart vermeld en zijn voor rekening van de Klant, tenzij anders overeengekomen.</p>
              <p>4. Prijzen op de website zijn onder voorbehoud van typefouten. LabFix behoudt zich het recht voor om prijzen te corrigeren.</p>
              <p>5. LabFix is niet gebonden aan prijsafwijkingen indien deze het gevolg zijn van wijzigingen in wet- en regelgeving, belastingen, in- en uitvoerrechten, valutakoersen of inkoopprijzen.</p>
            </div>
          </section>

          {/* Artikel 4 */}
          <section id="artikel-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 4</span>
              Bestellingen en Overeenkomst
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Een overeenkomst komt tot stand door aanvaarding door de Klant van het aanbod van LabFix en het voldoen aan de daarbij gestelde voorwaarden.</p>
              <p>2. LabFix behoudt zich het recht voor om bestellingen te weigeren of aanvullende voorwaarden te stellen, bijvoorbeeld in geval van onvolledige of onjuiste klantgegevens.</p>
              <p>3. Bij producten die op maat worden gemaakt of besteld, kan een aanbetaling vereist zijn. Dit wordt vooraf met de Klant overeengekomen.</p>
              <p>4. De Klant is verantwoordelijk voor de juistheid en volledigheid van de verstrekte gegevens.</p>
            </div>
          </section>

          {/* Artikel 5 - Betaling */}
          <section id="artikel-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 5</span>
              Betaling
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Betalingsvoorwaarden worden per overeenkomst vastgesteld.</p>
              <p>2. Bij betalingsachterstand is LabFix gerechtigd om wettelijke rente en incassokosten in rekening te brengen conform de wettelijke bepalingen.</p>
              <p>3. In geval van liquidatie, faillissement, beslaglegging of surseance van betaling van de Klant, zijn alle vorderingen van LabFix op de Klant onmiddellijk opeisbaar.</p>
              <p>4. LabFix accepteert verschillende betaalmethoden. De beschikbare opties worden tijdens het bestelproces vermeld.</p>
            </div>
          </section>

          {/* Artikel 6 - Levering */}
          <section id="artikel-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Truck className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 6</span>
              Levering en Verzending
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Levering geschiedt op het door de Klant opgegeven adres, tenzij anders overeengekomen.</p>
              <p>2. De opgegeven levertijden zijn indicatief en geen fatale termijnen. Overschrijding van de levertijd geeft de Klant geen recht op schadevergoeding of ontbinding.</p>
              <p>3. Het risico van verlies of beschadiging van producten gaat over op de Klant op het moment van levering.</p>
              <p>4. LabFix is niet aansprakelijk voor vertragingen bij de vervoerder. Klachten over vertragingen dienen direct bij de vervoerder te worden ingediend.</p>
              <p>5. Voor zendingen naar het buitenland kunnen aanvullende kosten van toepassing zijn, zoals douanekosten en importbelastingen. Deze zijn voor rekening van de Klant.</p>
            </div>
          </section>

          {/* Artikel 7 - Herroeping */}
          <section id="artikel-7">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <RotateCcw className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 7</span>
              Herroepingsrecht
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. De Klant heeft het recht om binnen 14 dagen na ontvangst van het product, zonder opgave van redenen, de overeenkomst te herroepen.</p>
              <p>2. Het herroepingsrecht is uitgesloten voor:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Producten die volgens specificaties van de consument zijn vervaardigd (maatwerk)</li>
                <li>Producten die om hygiënische redenen niet geschikt zijn om te retourneren</li>
                <li>Producten die na levering onherroepelijk vermengd zijn met andere producten</li>
                <li>Digitale producten na download</li>
                <li>Diensten die volledig zijn uitgevoerd met voorafgaande uitdrukkelijke toestemming</li>
              </ul>
              <p>3. Bij uitoefening van het herroepingsrecht dient de Klant het product ongebruikt, onbeschadigd en in originele verpakking te retourneren.</p>
              <p>4. De retourkosten zijn voor rekening van de Klant, tenzij anders overeengekomen.</p>
              <p>5. LabFix zal het bedrag binnen 14 dagen na ontvangst van de retourzending terugbetalen, gebruikmakend van hetzelfde betaalmiddel als bij de oorspronkelijke transactie.</p>
            </div>
          </section>

          {/* Artikel 8 - Garantie */}
          <section id="artikel-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Shield className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 8</span>
              Garantie en Conformiteit
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. LabFix staat ervoor in dat de producten voldoen aan de overeenkomst, de in het aanbod vermelde specificaties, en de redelijke eisen van deugdelijkheid en bruikbaarheid.</p>
              <p>2. De wettelijke garantieperiode is 2 jaar na levering voor consumenten.</p>
              <p>3. Voor zakelijke klanten geldt een garantieperiode van 12 maanden, tenzij anders overeengekomen.</p>
              <p>4. Garantieclaims dienen binnen redelijke termijn na ontdekking van het gebrek te worden gemeld.</p>
              <p>5. Garantie is uitgesloten voor:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Slijtage door normaal gebruik</li>
                <li>Onjuist gebruik of nalatigheid</li>
                <li>Reparaties door derden zonder toestemming van LabFix</li>
                <li>Schade door externe oorzaken (valschade, waterschade, etc.)</li>
              </ul>
            </div>
          </section>

          {/* Artikel 9 - Reparatie Diensten */}
          <section id="artikel-9">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <AlertCircle className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 9</span>
              Reparatiediensten
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Reparatieafspraken dienen minimaal 24 uur van tevoren te worden geannuleerd of verzet.</p>
              <p>2. No-show zonder tijdige annulering kan resulteren in kosten.</p>
              <p>3. LabFix biedt geen garantie op reparaties van apparaten met voorafgaande schade of modificaties.</p>
              <p>4. Dataverlies tijdens reparatie is voor risico van de Klant. LabFix raadt aan een back-up te maken voorafgaand aan de reparatie.</p>
              <p>5. Voor onderdelen die tijdens reparatie worden vervangen, geldt de garantie van de fabrikant van het betreffende onderdeel.</p>
              <p>6. Indien een apparaat niet meer te repareren blijkt, kunnen onderzoekskosten in rekening worden gebracht.</p>
            </div>
          </section>

          {/* Artikel 10 */}
          <section id="artikel-10">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Scale className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 10</span>
              Aansprakelijkheid
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. LabFix is niet aansprakelijk voor schade die het gevolg is van onjuiste of onvolledige informatie verstrekt door de Klant.</p>
              <p>2. LabFix is uitsluitend aansprakelijk voor directe schade die het rechtstreeks en uitsluitend gevolg is van een aan LabFix toerekenbare tekortkoming.</p>
              <p>3. LabFix is niet aansprakelijk voor indirecte schade, waaronder maar niet beperkt tot: gevolgschade, gederfde winst, verlies van data, en immateriële schade.</p>
              <p>4. De aansprakelijkheid van LabFix is beperkt tot maximaal het factuurbedrag van de betreffende overeenkomst.</p>
              <p>5. LabFix is niet aansprakelijk voor schade veroorzaakt door overmacht, waaronder begrepen: oorlog, terrorisme, natuurrampen, epidemieën, overstromingen, brand, staking, en storingen in energievoorziening of telecommunicatie.</p>
            </div>
          </section>

          {/* Artikel 11 */}
          <section id="artikel-11">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 11</span>
              Intellectuele Eigendom
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Alle intellectuele eigendomsrechten op producten, documenten, afbeeldingen, en andere materialen van LabFix blijven eigendom van LabFix of haar licentiegevers.</p>
              <p>2. De Klant mag deze materialen alleen gebruiken voor persoonlijk, niet-commercieel gebruik, tenzij anders overeengekomen.</p>
              <p>3. Het is niet toegestaan om de website of delen daarvan te kopiëren, reproduceren, verspreiden, of exploiten zonder voorafgaande schriftelijke toestemming van LabFix.</p>
            </div>
          </section>

          {/* Artikel 12 */}
          <section id="artikel-12">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 12</span>
              Persoonsgegevens
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. LabFix verwerkt persoonsgegevens in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG).</p>
              <p>2. Meer informatie over de verwerking van persoonsgegevens is te vinden in onze <Link href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</Link>.</p>
              <p>3. Door een overeenkomst aan te gaan met LabFix, geeft de Klant toestemming voor de verwerking van persoonsgegevens zoals beschreven in de Privacy Policy.</p>
            </div>
          </section>

          {/* Artikel 13 */}
          <section id="artikel-13">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <HelpCircle className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 13</span>
              Geschillen en Toepasselijk Recht
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>1. Op alle overeenkomsten tussen LabFix en de Klant is Nederlands recht van toepassing.</p>
              <p>2. Geschillen worden voorgelegd aan de bevoegde rechter in het arrondissement waar LabFix is gevestigd.</p>
              <p>3. Indien enige bepaling van deze algemene voorwaarden nietig of vernietigbaar is, blijven de overige bepalingen volledig van kracht.</p>
              <p>4. Voor consumenten is het ook mogelijk om een klacht in te dienen via het ODR-platform van de Europese Commissie: https://ec.europa.eu/consumers/odr.</p>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="bg-gray-50 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {locale === 'nl' ? 'Contact' : 'Contact'}
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>LabFix</strong></p>
              <p className="italic text-gray-500">Adres: [TE VERVULLEN]</p>
              <p>KVK: [TE VERVULLEN]</p>
              <p>BTW: [TE VERVULLEN]</p>
              <p>Email: <span className="text-gray-400">[TE VERVULLEN]</span></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
