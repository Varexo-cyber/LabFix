import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Retourbeleid | LabFix',
  description: 'Retourbeleid en procedure voor LabFix producten en onderdelen.',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Retourbeleid – LabFix</h1>
          <p className="text-gray-500 text-sm">Laatst bijgewerkt: 20 mei 2026</p>
          <p className="text-gray-600 mt-4">
            Bij LabFix vinden we het belangrijk dat je tevreden bent met je aankoop.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">

          {/* Herroepingsrecht */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Herroepingsrecht (bedenktijd)</h2>
            <p className="text-gray-700">
              Je hebt het recht om je bestelling tot <strong>14 dagen na ontvangst</strong> zonder opgave van reden te annuleren.
            </p>
            <p className="text-gray-700 mt-2">
              Wij adviseren om het product – indien redelijkerwijs mogelijk – in originele staat, verpakking en met alle toebehoren te retourneren.
              Voor meer informatie, lees onze{' '}
              <Link href="/algemene-voorwaarden" className="text-primary-600 hover:underline font-medium">
                Algemene Voorwaarden
              </Link>.
            </p>
          </section>

          {/* Specifiek voor onderdelen */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Specifiek voor onderdelen</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <p className="text-yellow-800 text-sm font-medium">
                Let op: test het onderdeel altijd vóór installatie.
              </p>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>Om een correcte beoordeling en eventuele retour mogelijk te houden, vragen wij je om het product eerst zorgvuldig te testen <strong>vóór installatie</strong>:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Verwijder geen beschermfolie, stickers of zegels voordat je hebt gecontroleerd of het product volledig naar behoren werkt.</li>
                <li>Gebruik geen lijm, tape of andere bevestigingsmaterialen voordat de werking is gecontroleerd.</li>
              </ul>
              <p className="text-gray-500 text-sm">
                Indien deze handelingen toch worden uitgevoerd en het product niet meer in originele staat kan worden beoordeeld, kan dit leiden tot waardevermindering.
              </p>
            </div>
          </section>

          {/* Hoe retourneren */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Hoe retourneren?</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="bg-primary-100 text-primary-700 font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                <span>Meld je retour binnen <strong>14 dagen</strong> aan via <a href="mailto:info@labfix.nl" className="text-primary-600 hover:underline">info@labfix.nl</a>. Vermeld hierbij altijd je ordernummer.</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary-100 text-primary-700 font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                <span>Verpak het product stevig (bij voorkeur in de originele verpakking indien redelijkerwijs mogelijk).</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary-100 text-primary-700 font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                <span>Je ontvangt van ons per e-mail een <strong>retourlabel</strong>. Print het label en bevestig het op je pakket. Vervolgens kun je het pakket afgeven bij een servicepunt van PostNL, DHL of een andere vervoerder (afhankelijk van het label).</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-primary-100 text-primary-700 font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 text-sm">4</span>
                <span>Bewaar je verzendbewijs totdat je terugbetaling volledig is afgerond.</span>
              </li>
            </ol>
          </section>

          {/* Terugbetaling */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Terugbetaling</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
              <li>Wij betalen het verschuldigde bedrag zo spoedig mogelijk terug, maar <strong>uiterlijk binnen 14 dagen</strong> na je herroeping.</li>
              <li>Wij mogen wachten met terugbetalen totdat wij het product hebben ontvangen, of totdat je hebt aangetoond dat het product is teruggestuurd.</li>
              <li>De terugbetaling gebeurt via dezelfde betaalmethode als waarmee je hebt betaald, tenzij anders overeengekomen.</li>
            </ul>
          </section>

          {/* Defect of verkeerd geleverd */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Defecte of verkeerd geleverde producten</h2>
            <p className="text-gray-700">
              Indien een product defect is of niet overeenkomt met je bestelling, neem dan zo snel mogelijk contact met ons op via{' '}
              <a href="mailto:info@labfix.nl" className="text-primary-600 hover:underline">info@labfix.nl</a>.
            </p>
            <p className="text-gray-700 mt-2">
              In dat geval zorgen wij kosteloos voor een passende oplossing, zoals vervanging, reparatie of terugbetaling, conform de wettelijke garantie.
            </p>
            <p className="text-gray-700 mt-2">
              Voor meer informatie lees onze{' '}
              <Link href="/algemene-voorwaarden" className="text-primary-600 hover:underline font-medium">
                Algemene Voorwaarden
              </Link>.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 rounded-lg p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Vragen?</h2>
            <p className="text-gray-700 text-sm">
              Voor vragen kun je contact opnemen via{' '}
              <a href="mailto:info@labfix.nl" className="text-primary-600 hover:underline font-medium">info@labfix.nl</a>.
              Vermeld hierbij altijd je <strong>ordernummer</strong>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
