import { useState } from 'react';
import { motion } from 'framer-motion';

const PLANETS = [
  { name: 'Mercury', emoji: '🟤', type: 'Terrestrial', moons: 0, distAU: '0.387', diamKm: '4,879', tempC: '-180 to 430', dayLen: '58.6 Earth days', yearLen: '88 Earth days', gravity: '3.7 m/s²', desc: 'Smallest planet. Extreme temperature swings. No atmosphere to retain heat. Surface covered in craters.' },
  { name: 'Venus',   emoji: '🟡', type: 'Terrestrial', moons: 0, distAU: '0.723', diamKm: '12,104', tempC: '465 (avg)', dayLen: '243 Earth days', yearLen: '225 Earth days', gravity: '8.87 m/s²', desc: 'Hottest planet. Runaway greenhouse effect. Spins backwards. Thick CO₂ atmosphere with sulfuric acid clouds.' },
  { name: 'Earth',   emoji: '🌍', type: 'Terrestrial', moons: 1, distAU: '1.000', diamKm: '12,756', tempC: '15 (avg)', dayLen: '23h 56m', yearLen: '365.25 days', gravity: '9.81 m/s²', desc: 'Our home. Only known planet with life. Large Moon stabilizes axial tilt. Liquid water on surface.' },
  { name: 'Mars',    emoji: '🔴', type: 'Terrestrial', moons: 2, distAU: '1.524', diamKm: '6,792', tempC: '-63 (avg)', dayLen: '24h 37m', yearLen: '687 Earth days', gravity: '3.72 m/s²', desc: 'Red Planet. Has Olympus Mons (tallest volcano in solar system, 22km). Thin CO₂ atmosphere. Evidence of ancient water.' },
  { name: 'Jupiter', emoji: '🟠', type: 'Gas Giant',   moons: 95, distAU: '5.203', diamKm: '142,984', tempC: '-108', dayLen: '9h 56m', yearLen: '11.9 Earth years', gravity: '24.79 m/s²', desc: 'Largest planet. Great Red Spot is a storm 3× Earth\'s size, raging 350+ years. 95 confirmed moons including Europa (ocean world).' },
  { name: 'Saturn',  emoji: '🪐', type: 'Gas Giant',   moons: 146, distAU: '9.537', diamKm: '120,536', tempC: '-139', dayLen: '10h 42m', yearLen: '29.5 Earth years', gravity: '10.44 m/s²', desc: 'Famous rings of ice and rock. Least dense planet — could float on water. 146 known moons, including Titan with thick atmosphere.' },
  { name: 'Uranus',  emoji: '🔵', type: 'Ice Giant',   moons: 28, distAU: '19.19', diamKm: '51,118', tempC: '-195', dayLen: '17h 14m', yearLen: '84 Earth years', gravity: '8.87 m/s²', desc: 'Rotates on its side (98° axial tilt). Coldest planetary atmosphere. Has faint rings. 28 moons named after Shakespeare characters.' },
  { name: 'Neptune', emoji: '🔵', type: 'Ice Giant',   moons: 16, distAU: '30.07', diamKm: '49,528', tempC: '-201', dayLen: '16h 6m', yearLen: '165 Earth years', gravity: '11.15 m/s²', desc: 'Strongest winds in solar system (2,100 km/h). Triton orbits backwards — likely a captured Kuiper Belt Object.' },
];

export default function PlanetDatabasePage() {
  const [sel, setSel] = useState(PLANETS[2]);
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto">
      <h1 className="section-title mb-2">🪐 Planet Database</h1>
      <p className="text-white/50 mb-8">Complete data on every planet in our solar system</p>
      <div className="md:flex gap-6">
        <div className="flex md:flex-col gap-2 overflow-x-auto no-scrollbar md:overflow-visible pb-3 md:pb-0 mb-6 md:mb-0 md:w-44 flex-shrink-0">
          {PLANETS.map(p => (
            <button key={p.name} onClick={() => setSel(p)}
              className={`flex-shrink-0 glass-card p-3 flex items-center gap-2 transition-all hover:border-white/20 text-left ${sel.name === p.name ? 'border-aurora/40' : ''}`}
              style={{ minWidth: 120 }}>
              <span className="text-2xl">{p.emoji}</span>
              <span className="text-white text-sm font-medium hidden md:block">{p.name}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <motion.div key={sel.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-7xl">{sel.emoji}</span>
              <div><h2 className="text-3xl font-bold text-white">{sel.name}</h2><span className="badge-nova">{sel.type}</span></div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">{sel.desc}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ['Distance from Sun', sel.distAU + ' AU'],
                ['Diameter', sel.diamKm + ' km'],
                ['Temperature', sel.tempC + '°C'],
                ['Known Moons', String(sel.moons)],
                ['Day Length', sel.dayLen],
                ['Year Length', sel.yearLen],
                ['Surface Gravity', sel.gravity],
                ['Planet Type', sel.type],
              ].map(([label, value]) => (
                <div key={label} className="bg-stellar/20 rounded-xl p-3">
                  <p className="data-label mb-1">{label}</p>
                  <p className="text-white text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
