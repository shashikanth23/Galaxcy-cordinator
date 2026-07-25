import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Satellite, Eye, RefreshCw } from 'lucide-react';
import { nasaApi } from '../../api/client';

export default function SkyFinderPage() {
  const [location, setLocation] = useState<{lat:number;lon:number}|null>(null);
  const [passes, setPasses]     = useState<any[]>([]);
  const [issPos, setIssPos]     = useState<any>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const detect = () => {
    setLoading(true); setError('');
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const {latitude:lat,longitude:lon} = pos.coords;
        setLocation({lat,lon});
        const [p,iss] = await Promise.all([
          nasaApi.issPasses(lat,lon).then(r=>r.data).catch(()=>[]),
          nasaApi.iss().then(r=>r.data).catch(()=>null),
        ]);
        setPasses(p); setIssPos(iss); setLoading(false);
      },
      ()=>{ setError('Location access denied. Enable GPS.'); setLoading(false); }
    );
  };

  useEffect(()=>{ detect(); },[]);

  const CONSTELLATIONS = [
    {name:'Orion',stars:7,visible:true,emoji:'⭐'},
    {name:'Ursa Major',stars:12,visible:true,emoji:'🐻'},
    {name:'Cassiopeia',stars:5,visible:true,emoji:'💫'},
    {name:'Scorpius',stars:18,visible:false,emoji:'🦂'},
    {name:'Leo',stars:9,visible:true,emoji:'🦁'},
    {name:'Gemini',stars:8,visible:true,emoji:'♊'},
  ];
  const PLANETS = [
    {name:'Venus',mag:-3.9,dir:'West',alt:'25°'},
    {name:'Jupiter',mag:-2.1,dir:'East',alt:'45°'},
    {name:'Mars',mag:0.5,dir:'South',alt:'30°'},
    {name:'Saturn',mag:0.8,dir:'SE',alt:'35°'},
  ];

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="section-title mb-2">🔭 Sky Finder</h1>
        <p className="text-white/50">Discover what's visible from your location tonight</p>
      </div>
      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-aurora"/>
          {location
            ? <span className="text-sm text-white">{location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E</span>
            : <span className="text-sm text-white/40">{error||'Detecting location...'}</span>
          }
        </div>
        <button onClick={detect} disabled={loading} className="btn-ghost text-xs px-3 py-1.5">
          <RefreshCw className={`w-3 h-3 ${loading?'animate-spin':''}`}/> Update
        </button>
      </div>

      {issPos && (
        <div className="glass-card p-5 mb-6 border-aurora/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-aurora/15 border border-aurora/30 flex items-center justify-center">
              <Satellite className="w-5 h-5 text-aurora animate-pulse"/>
            </div>
            <div><p className="font-semibold text-white">ISS — Live Position</p><p className="text-white/40 text-xs">International Space Station</p></div>
            <span className="ml-auto badge-quasar">LIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="data-label">Latitude</p><p className="data-value">{issPos.latitude?.toFixed(4)}°</p></div>
            <div><p className="data-label">Longitude</p><p className="data-value">{issPos.longitude?.toFixed(4)}°</p></div>
          </div>
          {passes.length>0 && (
            <div className="mt-4 pt-4 border-t border-glassborder">
              <p className="text-white/40 text-xs mb-3 uppercase tracking-widest">Next Passes Over You</p>
              <div className="space-y-2">
                {passes.slice(0,3).map((p:any,i:number)=>(
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white">{new Date(p.risetime).toLocaleString()}</span>
                    <span className="text-aurora">{Math.round(p.duration/60)} min</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <p className="font-display text-xs text-aurora tracking-widest mb-4">VISIBLE PLANETS TONIGHT</p>
          <div className="space-y-3">
            {PLANETS.map(p=>(
              <div key={p.name} className="flex items-center justify-between py-2 border-b border-glassborder last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🪐</span>
                  <div>
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-white/40 text-xs">Mag {p.mag}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-aurora text-xs">{p.dir}</p>
                  <p className="text-white/40 text-xs">{p.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card p-5">
          <p className="font-display text-xs text-aurora tracking-widest mb-4">CONSTELLATIONS</p>
          <div className="space-y-3">
            {CONSTELLATIONS.map(c=>(
              <div key={c.name} className="flex items-center justify-between py-2 border-b border-glassborder last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{c.name}</p>
                    <p className="text-white/40 text-xs">{c.stars} main stars</p>
                  </div>
                </div>
                <span className={c.visible?'badge-quasar':'bg-white/5 text-white/30 badge'}>
                  {c.visible?'Visible':'Below horizon'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mt-6 text-center border-nova/20">
        <div className="text-3xl mb-3">📱</div>
        <p className="font-semibold text-white mb-2">Augmented Reality Mode</p>
        <p className="text-white/50 text-sm">Point your camera at the sky to overlay star names, constellations, and satellite paths.</p>
        <button className="btn-nova mt-4 mx-auto"><Eye className="w-4 h-4"/> Launch AR View</button>
      </div>
    </div>
  );
}
