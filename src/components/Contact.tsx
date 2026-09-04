import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PESANTREN_INFO, FAQS } from '../data/pesantrenData';

export default function Contact() {
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Pendaftaran PSB',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setFaqOpenIndex(faqOpenIndex === index ? null : index);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Harap isi semua kolom wajib!');
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        category: 'Pendaftaran PSB',
        message: '',
      });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 bg-neutral-50 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-600 font-bold text-sm tracking-widest uppercase">
            Hubungan Masyarakat
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-serif">
            Kontak Layanan & Pendaftaran
          </h2>
          <p className="text-neutral-500 mt-3 text-sm sm:text-base">
            Hubungi panitia pendaftaran, tanyakan layanan pesantren, atau konsultasikan pendaftaran putra-putri Anda.
          </p>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Contact Info & Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-lg p-6 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 font-serif mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-700" /> Formulir Hubungi Kami
              </h3>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4"
                  >
                    <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto" />
                    <h4 className="text-lg font-bold text-emerald-900">Pesan Berhasil Terkirim!</h4>
                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                      Terima kasih telah menghubungi kami. Tim kesekretariatan PP Darul Mushtofa Assunniyyah akan segera menghubungi Anda dalam waktu 1x24 jam.
                    </p>
                    <button
                      id="btn-form-reset"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                    >
                      Kirim Pesan Lain
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-1.5">
                          Nama Lengkap Wali / Calon Santri <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Contoh: Muhammad Fauzi"
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800 text-sm bg-neutral-50/50"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-1.5">
                          No. WhatsApp Aktif <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="form-phone"
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Contoh: 081234567890"
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800 text-sm bg-neutral-50/50"
                        />
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div>
                      <label htmlFor="category" className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-1.5">
                        Kategori Keperluan
                      </label>
                      <select
                        id="form-category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800 text-sm bg-neutral-50/50"
                      >
                        <option value="Pendaftaran PSB">Pertanyaan Pendaftaran (PSB)</option>
                        <option value="Kunjungan & Sowan">Kunjungan & Sowan Kiai</option>
                        <option value="Layanan Administrasi">Administrasi & Ijazah</option>
                        <option value="Kerjasama / Donasi">Kerja Sama & Donasi</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-1.5">
                        Isi Pertanyaan / Pesan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="form-message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tuliskan pertanyaan Anda secara detail di sini..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800 text-sm bg-neutral-50/50 resize-y"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      id="btn-submit-form"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-900 hover:bg-emerald-850 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Mengirim Pesan...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Kirim Pesan Sekarang
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Contact Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-neutral-200/60 p-5 shadow-sm text-center">
                <Phone className="h-6 w-6 text-emerald-700 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase">Kontak Telepon</h4>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium mt-1">
                  {PESANTREN_INFO.phone}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200/60 p-5 shadow-sm text-center">
                <Mail className="h-6 w-6 text-emerald-700 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase">Email Resmi</h4>
                <p className="text-xs sm:text-sm text-neutral-600 font-medium mt-1 truncate">
                  {PESANTREN_INFO.email}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200/60 p-5 shadow-sm text-center">
                <MapPin className="h-6 w-6 text-emerald-700 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase">Sekretariat</h4>
                <p className="text-[10px] sm:text-xs text-neutral-600 font-medium mt-1 leading-snug font-semibold">
                  Yosowilangun, Lumajang
                </p>
              </div>
            </div>
          </div>

          {/* Right: FAQs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200/60 shadow-lg p-6 sm:p-8">
              <h3 className="text-xl font-bold text-neutral-900 font-serif mb-6 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-amber-500" /> Tanya Jawab Umum (FAQ)
              </h3>

              <div className="space-y-4">
                {FAQS.map((faq, index) => {
                  const isOpen = faqOpenIndex === index;
                  return (
                    <div
                      key={index}
                      id={`faq-item-${index}`}
                      className="border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center text-left py-2 font-bold text-xs sm:text-sm text-neutral-800 hover:text-emerald-800 transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-emerald-700 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-neutral-500 flex-shrink-0 ml-2" />
                        )}
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed mt-2 pl-1 whitespace-pre-line bg-neutral-50 p-3 rounded-xl border border-neutral-150">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google Map Representation */}
            <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-lg border border-emerald-900 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-amber-300">Lokasi Pesantren:</h4>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                {PESANTREN_INFO.address}
              </p>
              {/* Custom styled mock map button using simple visual assets */}
              <a
                href={`https://maps.google.com/?q=${PESANTREN_INFO.coordinates.lat},${PESANTREN_INFO.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="block text-center bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border border-emerald-700 hover:border-emerald-500 font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
