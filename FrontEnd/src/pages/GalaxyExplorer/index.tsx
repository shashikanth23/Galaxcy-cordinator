import { useState } from 'react';
import { motion } from 'framer-motion';

const GALAXIES = [
  { name: 'Milky Way', type: 'Barred Spiral', distance: '0 ly (We are here)', stars: '100–400 billion', diameter: '100,000 ly', emoji: '🌌', desc: 'Our home galaxy. A barred spiral containing 200–400 billion stars, including our Sun located ~26,000 ly from the galactic center in the Orion Arm.' },
  { name: 'Andromeda (M31)', type: 'Spiral SA(s)b', distance: '2.537 million ly', stars: '~1 trillion', diameter: '220,000 ly', emoji: '🌀', desc: 'The nearest large galaxy and most distant object visible to the naked eye. On a collision course with the Milky Way in ~4.5 billion years.' },
  { name: 'Triangulum (M33)', type: 'Spiral SA(s)cd', distance: '2.73 million ly', stars: '~40 billion', diameter: '60,000 ly', emoji: '🔺', desc: 'Third-largest member of the Local Group. One of the faintest objects visible to the naked eye on a very clear night.' },
  { name: 'Large Magellanic Cloud', type: 'Irregular', distance: '163,000 ly', stars: '~30 billion', diameter: '14,000 ly', emoji: '☁️', desc: 'Satellite galaxy of the Milky Way, visible from the Southern Hemisphere. Hosted supernova SN 1987A — closest supernova since 1604.' },
  { name: 'Sombrero Galaxy (M104)', type: 'Lenticular/Spiral', distance: '29.35 million ly', stars: '~800 billion', diameter: '49,000 ly', emoji: '🌂', desc: 'A lenticular galaxy with a bright nucleus and prominent dust lane. Resembles a sombrero hat. Contains a massive central black hole of ~1 billion solar masses.' },
  { name: 'Whirlpool Galaxy (M51)', type: 'Spiral SA(s)bc', distance: '23 million ly', stars: '~160 billion', diameter: '76,900 ly', emoji: '🌊', desc: 'Classic grand-design spiral interacting with companion NGC 5195. One of the most visually stunning galaxy pairs in the sky.' },
];

export default function GalaxyExplorerPage() {
  const [selected, setSelected] = useState<typeof GALAXIES[0] | null>(null);
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto">
      <h1 className="section-title mb-2">🌌 Galaxy Explorer</h1>
      <p className="text-white/50 mb-8">Journey through the most spectacular galaxies in the observable universe</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GALAXIES.map((g, i) => (
          <motion.div key={g.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => setSelected(selected?.name === g.name ? null : g)}
            className={`glass-card p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-white/20 ${selected?.name === g.name ? 'border-aurora/40 bg-aurora/5' : ''}`}>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-4xl">{g.emoji}</span>
              <div><h3 className="font-bold text-white">{g.name}</h3><span className="badge-aurora text-xs">{g.type}</span></div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{g.desc}</p>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-glassborder">
              <div><p className="data-label">Distance</p><p className="text-white/60 text-xs mt-0.5">{g.distance}</p></div>
              <div><p className="data-label">Stars</p><p className="text-white/60 text-xs mt-0.5">{g.stars}</p></div>
              <div><p className="data-label">Diameter</p><p className="text-white/60 text-xs mt-0.5">{g.diameter}</p></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
