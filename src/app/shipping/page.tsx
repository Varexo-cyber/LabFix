import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verzending | LabFix',
  description: 'Verzendinformatie en leveringsopties bij LabFix',
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Verzending</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Verzendopties</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600">PostNL</span>
                <span className="text-gray-600">Standaard verzending binnen Nederland (1-2 werkdagen)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600">DHL</span>
                <span className="text-gray-600">Express verzending mogelijk (volgende dag)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Verzendkosten</h2>
            <p className="text-gray-600">
              Bestellingen boven €50 worden gratis verzonden binnen Nederland. 
              Voor bestellingen onder €50 zijn de verzendkosten €4,95.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Levertijd</h2>
            <p className="text-gray-600">
              Bestellingen geplaatst voor 16:00 worden dezelfde dag verwerkt. 
              De gemiddelde levertijd is 1-2 werkdagen binnen Nederland.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
