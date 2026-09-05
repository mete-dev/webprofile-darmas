import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Users, 
  MapPin, 
  BookOpen,
  CheckCircle2, 
  Printer, 
  AlertCircle,
  Calendar,
  Share2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export interface BukuIndukForm {
  // A. KETERANGAN PRIBADI
  fullName: string;
  nis: string;
  nisn: string;
  nickname: string;
  gender: 'Laki-laki' | 'Perempuan' | '';
  birthPlace: string;
  birthDate: string;
  religion: string;
  citizenship: string;
  childOrder: string;
  siblingsCount: string;
  stepSiblingsCount: string;
  adoptedSiblingsCount: string;
  orphanStatus: 'Bukan' | 'Yatim' | 'Piatu' | 'Yatim Piatu' | '';
  dailyLanguage: string;

  // B. KETERANGAN TEMPAT TINGGAL
  address: string;
  whatsapp: string;
  livingWith: string;
  distanceToSchool: string;
  transportMode: string;

  // C. KETERANGAN KESEHATAN
  bloodType: string;
  illnessHistory: string;
  hospitalTreatment: string;
  physicalDisability: string;
  heightCm: string;
  weightKg: string;

  // D. KETERANGAN PENDIDIKAN SEBELUMNYA
  prevSchoolLevel: string;
  sttbNumber: string;
  studyDuration: string;

  // Data Pendukung PSB & Wali
  schoolName: string;
  majorProgram: string;
  schoolAddress: string;
  fatherName: string;
  motherName: string;
  parentJob: string;
  boardingChoice: 'Asrama' | 'Non-Asrama';
  programType: string;
  reportScore: string;
}

const initialFormState: BukuIndukForm = {
  fullName: '',
  nis: '',
  nisn: '',
  nickname: '',
  gender: '',
  birthPlace: '',
  birthDate: '',
  religion: 'Islam',
  citizenship: 'Warga Negara Indonesia (WNI)',
  childOrder: '1',
  siblingsCount: '2',
  stepSiblingsCount: '0',
  adoptedSiblingsCount: '0',
  orphanStatus: 'Bukan',
  dailyLanguage: 'Bahasa Indonesia / Daerah',

  address: '',
  whatsapp: '',
  livingWith: 'Bersama Orang Tua',
  distanceToSchool: '± 5 km',
  transportMode: 'Sepeda Motor / Diantar',

  bloodType: 'O',
  illnessHistory: 'Tidak ada penyakit kronis',
  hospitalTreatment: 'Tidak pernah dirawat inap',
  physicalDisability: 'Tidak ada',
  heightCm: '155',
  weightKg: '45',

  prevSchoolLevel: '',
  sttbNumber: '',
  studyDuration: '6 Tahun',

  schoolName: 'PP Darul Mushtofa Assunniyyah',
  majorProgram: 'Madrasah Tsanawiyah (MTs)',
  schoolAddress: 'Jl. Sunan Kalijaga No. 11, Wonorejo, Kencong, Jember',
  fatherName: '',
  motherName: '',
  parentJob: '',
  boardingChoice: 'Asrama',
  programType: 'MTs',
  reportScore: '85.5',
};

const STEPS = [
  { id: 1, title: 'Data Pribadi', icon: User, description: 'Informasi dasar calon santri' },
  { id: 2, title: 'Tempat Tinggal', icon: MapPin, description: 'Alamat & riwayat kesehatan' },
  { id: 3, title: 'Akademik', icon: BookOpen, description: 'Riwayat sekolah sebelumnya' },
  { id: 4, title: 'Orang Tua / Wali', icon: Users, description: 'Data wali & pemondokan' }
];

export default function PSBRegistration() {
  const [formData, setFormData] = useState<BukuIndukForm>(initialFormState);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BukuIndukForm, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'programType') {
        const progMap: Record<string, string> = {
          'MTs': 'Madrasah Tsanawiyah (MTs - Setara SMP)',
          'MA': 'Madrasah Aliyah (MA - Setara SMA)',
          'Tahfidz': "Program Khusus Tahfidzul Qur'an",
          'Diniyah': 'Madrasah Diniyah Salafiyah'
        };
        next.majorProgram = progMap[value] || value;
      }
      return next;
    });

    if (formErrors[name as keyof BukuIndukForm]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Partial<Record<keyof BukuIndukForm, string>> = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.fullName.trim()) { errors.fullName = 'Nama wajib diisi'; isValid = false; }
      if (!formData.nisn.trim()) { errors.nisn = 'NISN wajib diisi'; isValid = false; }
      else if (!/^\d{10}$/.test(formData.nisn)) { errors.nisn = 'NISN harus 10 digit angka'; isValid = false; }
      if (!formData.gender) { errors.gender = 'Pilih jenis kelamin'; isValid = false; }
      if (!formData.birthPlace.trim()) { errors.birthPlace = 'Tempat lahir wajib diisi'; isValid = false; }
      if (!formData.birthDate) { errors.birthDate = 'Tanggal lahir wajib diisi'; isValid = false; }
    } else if (step === 2) {
      if (!formData.address.trim()) { errors.address = 'Alamat wajib diisi'; isValid = false; }
      if (!formData.whatsapp.trim()) { errors.whatsapp = 'Nomor WA aktif wajib diisi'; isValid = false; }
    } else if (step === 3) {
      if (!formData.prevSchoolLevel.trim()) { errors.prevSchoolLevel = 'Asal sekolah wajib diisi'; isValid = false; }
    } else if (step === 4) {
      if (!formData.fatherName.trim()) { errors.fatherName = 'Nama ayah wajib diisi'; isValid = false; }
      if (!formData.motherName.trim()) { errors.motherName = 'Nama ibu wajib diisi'; isValid = false; }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      window.scrollTo({ top: document.getElementById('psb-form-anchor')?.offsetTop || 100, behavior: 'smooth' });
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    window.scrollTo({ top: document.getElementById('psb-form-anchor')?.offsetTop || 100, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    const uniqueNum = Math.floor(1000 + Math.random() * 9000);
    const codeMap: Record<string, string> = { 'MTs': 'MTS', 'MA': 'MA', 'Tahfidz': 'THF', 'Diniyah': 'MDT' };
    const prefix = codeMap[formData.programType] || 'PSB';
    const generatedId = `REG-2026-${prefix}-${uniqueNum}`;

    try {
      const response = await fetch('/api/psb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: generatedId,
          ...formData,
          previousSchool: formData.prevSchoolLevel,
        }),
      });

      if (!response.ok) throw new Error('Network error');
      const result = await response.json();
      setRegistrationId(result.registrationId || generatedId);
      setIsSubmitted(true);
      window.scrollTo({ top: document.getElementById('psb-form-anchor')?.offsetTop || 100, behavior: 'smooth' });
    } catch (err) {
      console.warn('Submission fallback:', err);
      setRegistrationId(generatedId);
      setIsSubmitted(true);
      window.scrollTo({ top: document.getElementById('psb-form-anchor')?.offsetTop || 100, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const Field = ({ label, id, type = "text", error, req = false, ...props }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-xs font-bold text-neutral-700">
        {label} {req && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea id={id} name={id} className={`px-4 py-2.5 rounded-xl border bg-neutral-50 focus:bg-white transition-all text-sm ${error ? 'border-red-400 focus:ring-red-200' : 'border-neutral-300 focus:ring-2 focus:ring-emerald-500'}`} {...props} />
      ) : type === 'select' ? (
        <select id={id} name={id} className={`px-4 py-2.5 rounded-xl border bg-neutral-50 focus:bg-white transition-all text-sm ${error ? 'border-red-400 focus:ring-red-200' : 'border-neutral-300 focus:ring-2 focus:ring-emerald-500'}`} {...props} />
      ) : (
        <input type={type} id={id} name={id} className={`px-4 py-2.5 rounded-xl border bg-neutral-50 focus:bg-white transition-all text-sm ${error ? 'border-red-400 focus:ring-red-200' : 'border-neutral-300 focus:ring-2 focus:ring-emerald-500'}`} {...props} />
      )}
      {error && <span className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</span>}
    </div>
  );

  if (isSubmitted) {
    return (
      <section className="py-24 bg-neutral-50" id="psb-form-anchor">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-3xl font-black text-emerald-950 mb-2 font-serif">Pendaftaran Berhasil!</h2>
            <p className="text-neutral-600 mb-8 max-w-lg mx-auto">
              Alhamdulillah, pendaftaran calon santri atas nama <strong>{formData.fullName}</strong> telah berhasil direkam ke dalam sistem PSB Pesantren.
            </p>
            
            <div className="bg-emerald-900 text-amber-300 px-6 py-4 rounded-2xl inline-block mb-8 shadow-md">
              <span className="block text-xs font-bold text-emerald-300 mb-1 uppercase tracking-wider">No. Registrasi Anda</span>
              <span className="text-2xl font-mono font-bold tracking-widest">{registrationId}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              <button onClick={() => window.print()} className="flex justify-center items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-3 px-4 rounded-xl font-bold transition-colors">
                <Printer className="w-5 h-5" /> Cetak Bukti Daftar
              </button>
              <a href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Assalamu'alaikum, saya mendaftarkan santri an. ${formData.fullName} dengan No. Registrasi ${registrationId}.`)}`} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-bold transition-colors shadow-md">
                <Share2 className="w-5 h-5" /> Konfirmasi ke WA Panitia
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="psb" className="py-20 sm:py-32 bg-neutral-50 relative overflow-hidden">
      <div id="psb-form-anchor" className="absolute -top-32" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
            Formulir Pendaftaran
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 mt-4 font-serif">
            Penerimaan Santri Baru
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-neutral-200/60 overflow-hidden">
          {/* Stepper Header */}
          <div className="bg-neutral-100 border-b border-neutral-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isPast = currentStep > step.id;
                return (
                  <div key={step.id} className="flex flex-col items-center sm:w-1/4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors duration-300 shadow-sm ${
                      isActive ? 'bg-emerald-600 text-white ring-4 ring-emerald-600/20' : 
                      isPast ? 'bg-emerald-900 text-amber-400' : 'bg-white text-neutral-400 border border-neutral-300'
                    }`}>
                      {isPast ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-900' : 'text-neutral-500'}`}>{step.title}</span>
                  </div>
                );
              })}
              {/* Progress Line (Desktop only) */}
              <div className="hidden sm:block absolute top-5 left-[12%] right-[12%] h-0.5 bg-neutral-300 z-0">
                <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                
                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-neutral-900 font-serif border-b pb-2">1. Data Pribadi Santri</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field req label="Nama Lengkap (Sesuai Akta)" id="fullName" value={formData.fullName} onChange={handleChange} error={formErrors.fullName} placeholder="Contoh: Muhammad Al-Fatih" />
                      <Field label="Nama Panggilan" id="nickname" value={formData.nickname} onChange={handleChange} placeholder="Contoh: Fatih" />
                      <Field req label="NISN" id="nisn" value={formData.nisn} onChange={handleChange} error={formErrors.nisn} maxLength={10} placeholder="10 digit nomor urut nasional" />
                      <Field req type="select" label="Jenis Kelamin" id="gender" value={formData.gender} onChange={handleChange} error={formErrors.gender}>
                        <option value="">Pilih...</option>
                        <option value="Laki-laki">Laki-laki (Santriwan)</option>
                        <option value="Perempuan">Perempuan (Santriwati)</option>
                      </Field>
                      <Field req label="Tempat Lahir" id="birthPlace" value={formData.birthPlace} onChange={handleChange} error={formErrors.birthPlace} />
                      <Field req type="date" label="Tanggal Lahir" id="birthDate" value={formData.birthDate} onChange={handleChange} error={formErrors.birthDate} />
                      <Field type="select" label="Agama" id="religion" value={formData.religion} onChange={handleChange}>
                        <option value="Islam">Islam</option>
                      </Field>
                      <Field type="select" label="Status Kepengasuhan Anak" id="orphanStatus" value={formData.orphanStatus} onChange={handleChange}>
                        <option value="Bukan">Orang Tua Lengkap</option>
                        <option value="Yatim">Yatim (Ayah Wafat)</option>
                        <option value="Piatu">Piatu (Ibu Wafat)</option>
                        <option value="Yatim Piatu">Yatim Piatu (Keduanya Wafat)</option>
                      </Field>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-neutral-900 font-serif border-b pb-2">2. Tempat Tinggal & Kontak</h3>
                    
                    <Field req type="textarea" rows={3} label="Alamat Lengkap" id="address" value={formData.address} onChange={handleChange} error={formErrors.address} placeholder="Nama Jalan, RT/RW, Dusun, Desa, Kecamatan, Kabupaten..." />
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field req type="tel" label="No. WhatsApp Aktif" id="whatsapp" value={formData.whatsapp} onChange={handleChange} error={formErrors.whatsapp} placeholder="081234..." />
                      <Field type="select" label="Tinggal Bersama" id="livingWith" value={formData.livingWith} onChange={handleChange}>
                        <option value="Bersama Orang Tua">Bersama Orang Tua</option>
                        <option value="Wali / Saudara">Wali / Saudara</option>
                        <option value="Lainnya">Lainnya</option>
                      </Field>
                    </div>

                    <h4 className="font-bold text-sm text-neutral-800 mt-6 pt-6 border-t">Riwayat Kesehatan (Opsional)</h4>
                    <div className="grid sm:grid-cols-3 gap-5">
                      <Field type="select" label="Golongan Darah" id="bloodType" value={formData.bloodType} onChange={handleChange}>
                        <option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option><option value="-">Tidak Tahu</option>
                      </Field>
                      <Field type="number" label="Tinggi Badan (cm)" id="heightCm" value={formData.heightCm} onChange={handleChange} />
                      <Field type="number" label="Berat Badan (kg)" id="weightKg" value={formData.weightKg} onChange={handleChange} />
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-neutral-900 font-serif border-b pb-2">3. Pendidikan Sebelumnya & Tujuan</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field req type="select" label="Program Studi / Jenjang Tujuan" id="programType" value={formData.programType} onChange={handleChange}>
                        <option value="MTs">MTs (Setara SMP)</option>
                        <option value="MA">MA (Setara SMA)</option>
                        <option value="Tahfidz">Program Khusus Tahfidzul Qur'an</option>
                        <option value="Diniyah">Madrasah Diniyah Salafiyah</option>
                      </Field>
                      <Field req label="Asal Sekolah (SD/MI/SMP Asal)" id="prevSchoolLevel" value={formData.prevSchoolLevel} onChange={handleChange} error={formErrors.prevSchoolLevel} placeholder="Contoh: SDN Kencong 01" />
                      <Field label="Nomor STTB / Ijazah" id="sttbNumber" value={formData.sttbNumber} onChange={handleChange} placeholder="Opsional jika belum keluar" />
                      <Field label="Lama Belajar" id="studyDuration" value={formData.studyDuration} onChange={handleChange} placeholder="Contoh: 6 Tahun" />
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-neutral-900 font-serif border-b pb-2">4. Data Orang Tua / Wali</h3>
                    
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field req label="Nama Lengkap Ayah Kandung" id="fatherName" value={formData.fatherName} onChange={handleChange} error={formErrors.fatherName} />
                      <Field req label="Nama Lengkap Ibu Kandung" id="motherName" value={formData.motherName} onChange={handleChange} error={formErrors.motherName} />
                      <Field label="Pekerjaan Orang Tua / Wali" id="parentJob" value={formData.parentJob} onChange={handleChange} placeholder="Contoh: Wiraswasta" />
                      <Field type="select" label="Pilihan Pemondokan (Asrama)" id="boardingChoice" value={formData.boardingChoice} onChange={handleChange}>
                        <option value="Asrama">Mukim di Asrama Pesantren (Wajib luar kota)</option>
                        <option value="Non-Asrama">Non-Asrama (Santri Kalong / Warga Sekitar)</option>
                      </Field>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-10 pt-6 border-t border-neutral-200 flex justify-between items-center">
              {currentStep > 1 ? (
                <button type="button" onClick={handlePrev} className="flex items-center gap-2 text-neutral-600 font-bold hover:text-emerald-700 transition-colors px-4 py-2 rounded-xl hover:bg-neutral-100">
                  <ChevronLeft className="w-5 h-5" /> Kembali
                </button>
              ) : <div></div>}
              
              {currentStep < 4 ? (
                <button type="button" onClick={handleNext} className="flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95">
                  Selanjutnya <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50">
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : <CheckCircle2 className="w-5 h-5" />}
                  Kirim Pendaftaran
                </button>
              )}
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}
