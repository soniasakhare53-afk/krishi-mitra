import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

export function ContactPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !message.trim()) return;

    setSubmitted(true);
    showToast(
      t('contact.success', 'Thank you! Your message has been received. Our agricultural support team will contact you shortly.'),
      '',
      'success'
    );
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span>{t('nav.contactUs', 'Contact Us')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            {t('contact.title', 'Contact KrishiMitra Support')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            {t(
              'contact.subtitle',
              "Have a question or need help with a booking? We're here to help Indian farmers 7 days a week."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs space-y-6">
              <h2 className="text-lg font-black text-stone-900">
                {t('footer.support', 'Support & Info')}
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{t('contact.tollFree', 'Toll-Free Helpline')}</div>
                    <div className="text-emerald-800 font-extrabold text-base">+91 1800-419-FARM</div>
                    <div className="text-xs text-stone-500 mt-0.5">Available 6:00 AM – 9:00 PM IST</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{t('contact.email', 'Email Address')}</div>
                    <div className="text-stone-800 font-semibold">support@krishimitra.in</div>
                    <div className="text-xs text-stone-500 mt-0.5">Response within 2 hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900">{t('contact.office', 'Nagpur Innovation Hub')}</div>
                    <div className="text-stone-600 text-xs leading-relaxed">
                      Agri-Tech Demonstration Park, Hingna Road, Nagpur, Maharashtra 440016
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{t('about.trustSafety', 'Trust & Safety Guarantee')}</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Every listed machinery is verified by ground teams. Zero payment deductions until service is confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white p-7 sm:p-9 rounded-3xl border border-stone-200 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-stone-900">
                    {t('contact.success', 'Thank you! Your message has been received.')}
                  </h3>
                  <p className="text-stone-600 text-sm max-w-md mx-auto">
                    Our agricultural support team will review your enquiry and respond to your phone or email shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t('contact.fullName', 'Full Name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Patil"
                        className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t('contact.phone', 'Phone Number')} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. +91 98230 12345"
                        className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* Email & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t('contact.email', 'Email Address')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. ramesh@gmail.com"
                        className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                        {t('contact.subject', 'Subject')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="e.g. Booking assistance / Equipment inquiry"
                        className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t('contact.message', 'Your Message')} *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Describe your machinery requirement, farm location, or question..."
                      className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('contact.sendMessage', 'Send Message')}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
