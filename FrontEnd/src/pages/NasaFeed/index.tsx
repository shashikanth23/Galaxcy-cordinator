import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { nasaApi } from '../../api/client';
import { format, subDays } from 'date-fns';

export default function NasaFeedPage() {
  const [apodDate, setApodDate] = useState('');
  const { data: apod, isLoading: apodLoading } = useQuery({
    queryKey: ['apod', apodDate],
    queryFn: () => nasaApi.apod(apodDate || undefined).then(r => r.data),
  });
  const { data: neos }    = useQuery({ queryKey:['neo'],          queryFn:()=>nasaApi.neo().then(r=>r.data) });
  const { data: mars }    = useQuery({ queryKey:['mars'],         queryFn:()=>nasaApi.marsRover().then(r=>r.data) });
  const { data: weather } = useQuery({ queryKey:['space-weather'],queryFn:()=>nasaApi.spaceWeather().then(r=>r.data) });

  const pastDates = Array.from({length:7},(_,i)=>{
    const d = subDays(new Date(), i+1);
    return { label: format(d,'MMM d'), value: format(d,'yyyy-MM-dd') };
  });

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="section-title mb-2">🚀 NASA Live Feed</h1>
        <p className="text-white/50">Real-time data from NASA's open APIs</p>
      </div>

      {/* APOD */}
      <section>
        <h2 className="font-display text-xs text-aurora tracking-widest mb-4">ASTRONOMY PICTURE OF THE DAY</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          <button onClick={()=>setApodDate('')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all border ${!apodDate?'bg-aurora/20 text-aurora border-aurora/40':'bg-stellar/20 text-white/40 border-glassborder'}`}>
            Today
          </button>
          {pastDates.map(d=>(
            <button key={d.value} onClick={()=>setApodDate(d.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all border ${apodDate===d.value?'bg-aurora/20 text-aurora border-aurora/40':'bg-stellar/20 text-white/40 border-glassborder'}`}>
              {d.label}
            </button>
          ))}
        </div>
        {apodLoading ? <div className="glass-card h-64 animate-pulse" /> : apod && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass-card overflow-hidden md:flex">
            <div className="md:w-1/2 h-72 md:h-auto flex-shrink-0">
              {apod.mediaType==='image'
                ? <img src={apod.hdUrl||apod.url} alt={apod.title} className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center bg-stellar/20">
                    <a href={apod.url} target="_blank" rel="noreferrer" className="btn-primary">▶ Watch Video</a>
                  </div>
              }
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="badge-aurora mb-3 inline-flex">{apod.date}</span>
                <h3 className="text-xl font-bold text-white mb-3">{apod.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{apod.explanation}</p>
              </div>
              {apod.copyright && <p className="text-white/30 text-xs mt-4">© {apod.copyright}</p>}
            </div>
          </motion.div>
        )}
      </section>

      {/* NEOs */}
      <section>
        <h2 className="font-display text-xs text-aurora tracking-widest mb-4">NEAR-EARTH OBJECTS — NEXT 7 DAYS</h2>
        {neos?.length > 0 ? (
          <div className="space-y-2">
            {neos.slice(0,8).map((neo:any)=>(
              <div key={neo.id} className="glass-card p-4 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">☄️</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{neo.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {neo.closeApproach?.date} · Miss distance: {neo.closeApproach?.missDistanceKm?.toLocaleString()} km
                  </p>
                </div>
                <span className={`flex-shrink-0 ${neo.isPotentiallyHazardous?'badge-pulsar':'badge-quasar'}`}>
                  {neo.isPotentiallyHazardous?'⚠ Hazardous':'Safe'}
                </span>
              </div>
            ))}
          </div>
        ) : <div className="glass-card h-24 animate-pulse" />}
      </section>

      {/* Mars Rover Photos */}
      {mars?.length > 0 && (
        <section>
          <h2 className="font-display text-xs text-aurora tracking-widest mb-4">MARS ROVER — CURIOSITY</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mars.slice(0,8).map((photo:any)=>(
              <motion.div key={photo.id} whileHover={{scale:1.02}} className="glass-card overflow-hidden">
                <img src={photo.imgSrc} alt="Mars surface" className="w-full h-32 object-cover"/>
                <div className="p-2">
                  <p className="text-white/50 text-xs truncate">{photo.camera.name}</p>
                  <p className="text-white/30 text-xs">{photo.earthDate}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Space Weather */}
      {weather && (
        <section>
          <h2 className="font-display text-xs text-aurora tracking-widest mb-4">SPACE WEATHER (LAST 7 DAYS)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <p className="font-semibold text-white mb-3">☀️ Coronal Mass Ejections</p>
              {weather.coronalMassEjections?.length > 0
                ? weather.coronalMassEjections.map((c:any,i:number)=>(
                  <div key={i} className="text-sm text-white/50 py-2 border-b border-glassborder last:border-0">
                    {c.startTime ? format(new Date(c.startTime),'PPp') : 'Date unknown'} · {c.type||'C-type'}
                  </div>
                ))
                : <p className="text-white/30 text-sm">No CMEs detected</p>
              }
            </div>
            <div className="glass-card p-5">
              <p className="font-semibold text-white mb-3">🌍 Geomagnetic Storms</p>
              {weather.geomagneticStorms?.length > 0
                ? weather.geomagneticStorms.map((g:any,i:number)=>(
                  <div key={i} className="text-sm text-white/50 py-2 border-b border-glassborder last:border-0">
                    {g.startTime ? format(new Date(g.startTime),'PPp') : 'Date unknown'} · Kp index: {g.allKpIndex?.[0]?.kpIndex||'N/A'}
                  </div>
                ))
                : <p className="text-white/30 text-sm">No geomagnetic storms</p>
              }
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
