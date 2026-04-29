import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen | LabFix',
  description: 'Antwoorden op de meest gestelde vragen over LabFix',
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Veelgestelde Vragen</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Hoe lang duurt een reparatie?</h2>
            <p className="text-gray-600">
              De meeste reparaties worden binnen 30-60 minuten uitgevoerd. 
              Voor complexere reparaties kan dit tot 24 uur duren.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Heb ik een afspraak nodig?</h2>
            <p className="text-gray-600">
              Nee, je kunt gewoon binnenlopen tijdens onze openingstijden. 
              Voor drukke periodes raden we wel aan om van tevoren een afspraak te maken.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Wat kost een schermreparatie?</h2>
            <p className="text-gray-600">
              De prijs is afhankelijk van het merk en model. 
              Bekijk onze reparatie pagina voor actuele prijzen of neem contact op.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Is mijn data veilig tijdens reparatie?</h2>
            <p className="text-gray-600">
              Ja, we behandelen je toestel en data met de grootste zorg. 
              We raden wel aan om altijd een backup te maken voor de zekerheid.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
