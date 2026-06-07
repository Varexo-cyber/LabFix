'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ChevronLeft, FileText, Shield, RotateCcw, CreditCard, Truck, AlertCircle, Scale } from 'lucide-react';

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
              <h1 className="text-3xl font-bold text-gray-900">Algemene Voorwaarden – LabFix</h1>
              <p className="text-gray-500 mt-1">Laatst bijgewerkt: 20 mei 2026</p>
            </div>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>Belangrijk:</strong> Door gebruik te maken van onze website en diensten gaat u akkoord met deze algemene voorwaarden. Lees ze zorgvuldig door.
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
                <li><strong>Ondernemer / LabFix:</strong> LabFix, de natuurlijke of rechtspersoon die producten en/of reparatiediensten aanbiedt aan consumenten.</li>
                <li><strong>Consument:</strong> de natuurlijke persoon die niet handelt in de uitoefening van beroep of bedrijf en een overeenkomst op afstand aangaat met LabFix.</li>
                <li><strong>Overeenkomst op afstand:</strong> een overeenkomst die tot stand komt via een door LabFix georganiseerd systeem voor verkoop op afstand, waarbij tot en met het sluiten van de overeenkomst uitsluitend gebruik wordt gemaakt van technieken voor communicatie op afstand.</li>
                <li><strong>Herroepingsrecht:</strong> het recht van de consument om binnen de bedenktijd zonder opgave van redenen af te zien van de overeenkomst.</li>
                <li><strong>Bedenktijd:</strong> de wettelijke termijn van 14 dagen waarbinnen de consument gebruik kan maken van het herroepingsrecht.</li>
                <li><strong>Duurzame gegevensdrager:</strong> elk middel dat de consument of LabFix in staat stelt om informatie die aan hem persoonlijk is gericht, op te slaan op een manier die toekomstige raadpleging en ongewijzigde reproductie mogelijk maakt.</li>
              </ul>
            </div>
          </section>

          {/* Artikel 2 */}
          <section id="artikel-2">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 2</span>
              Identiteit van de ondernemer
            </h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>LabFix</strong></p>
              <p><span className="font-semibold">Telefoon klantenservice:</span> <a href="tel:+31651131133" className="text-primary-600 hover:underline">+31 651131133</a></p>
              <p><span className="font-semibold">Telefoon zakelijk contact:</span> <a href="tel:0657646467" className="text-primary-600 hover:underline">0657646467</a></p>
              <p><span className="font-semibold">E-mail:</span> <a href="mailto:info@labfix.nl" className="text-primary-600 hover:underline">info@labfix.nl</a></p>
              <p><span className="font-semibold">KvK-nummer:</span> 42035906</p>
              <p><span className="font-semibold">BTW-nummer:</span> NL005445900B06</p>
            </div>
          </section>

          {/* Artikel 3 */}
          <section id="artikel-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 3</span>
              Toepasselijkheid
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Deze algemene voorwaarden zijn van toepassing op elk aanbod van LabFix en op elke tot stand gekomen overeenkomst op afstand tussen LabFix en de consument.</p>
              <p>Voorafgaand aan het sluiten van de overeenkomst worden deze algemene voorwaarden aan de consument beschikbaar gesteld. Indien redelijkerwijs niet mogelijk, zal LabFix aangeven waar de voorwaarden kunnen worden ingezien en op verzoek kosteloos worden toegezonden.</p>
              <p>Bij elektronische overeenkomsten kunnen de voorwaarden digitaal worden verstrekt op een wijze die opslag op een duurzame gegevensdrager mogelijk maakt.</p>
              <p>Indien naast deze algemene voorwaarden specifieke product- of dienstvoorwaarden gelden, kan de consument bij tegenstrijdigheden altijd een beroep doen op de voor hem meest gunstige bepaling.</p>
            </div>
          </section>

          {/* Artikel 4 */}
          <section id="artikel-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 4</span>
              Het aanbod
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Het aanbod bevat een volledige en nauwkeurige omschrijving van de producten en/of diensten. Afbeeldingen zijn een waarheidsgetrouwe weergave. Kennelijke vergissingen of fouten in het aanbod binden LabFix niet. Elk aanbod vermeldt duidelijk de rechten en verplichtingen van de consument bij aanvaarding, waaronder prijs (incl. BTW voor consumenten), eventuele verzendkosten, de wijze van betaling en aflevering, en het al dan niet van toepassing zijn van het herroepingsrecht.</p>
            </div>
          </section>

          {/* Artikel 5 */}
          <section id="artikel-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 5</span>
              De overeenkomst
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>De overeenkomst komt tot stand op het moment dat de consument het aanbod aanvaardt en voldoet aan de gestelde voorwaarden.</p>
              <p>Om reparatiediensten af te nemen, dient de consument meerderjarig te zijn (18 jaar of ouder).</p>
              <p>Bij elektronische aanvaarding bevestigt LabFix direct de ontvangst van de aanvaarding. Zolang deze bevestiging niet is ontvangen, kan de consument de overeenkomst ontbinden.</p>
              <p>LabFix treft passende technische en organisatorische maatregelen ter beveiliging van elektronische gegevensoverdracht en betalingen.</p>
              <p>LabFix behoudt zich het recht voor een bestelling of aanvraag te weigeren of aan bijzondere voorwaarden te verbinden, indien er gegronde redenen zijn (bijv. kredietwaardigheid).</p>
              <p>LabFix verstrekt de consument de nodige informatie, waaronder de voorwaarden van het herroepingsrecht, garantie-informatie en contactgegevens.</p>
            </div>
          </section>

          {/* Artikel 6 */}
          <section id="artikel-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <RotateCcw className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 6</span>
              Herroepingsrecht bij producten (accessoires en onderdelen)
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>De consument heeft bij de aankoop van producten en accessoires een bedenktijd van 14 dagen, ingaande de dag na ontvangst. Tijdens deze periode mag het product slechts in die mate worden uitgepakt of gebruikt voor zover nodig om de aard, kenmerken en werking te beoordelen. Bij uitoefening van het herroepingsrecht dient het product in originele staat, met alle toebehoren en in de originele verpakking te worden geretourneerd volgens de instructies van LabFix. Voor zakelijke klanten geldt het herroepingsrecht niet.</p>
            </div>
          </section>

          {/* Artikel 7 */}
          <section id="artikel-7">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <RotateCcw className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 7</span>
              Herroepingsrecht bij diensten (reparaties)
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Bij reparatiediensten bedraagt de bedenktijd 14 dagen, ingaande op de dag van het aangaan van de overeenkomst. Zodra met de reparatie is begonnen met uitdrukkelijke instemming van de consument, vervalt het herroepingsrecht voor het reeds uitgevoerde gedeelte. Voor zakelijke klanten geldt het herroepingsrecht niet.</p>
            </div>
          </section>

          {/* Artikel 8 */}
          <section id="artikel-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 8</span>
              Kosten bij herroeping
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Indien de consument gebruikmaakt van het herroepingsrecht, komen de directe kosten van retourzending voor zijn rekening. Reeds betaalde bedragen worden door LabFix zo spoedig mogelijk, doch uiterlijk binnen 14 dagen na ontvangst van het product terugbetaald.</p>
            </div>
          </section>

          {/* Artikel 9 */}
          <section id="artikel-9">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <AlertCircle className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 9</span>
              Uitsluiting herroepingsrecht
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Het herroepingsrecht is niet van toepassing op producten die op maat zijn gemaakt volgens specificaties van de consument, op producten die snel kunnen bederven, of op audio-/video-opnamen en software waarvan de verzegeling is verbroken. Voor diensten geldt de uitsluiting zodra de uitvoering met instemming van de consument is begonnen.</p>
            </div>
          </section>

          {/* Artikel 10 */}
          <section id="artikel-10">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 10</span>
              Prijs en betaling
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Prijzen voor consumenten zijn inclusief BTW. Prijsverhogingen binnen drie maanden na totstandkoming van de overeenkomst zijn alleen toegestaan indien zij het gevolg zijn van wettelijke wijzigingen. Betaling voor producten dient te geschieden voor of bij levering, tenzij anders overeengekomen. Bij reparaties ontvangt de consument na afronding een betaallink. Zonder tijdige betaling behoudt LabFix zich het recht voor het toestel niet retour te zenden.</p>
            </div>
          </section>

          {/* Artikel 11 */}
          <section id="artikel-11">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Shield className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 11</span>
              Conformiteit, garantie en reparaties
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>LabFix garandeert dat de uitgevoerde reparaties voldoen aan de overeenkomst en aan de redelijke eisen van deugdelijkheid. Voor reparaties biedt LabFix een commerciële garantie van 3 maanden, bovenop uw wettelijke rechten. Na 3 maanden vervalt deze garantie.</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>3 maanden garantie op reparaties</li>
              </ul>
              <p>De garantie vervalt bij onzorgvuldig gebruik, schade door vallen/water, opening door derden, of onjuiste montage. LabFix is niet aansprakelijk voor verlies van data; maak altijd zelf een back-up voor een reparatie.</p>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mt-2">
                <p className="text-red-800 text-sm font-medium">Er is geen garantie op waterschade reparaties en moederbord storingen.</p>
              </div>
            </div>
          </section>

          {/* Artikel 12 */}
          <section id="artikel-12">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Truck className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 12</span>
              Levering en uitvoering
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>LabFix voert geaccepteerde bestellingen met de grootst mogelijke zorg uit, uiterlijk binnen 30 dagen, tenzij een langere termijn is overeengekomen. Bij vertraging of onmogelijkheid van levering wordt de consument hiervan op de hoogte gesteld en heeft hij het recht de overeenkomst kosteloos te ontbinden. Het risico van beschadiging of vermissing ligt bij LabFix tot het moment van bezorging aan de consument.</p>
            </div>
          </section>

          {/* Artikel 13 */}
          <section id="artikel-13">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <AlertCircle className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 13</span>
              Klachtenregeling
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Klachten over de uitvoering van de overeenkomst dienen binnen 14 dagen nadat de gebreken zijn geconstateerd, volledig en duidelijk omschreven te worden ingediend bij LabFix (bij voorkeur per e-mail). LabFix beantwoordt klachten binnen 14 dagen na ontvangst. Indien een klacht langere verwerkingstijd vraagt, wordt de consument hiervan binnen 14 dagen op de hoogte gesteld.</p>
            </div>
          </section>

          {/* Artikel 14 */}
          <section id="artikel-14">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Truck className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 14</span>
              Verzending en aansprakelijkheid
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Bij verzending naar LabFix wordt aangeraden dit aangetekend en goed verpakt te doen. LabFix is niet aansprakelijk voor vermissing of beschadiging tijdens verzending door de klant. Accessoires zoals hoesjes, simkaarten en geheugenkaarten dienen verwijderd te worden. LabFix is niet verantwoordelijk voor verlies van data of persoonlijke accounts.</p>
            </div>
          </section>

          {/* Artikel 15 */}
          <section id="artikel-15">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <AlertCircle className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 15</span>
              Overmacht
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Onder overmacht wordt verstaan alle omstandigheden die redelijkerwijs niet aan LabFix kunnen worden toegerekend en die nakoming van de overeenkomst tijdelijk of blijvend onmogelijk maken.</p>
            </div>
          </section>

          {/* Artikel 16 */}
          <section id="artikel-16">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Scale className="text-primary-500" size={20} />
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded text-sm">Artikel 16</span>
              Geschillen
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>Op alle overeenkomsten en deze algemene voorwaarden is uitsluitend Nederlands recht van toepassing. Geschillen worden bij voorkeur in onderling overleg opgelost. Indien dit niet lukt, kan een geschil worden voorgelegd aan de bevoegde rechter.</p>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="bg-gray-50 rounded-lg p-6 mt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>LabFix</strong></p>
              <p><span className="font-semibold">KvK-nummer:</span> 42035906</p>
              <p><span className="font-semibold">BTW-nummer:</span> NL005445900B06</p>
              <p><span className="font-semibold">Telefoon:</span> <a href="tel:+31651131133" className="text-primary-600 hover:underline">+31 651131133</a></p>
              <p><span className="font-semibold">E-mail:</span> <a href="mailto:info@labfix.nl" className="text-primary-600 hover:underline">info@labfix.nl</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
