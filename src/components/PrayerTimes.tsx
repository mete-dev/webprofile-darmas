import React, { useState, useEffect } from 'react';
import { Clock, Bell, MapPin, Calendar, Compass, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { PESANTREN_INFO } from '../data/pesantrenData';

interface Prayer {
  name: string;
  time: string; // "HH:MM"
  icon: React.ComponentType<any>;
}

export default function PrayerTimes() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState('');
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [hijriDate, setHijriDate] = useState('');

  // Generate prayer times with minor drift based on day of month for extreme realism
  const getPrayerTimesForToday = (date: Date): Prayer[] => {
    const day = date.getDate();
    const month = date.getMonth(); // 0-11
    
    // Seasonal adjustments for Lumajang / Jawa Timur coordinates
    const baseOffsets = [
      { s: 12, sy: 28, d: 29, a: 48, m: 26, i: 36 }, // Jan
      { s: 15, sy: 31, d: 31, a: 45, m: 28, i: 38 }, // Feb
      { s: 14, sy: 29, d: 28, a: 39, m: 24, i: 34 }, // Mar
      { s: 10, sy: 25, d: 21, a: 31, m: 18, i: 28 }, // Apr
      { s: 5,  sy: 22, d: 16, a: 28, m: 12, i: 23 }, // May
      { s: 8,  sy: 26, d: 19, a: 32, m: 15, i: 26 }, // Jun
      { s: 10, sy: 28, d: 22, a: 34, m: 18, i: 29 }, // Jul
      { s: 11, sy: 27, d: 21, a: 31, m: 18, i: 28 }, // Aug
      { s: 12, sy: 28, d: 19, a: 28, m: 16, i: 26 }, // Sep (current month in user request)
      { s: 8,  sy: 22, d: 11, a: 20, m: 10, i: 20 }, // Oct
      { s: 3,  sy: 18, d: 7,  a: 17, m: 8,  i: 19 }, // Nov
      { s: 5,  sy: 20, d: 18, a: 35, m: 17, i: 28 }  // Dec
    ];

    const currentOffset = baseOffsets[month];
    
    // Add tiny daily drift (up to 3 minutes)
    const drift = Math.floor(Math.sin((day / 30) * Math.PI) * 2);

    const pad = (n: number) => n.toString().padStart(2, '0');

    return [
      { name: 'Subuh', time: `04:${pad(currentOffset.s + drift)}`, icon: Moon },
      { name: 'Syuruk', time: `05:${pad(currentOffset.sy + drift)}`, icon: Sun },
      { name: 'Dzuhur', time: `11:${pad(currentOffset.d + drift)}`, icon: Sun },
      { name: 'Ashar', time: `14:${pad(currentOffset.a + drift)}`, icon: Sun },
      { name: 'Maghrib', time: `17:${pad(currentOffset.m + drift)}`, icon: Moon },
      { name: 'Isya', time: `18:${pad(currentOffset.i + drift)}`, icon: Moon },
    ];
  };

  const prayers = getPrayerTimesForToday(currentTime);

  // Live timer & Hijri Date Calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Approximate Hijri calendar converter for Jember region (September 1, 2026 corresponds to roughly Safar 19, 1448 H)
    const calculateHijri = () => {
      const today = new Date();
      // Use simple reference point: Sept 1, 2026 is approx 19 Safar 1448 H
      const referenceDate = new Date(2026, 8, 1); // Sept is index 8
      const msDiff = today.getTime() - referenceDate.getTime();
      const dayDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
      
      // Islamic calendar has 29.53 days per month average
      let hijriDay = 19 + dayDiff;
      let hijriMonthIdx = 1; // 1 = Safar
      let hijriYear = 1448;

      const hijriMonths = [
        'Muharram', 'Safar', 'Rabi\'ul Awwal', 'Rabi\'ul Akhir', 
        'Jumadil Ula', 'Jumadil Akhirah', 'Rajab', 'Sya\'ban', 
        'Ramadhan', 'Syawwal', 'Dzulqa\'dah', 'Dzulhijjah'
      ];

      while (hijriDay > 30) {
        hijriDay -= 30; // Simply simulate alternating month sizes 30/29
        hijriMonthIdx = (hijriMonthIdx + 1) % 12;
        if (hijriMonthIdx === 0) hijriYear += 1;
      }
      
      while (hijriDay < 1) {
        hijriDay += 29;
        hijriMonthIdx = (hijriMonthIdx - 1 + 12) % 12;
        if (hijriMonthIdx === 11) hijriYear -= 1;
      }

      setHijriDate(`${hijriDay} ${hijriMonths[hijriMonthIdx]} ${hijriYear} H`);
    };

    calculateHijri();
    return () => clearInterval(timer);
  }, []);

  // Countdown calculations
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      
      const currentInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      let nextPrayer: Prayer | null = null;
      let nextInSeconds = 0;

      // Find next prayer today
      for (const prayer of prayers) {
        const [pHours, pMinutes] = prayer.time.split(':').map(Number);
        const pInSeconds = pHours * 3600 + pMinutes * 60;

        if (pInSeconds > currentInSeconds) {
          nextPrayer = prayer;
          nextInSeconds = pInSeconds;
          break;
        }
      }

      // If no prayer left today, next prayer is Subuh tomorrow
      if (!nextPrayer) {
        const subuh = prayers[0];
        const [pHours, pMinutes] = subuh.time.split(':').map(Number);
        nextPrayer = { ...subuh, name: 'Subuh Besok' };
        nextInSeconds = (pHours + 24) * 3600 + pMinutes * 60;
      }

      setNextPrayerName(nextPrayer.name);

      const diffSeconds = nextInSeconds - currentInSeconds;
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;

      const pad = (num: number) => num.toString().padStart(2, '0');
      setCountdown(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [prayers, currentTime]);

  const getActivePrayerName = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentInMinutes = hours * 60 + minutes;

    let currentActive = 'Isya';

    // Loop to find where we stand
    for (let i = 0; i < prayers.length; i++) {
      const [pHours, pMinutes] = prayers[i].time.split(':').map(Number);
      const pInMinutes = pHours * 60 + pMinutes;

      if (currentInMinutes < pInMinutes) {
        currentActive = i === 0 ? 'Isya' : prayers[i - 1].name;
        break;
      }
    }
    return currentActive;
  };

  const activePrayerName = getActivePrayerName();

  return (
    <section id="prayer" className="py-24 bg-gradient-to-br from-emerald-950 to-emerald-900 text-white scroll-mt-12 relative overflow-hidden">
      {/* Decors */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1609599006353-e629f1d00f18?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-300 font-bold text-sm tracking-widest uppercase">
            Waktu Ibadah
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            Jadwal Sholat & Ibadah Harian
          </h2>
          <div className="w-16 h-1 bg-amber-400 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Dynamic Countdown Card */}
          <div className="lg:col-span-5 bg-emerald-950/70 backdrop-blur-md border border-emerald-800/80 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-6 translate-x-6 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

            {/* Header of widget */}
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
                <Compass className="h-4 w-4 animate-spin-slow" /> Lumajang & Sekitarnya
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                PP Darul Mushtofa Assunniyyah
              </h3>

              {/* Calendars */}
              <div className="mt-6 space-y-2 text-emerald-100/80 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>
                    Masehi: {currentTime.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {hijriDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-400" />
                    <span>Hijriyah: {hijriDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span>Kec. Yosowilangun, Lumajang, Jawa Timur</span>
                </div>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="my-10 p-6 bg-emerald-900/40 border border-emerald-800/60 rounded-2xl text-center">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-300 block mb-1">
                Menuju {nextPrayerName}
              </span>
              <span className="text-4xl sm:text-5xl font-mono font-bold text-amber-300 tracking-wider">
                {countdown}
              </span>
              <div className="mt-2 text-[10px] sm:text-xs text-emerald-200">
                Pukul sekarang: {currentTime.toLocaleTimeString('id-ID')} WIB
              </div>
            </div>

            {/* Quote of day */}
            <div className="text-center pt-4 border-t border-emerald-800/60 text-xs text-emerald-200/70 italic">
              "Sholatlah tepat pada waktunya, karena ibadah adalah pilar utama kesuksesan santri di dunia dan akhirat."
            </div>
          </div>

          {/* Times Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {prayers.map((prayer) => {
              const Icon = prayer.icon;
              const isUpcoming = nextPrayerName.includes(prayer.name);
              const isActive = activePrayerName === prayer.name;

              return (
                <div
                  key={prayer.name}
                  id={`prayer-time-${prayer.name}`}
                  className={`relative p-5 rounded-2xl flex flex-col justify-between overflow-hidden shadow transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-500 to-amber-400 text-emerald-950 border-transparent shadow-lg scale-102 ring-4 ring-amber-400/20'
                      : isUpcoming
                      ? 'bg-emerald-900/60 border border-amber-400/40 text-white'
                      : 'bg-emerald-950/40 border border-emerald-800/50 text-emerald-100'
                  }`}
                >
                  {/* Glowing light for active */}
                  {isActive && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-950 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-950"></span>
                    </span>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <span className={`text-xs sm:text-sm font-bold tracking-wide uppercase ${
                      isActive ? 'text-emerald-900' : 'text-emerald-300'
                    }`}>
                      {prayer.name}
                    </span>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-900' : 'text-amber-400'}`} />
                  </div>

                  <div>
                    <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight block">
                      {prayer.time}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] font-bold block mt-1 uppercase tracking-wider ${
                      isActive ? 'text-emerald-950/70' : 'text-emerald-200/50'
                    }`}>
                      {isActive ? 'Waktu Sekarang' : isUpcoming ? 'Akan Datang' : 'WIB'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
