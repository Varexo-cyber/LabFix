'use client';

import React, { useState } from 'react';
import { createRepairAppointment } from '@/lib/store';
import { Wrench, Calendar, Clock, Phone, Mail, MapPin, Package, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function RepairPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupValid, setPickupValid] = useState(false);
  
  // Gratis ophalen alleen beschikbaar voor deze locaties
  const allowedPickupLocations = [
    'den haag', 'delft', 'rijswijk', 'zoetermeer', 'nootdorp', 
    'pijnacker', 'leidschendam', 'wateringen', 'monster', 'poeldijk',
    'naaldwijk', 'honselersdijk', "'s-gravenzande", 's-gravenzande',
    'denhaag', 'rijswijkzh', 'pijnackernootdorp'
  ];
  
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    deviceType: string;
    deviceModel: string;
    problemDescription: string;
    serviceType: 'pickup' | 'shipping';
    shippingAddress: string;
  }>({
    name: '',
    email: '',
    phone: '',
    deviceType: '',
    deviceModel: '',
    problemDescription: '',
    serviceType: 'shipping',
    shippingAddress: '',
  });

  const checkPickupLocation = (location: string) => {
    const normalized = location.toLowerCase().trim();
    const isValid = allowedPickupLocations.some(loc => normalized.includes(loc));
    setPickupValid(isValid);
    return isValid;
  };

  // Generate available dates for pickup (only Fri, Sat, Sun, Mon from 11:00-18:00)
  // Day: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const day = date.getDay();
      // Only allow Friday(5), Saturday(6), Sunday(0), Monday(1)
      if (day === 0 || day === 1 || day === 5 || day === 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
        });
      }
    }
    return dates;
  };

  const availableDates = generateDates();
  const availableTimes = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    setAttachments(prev => [...prev, ...newFiles]);
    
    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('device_type', formData.deviceType);
      formDataToSend.append('device_model', formData.deviceModel);
      formDataToSend.append('problem_description', formData.problemDescription);
      formDataToSend.append('appointment_date', selectedDate);
      formDataToSend.append('appointment_time', selectedTime);
      formDataToSend.append('service_type', formData.serviceType);
      formDataToSend.append('shipping_address', formData.shippingAddress);
      
      // Add attachments
      attachments.forEach(file => {
        formDataToSend.append('attachments', file);
      });

      const result = await createRepairAppointment(formDataToSend);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || result.error || 'Er is iets misgegaan');
      }
    } catch (err: any) {
      setError('Er is iets misgegaan bij het maken van de afspraak. Probeer het later opnieuw.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deviceTypes = [
    { value: 'iphone', label: 'iPhone' },
    { value: 'ipad', label: 'iPad' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'google', label: 'Google Pixel' },
    { value: 'huawei', label: 'Huawei' },
    { value: 'xiaomi', label: 'Xiaomi' },
    { value: 'oneplus', label: 'OnePlus' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'other', label: 'Anders' },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Afspraak Verzonden!</h1>
            <p className="text-gray-600 mb-6">
              Bedankt voor uw aanvraag. We hebben een bevestiging gestuurd naar <strong>{formData.email}</strong>.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              U ontvangt binnen 24 uur een reactie of uw afspraak is goedgekeurd.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-700 mb-4">Afspraak Details:</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Datum:</span> {new Date(selectedDate).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <p><span className="text-gray-500">Tijd:</span> {selectedTime}</p>
                <p><span className="text-gray-500">Apparaat:</span> {deviceTypes.find(d => d.value === formData.deviceType)?.label} {formData.deviceModel}</p>
                <p><span className="text-gray-500">Service:</span> {formData.serviceType === 'pickup' ? 'Ophalen' : 'Opsturen'}</p>
              </div>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              <ChevronLeft size={20} />
              Terug naar home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Wrench size={32} className="text-primary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Reparatie Afspraak</h1>
          <p className="text-gray-600">Plan eenvoudig uw reparatie bij LabFix</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className="w-12 h-0.5 mx-2 bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Step 1: Personal Info & Device */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Stap 1: Uw Gegevens & Apparaat</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Naam *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                  placeholder="Uw volledige naam"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                  placeholder="uw@email.nl"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Telefoonnummer *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                placeholder="+31 6 1234 5678"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Apparaat Type *</label>
                <select
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                >
                  <option value="">Selecteer type</option>
                  {deviceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
                <input
                  type="text"
                  name="deviceModel"
                  value={formData.deviceModel}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                  placeholder="bijv. iPhone 14 Pro"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Probleem Beschrijving *</label>
              <textarea
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                placeholder="Beschrijf het probleem met uw apparaat..."
              />
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Foto's van het probleem (optioneel)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Klik om foto's te uploaden
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    JPG, PNG, GIF (max. 5MB per bestand)
                  </span>
                </label>
              </div>
              
              {/* Preview uploaded files */}
              {attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={previewUrls[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-500 truncate mt-1">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (!formData.name || !formData.email || !formData.phone || !formData.deviceType || !formData.deviceModel || !formData.problemDescription) {
                  setError('Vul alle verplichte velden in');
                  return;
                }
                setError('');
                setStep(2);
              }}
              className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              Volgende Stap
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Step 2: Service Type & Location */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Stap 2: Service Type</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setFormData({ ...formData, serviceType: 'pickup' })}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  formData.serviceType === 'pickup' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <MapPin size={32} className="text-primary-500 mb-3" />
                <h3 className="font-bold text-lg mb-2">Ophalen (Gratis)</h3>
                <p className="text-gray-600 text-sm">Wij komen uw apparaat ophalen bij u thuis (vrijdag, zat, zon, maandag). Volgende dag brengen we het weer terug. Complexe reparaties worden in onze werkplaats uitgevoerd.</p>
              </button>
              
              <button
                onClick={() => setFormData({ ...formData, serviceType: 'shipping' })}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  formData.serviceType === 'shipping' 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <Package size={32} className="text-primary-500 mb-3" />
                <h3 className="font-bold text-lg mb-2">Opsturen</h3>
                <p className="text-gray-600 text-sm">Stuur uw apparaat op naar ons. Na goedkeuring van uw aanvraag ontvangt u het verzendadres via email. We repareren en sturen het gratis retour.</p>
              </button>
            </div>

            {formData.serviceType === 'pickup' && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Postcode / Plaats *</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => {
                    setPickupLocation(e.target.value);
                    checkPickupLocation(e.target.value);
                  }}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                  placeholder="Bijv. 2288 AA of Den Haag"
                />
                {pickupLocation && !pickupValid && (
                  <p className="text-red-500 text-sm mt-2">
                    Ophalen is helaas niet beschikbaar in deze regio. Kies "Opsturen" of neem contact op.
                  </p>
                )}
                {pickupValid && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle size={16} />
                    Gratis ophalen beschikbaar in deze regio!
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  Gratis ophalen beschikbaar in: Den Haag, Delft, Rijswijk, Zoetermeer, Nootdorp, Pijnacker, Leidschendam, Wateringen, Monster, Poeldijk, Naaldwijk, Honselersdijk, 's-Gravenzande
                </p>
              </div>
            )}

            {formData.serviceType === 'shipping' && (
              <div className="mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Belangrijk:</strong> Na goedkeuring van uw aanvraag ontvangt u het exacte verzendadres en verpakkingsinstructies via email.
                  </p>
                </div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Uw Adres *</label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                  placeholder="Straat, huisnummer, postcode, stad"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} />
                Terug
              </button>
              <button
                onClick={() => {
                  if (formData.serviceType === 'shipping' && !formData.shippingAddress) {
                    setError('Vul uw adres in');
                    return;
                  }
                  if (formData.serviceType === 'pickup' && !pickupValid) {
                    setError('Vul een geldige postcode/plaats in voor gratis ophalen');
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
                className="flex-[2] bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                {formData.serviceType === 'pickup' ? 'Volgende: Datum & Tijd' : 'Volgende: Verzend Informatie'}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date & Time for Pickup / Shipping Info for Shipping */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {formData.serviceType === 'pickup' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Stap 3: Kies Ophalen Datum & Tijd</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Let op:</strong> Wij komen uw apparaat ophalen bij u thuis. Volgende dag brengen we het gerepareerd weer terug. Alleen beschikbaar op vrijdag, zaterdag, zondag en maandag.
                  </p>
                </div>
                
                {/* Date Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-primary-500" />
                    Kies een datum
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {availableDates.slice(0, 12).map((date) => (
                      <button
                        key={date.value}
                        onClick={() => setSelectedDate(date.value)}
                        className={`p-3 rounded-lg text-center transition-all ${
                          selectedDate === date.value
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="text-xs uppercase">{date.label.split(' ')[0]}</div>
                        <div className="font-bold">{date.label.split(' ')[1]}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Clock size={20} className="text-primary-500" />
                      Kies een tijdstip
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg text-center font-medium transition-all ${
                            selectedTime === time
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-gray-800 mb-4">Samenvatting</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Naam:</span> {formData.name}</p>
                      <p><span className="text-gray-500">Apparaat:</span> {deviceTypes.find(d => d.value === formData.deviceType)?.label} {formData.deviceModel}</p>
                      <p><span className="text-gray-500">Datum:</span> {new Date(selectedDate).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                      <p><span className="text-gray-500">Tijd:</span> {selectedTime}</p>
                      <p><span className="text-gray-500">Service:</span> Ophalen (Gratis)</p>
                      <p><span className="text-gray-500">Locatie:</span> {pickupLocation}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} />
                    Terug
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedDate || !selectedTime) {
                        setError('Selecteer een datum en tijd');
                        return;
                      }
                      handleSubmit();
                    }}
                    disabled={loading || !selectedDate || !selectedTime}
                    className="flex-[2] bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? 'Verzenden...' : 'Afspraak Bevestigen'}
                    <CheckCircle size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Stap 3: Verzend Informatie</h2>
                
                {/* LabFix Address */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <MapPin size={20} />
                    Verzend uw apparaat naar:
                  </h3>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <p className="font-semibold text-gray-800">LabFix Repair Center</p>
                    <p className="text-gray-600">Kerketuinenweg 163</p>
                    <p className="text-gray-600">2288 AA Rijswijk ZH</p>
                    <p className="text-gray-600">Nederland</p>
                  </div>
                  <p className="text-blue-700 text-sm mb-2">
                    <Phone size={14} className="inline mr-1" />
                    +31 6 5113 1133
                  </p>
                  <p className="text-blue-700 text-sm">
                    <Mail size={14} className="inline mr-1" />
                    info@labfix.nl
                  </p>
                </div>

                {/* Shipping Instructions */}
                <div className="bg-amber-50 rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <Package size={20} />
                    Verpakkingsadvies
                  </h3>
                  <ul className="text-amber-700 text-sm space-y-2">
                    <li>• Gebruik een stevige doos met voldoende bescherming (bubble wrap, noppenfolie)</li>
                    <li>• Zorg dat het apparaat niet kan bewegen tijdens transport</li>
                    <li>• Vermeld duidelijk uw naam en ordernummer (na bevestiging) op de doos</li>
                    <li>• Stuur de lader mee zodat we het apparaat kunnen testen</li>
                    <li>• Geen originele doos? Gebruik kranten of foam ter bescherming</li>
                  </ul>
                </div>

                {/* Important Note */}
                <div className="bg-green-50 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Belangrijk
                  </h3>
                  <p className="text-green-700 text-sm">
                    U hoeft <strong>geen afspraak</strong> te maken voor opsturen. Stuur het apparaat op naar bovenstaand adres, 
                    wij repareren het en sturen het gratis retour naar: <strong>{formData.shippingAddress}</strong>
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="font-bold text-gray-800 mb-4">Samenvatting</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500">Naam:</span> {formData.name}</p>
                    <p><span className="text-gray-500">Apparaat:</span> {deviceTypes.find(d => d.value === formData.deviceType)?.label} {formData.deviceModel}</p>
                    <p><span className="text-gray-500">Service:</span> Opsturen</p>
                    <p><span className="text-gray-500">Retouradres:</span> {formData.shippingAddress}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} />
                    Terug
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? 'Verzenden...' : 'Aanvraag Versturen'}
                    <CheckCircle size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl p-6 shadow">
            <Clock className="text-primary-500 mb-3" size={24} />
            <h3 className="font-semibold mb-1">Snelle Service</h3>
            <p className="text-sm text-gray-600">Meestal binnen 1 werkdag gerepareerd</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <Wrench className="text-primary-500 mb-3" size={24} />
            <h3 className="font-semibold mb-1">Professioneel</h3>
            <p className="text-sm text-gray-600">Gecertificeerde reparatie experts</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <CheckCircle className="text-primary-500 mb-3" size={24} />
            <h3 className="font-semibold mb-1">Garantie</h3>
            <p className="text-sm text-gray-600">3 maanden garantie op alle reparaties</p>
          </div>
        </div>
      </div>
    </div>
  );
}
