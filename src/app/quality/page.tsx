import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kwaliteitsstandaarden | LabFix',
  description: 'Onze kwaliteitsstandaarden voor telefoon reparatie en onderdelen',
};

export default function QualityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kwaliteitsstandaarden</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Originele en A-kwaliteit onderdelen</h2>
            <p className="text-gray-600">
              Bij LabFix gebruiken we alleen originele of hoogwaardige A-kwaliteit vervangingsonderdelen. 
              We testen elk onderdeel grondig voordat het in jouw toestel wordt gemonteerd.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Garantie</h2>
            <p className="text-gray-600">
              Alle reparaties komen met een standaard garantie van 3 maanden. 
              Sommige onderdelen, zoals batterijen, hebben zelfs een garantie tot 6 maanden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gecertificeerde technici</h2>
            <p className="text-gray-600">
              Onze technici zijn opgeleid en gecertificeerd om de hoogste kwaliteit reparaties uit te voeren 
              op alle gangbare smartphone merken en modellen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
