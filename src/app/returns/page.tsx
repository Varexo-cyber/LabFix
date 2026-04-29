import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retourneren | LabFix',
  description: 'Retourbeleid en procedure voor LabFix producten',
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Retourneren</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Retourbeleid</h2>
            <p className="text-gray-600">
              Je hebt 14 dagen bedenktijd na ontvangst van je bestelling. 
              Binnen deze periode kun je het product retourneren zonder opgave van reden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Hoe retourneren?</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>Neem contact op via het contactformulier of WhatsApp</li>
              <li>Vermeld je ordernummer en reden van retour</li>
              <li>Verpak het product goed in de originele verpakking</li>
              <li>Stuur het product op naar ons adres</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Terugbetaling</h2>
            <p className="text-gray-600">
              Na ontvangst en controle van het retourproduct, wordt het aankoopbedrag 
              binnen 5 werkdagen teruggestort op je rekening.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
