import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { PESANTREN_INFO } from '../data/pesantrenData';
import PesantrenLogo from './PesantrenLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: 'Beranda', target: 'hero' },
    { label: 'Profil & Lembaga', target: 'profile' },
    { label: 'Papan Pengumuman', target: 'announcements' },
    { label: 'Artikel & Berita', target: 'news' },
    { label: 'Agenda & Kegiatan', target: 'calendar' },
    { label: 'Galeri Foto & Fasilitas', target: 'gallery' },
    { label: 'Pendaftaran PSB', target: 'psb' },
    { label: 'Hubungi Kami', target: 'contact' },
  ];

  return (
    <footer id="main-footer" className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-emerald-900/60 pb-12">
          {/* Logo / Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-xl p-1 shadow-md shadow-emerald-950/40 border border-emerald-700/20 flex items-center justify-center flex-shrink-0">
                <PesantrenLogo variant="emerald" className="w-full h-full" />
              </div>
              <div>
                <p className="text-emerald-200/90 font-medium text-xs tracking-wide leading-tight">
                  Pondok Pesantren
                </p>
                <h3 className="text-white font-bold text-base leading-tight mt-0.5">
                  Darul Mushthofa Assunniyyah
                </h3>
              </div>
            </div>
            <p className="text-emerald-200/70 text-xs sm:text-sm leading-relaxed max-w-sm">
              Lembaga pendidikan Islam berwawasan global yang setia mengabdi membina generasi rabbani, cerdas, berakhlaq mulia, dan kokoh dalam aqidah Ahlussunnah wal Jama'ah.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={PESANTREN_INFO.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-emerald-200"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={PESANTREN_INFO.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-emerald-200"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={PESANTREN_INFO.socials.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-emerald-200"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={PESANTREN_INFO.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors text-emerald-200"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-l-2 border-amber-400 pl-3">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {links.map((link) => (
                <li key={link.target}>
                  <button
                    onClick={() => onNavigate(link.target)}
                    className="hover:text-amber-300 transition-colors duration-150 font-medium text-emerald-200/80 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-l-2 border-amber-400 pl-3">
              Kantor Sekretariat
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-emerald-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{PESANTREN_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span>{PESANTREN_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="truncate">{PESANTREN_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-emerald-300/60 font-medium">
          <p>© {currentYear} PP Darul Mushtofa Assunniyyah. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4">
            <a href="#contact" className="hover:text-amber-300 transition-colors">Syarat & Ketentuan</a>
            <span>•</span>
            <a href="#contact" className="hover:text-amber-300 transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
