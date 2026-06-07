import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Garantievoorwaarden | LabFix',
  description: 'Garantievoorwaarden voor producten en reparaties bij LabFix.',
};

export default function GarantiePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Garantievoorwaarden – LabFix</h1>
          <p className="text-gray-500 text-sm">Laatst bijgewerkt: 20 mei 2026</p>
          <p className="text-gray-600 mt-4">
            Bij LabFix staan we volledig achter de kwaliteit van onze producten en diensten.
            Ons doel is om elke klant 100% tevreden te stellen. Daarom hanteren we eerlijke en transparante garantievoorwaarden.
          </p>
          <p className="text-gray-600 mt-2 font-medium">
            Hieronder lees je precies wat je van ons kunt verwachten.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-10">

          {/* Duur van de garantie */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-primary-500 rounded-full"></span>
              Duur van de garantie
            </h2>
            <div className="grid gap-4">
              <div className="flex items-start gap-4 bg-primary-50 border border-primary-100 rounded-xl p-4">
                <div className="bg-primary-500 text-white text-sm font-bold rounded-lg px-3 py-1 flex-shrink-0">3 mnd</div>
                <p className="text-gray-800 font-medium">Op alle <strong>reparaties</strong>. Na 3 maanden vervalt de garantie.</p>
              </div>
            </div>
          </section>

          {/* Wat valt onder de garantie */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-green-500 rounded-full"></span>
              Wat valt er onder de garantie?
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-800">
                  <span className="text-green-500 font-bold text-lg leading-tight flex-shrink-0">✓</span>
                  <span>Producten met <strong>fabrieksfouten of fabricagegebreken</strong>.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-800">
                  <span className="text-green-500 font-bold text-lg leading-tight flex-shrink-0">✓</span>
                  <span>Artikelen die <strong>beschadigd bij je aankomen</strong>.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-800">
                  <span className="text-green-500 font-bold text-lg leading-tight flex-shrink-0">✓</span>
                  <span>Producten die binnen de garantietermijn <strong>niet goed functioneren bij normaal gebruik</strong>.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Wat valt NIET onder de garantie */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-red-500 rounded-full"></span>
              Wat valt niet onder de garantie?
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-800">
                  <span className="text-red-500 font-bold text-lg leading-tight flex-shrink-0">✗</span>
                  <span>Schade door <strong>verkeerde installatie of onjuist gebruik</strong>.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-800">
                  <span className="text-red-500 font-bold text-lg leading-tight flex-shrink-0">✗</span>
                  <span><strong>Normale slijtage</strong> als gevolg van dagelijks gebruik.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-800">
                  <span className="text-red-500 font-bold text-lg leading-tight flex-shrink-0">✗</span>
                  <span>Schade veroorzaakt door <strong>vallen, vocht, water of andere externe invloeden</strong>.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-800">
                  <span className="text-red-500 font-bold text-lg leading-tight flex-shrink-0">✗</span>
                  <span>Producten die <strong>geopend, gerepareerd of aangepast zijn door derden</strong>.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Hoe garantie gebruiken */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-primary-500 rounded-full"></span>
              Hoe maak je gebruik van de garantie?
            </h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex gap-4">
                <span className="bg-primary-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                <div>
                  <p>Neem contact op met onze klantenservice via <a href="mailto:info@labfix.nl" className="text-primary-600 hover:underline font-medium">info@labfix.nl</a>.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                <p>Geef je <strong>ordernummer</strong> door en beschrijf het probleem zo duidelijk mogelijk.</p>
              </li>
              <li className="flex gap-4">
                <span className="bg-primary-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                <p>Na goedkeuring kun je het product naar ons retouradres sturen.</p>
              </li>
            </ol>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 text-sm">
                <strong>Let op:</strong> de verzendkosten voor retourzendingen zijn voor eigen rekening.
              </p>
            </div>
            <p className="text-gray-700 mt-4">
              Wij beoordelen het product zorgvuldig en bieden indien mogelijk een <strong>vervangend product, reparatie</strong> of — in uitzonderlijke gevallen — een <strong>terugbetaling</strong>.
            </p>
          </section>

          {/* Overige voorwaarden */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-6 bg-gray-400 rounded-full"></span>
              Overige voorwaarden
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 text-gray-700">
              <p className="flex items-start gap-3">
                <span className="text-primary-500 font-bold flex-shrink-0">•</span>
                De garantie geldt uitsluitend voor de <strong>oorspronkelijke koper</strong> en is niet overdraagbaar.
              </p>
              <p className="flex items-start gap-3">
                <span className="text-primary-500 font-bold flex-shrink-0">•</span>
                Bewaar altijd je <strong>originele factuur of aankoopbewijs</strong>. Dit is je garantiebewijs.
              </p>
              <p className="flex items-start gap-3 mt-2">
                <span className="text-primary-500 font-bold flex-shrink-0">•</span>
                <span>
                  Voor meer informatie lees{' '}
                  <Link href="/algemene-voorwaarden#artikel-11" className="text-primary-600 hover:underline font-medium">
                    Artikel 11
                  </Link>{' '}
                  en{' '}
                  <Link href="/algemene-voorwaarden#artikel-14" className="text-primary-600 hover:underline font-medium">
                    Artikel 14
                  </Link>{' '}
                  in onze Algemene Voorwaarden.
                </span>
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-primary-500 rounded-xl p-6 text-white text-center">
            <h2 className="text-xl font-bold mb-2">Vragen over uw garantie?</h2>
            <p className="text-primary-100 mb-4">
              Voor vragen staan wij altijd voor je klaar. Wij helpen je graag — neem gerust contact met ons op.
            </p>
            <a
              href="mailto:info@labfix.nl"
              className="inline-block bg-white text-primary-600 font-bold px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              info@labfix.nl
            </a>
          </section>

        </div>
      </div>
    </div>
  );
}
