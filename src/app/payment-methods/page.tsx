import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Betaalmethoden | LabFix',
  description: 'Bekijk alle beschikbare betaalmethoden bij LabFix',
};

export default function PaymentMethodsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Betaalmethoden</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Beschikbare betaalmethoden</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">€</span>
                <span className="text-gray-700">iDEAL - Veilig betalen via je eigen bank</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">€</span>
                <span className="text-gray-700">Bankoverschrijving - Betaal via een reguliere bankoverschrijving</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">€</span>
                <span className="text-gray-700">Contant bij afhalen - Betaal contant bij afhalen in de winkel</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Veiligheid</h2>
            <p className="text-gray-600">
              Alle betalingen worden veilig verwerkt. Je transactiegegevens worden versleuteld verzonden 
              en we slaan geen betalingsgegevens op onze servers op.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vragen?</h2>
            <p className="text-gray-600">
              Heb je vragen over betalingen? Neem contact met ons op via het{' '}
              <a href="/contact" className="text-blue-600 hover:underline">contactformulier</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
