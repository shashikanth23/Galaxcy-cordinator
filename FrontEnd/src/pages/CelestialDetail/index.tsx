import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Globe2, Ruler, Thermometer, Zap } from 'lucide-react';
import { celestialApi } from '../../api/client';
import { formatDistance, formatTemp, typeBadgeClass } from '../../lib/utils';
import { useAuthStore } from '../../store/stores';

const TYPE_EMOJI: Record<string,string> = {STAR:'⭐',PLANET:'🪐',MOON:'🌙',GALAXY:'🌌',NEBULA:'🌫️',BLACK_HOLE:'⚫',COMET:'☄️',ASTEROID:'🪨'};

export default function CelestialDetailPage() {
  const { slug } = useParams<{slug:string}>();
  const { isAuthenticated } = useAuthStore();
  const qc = useQueryClient();

  const { data: obj, isLoading } = useQuery({
    queryKey: ['celestial', slug],
    queryFn: () => celestialApi.getBySlug(slug!).then(r=>r.data),
    enabled: !!slug,
  });
  const favMutation = useMutation({
    mutationFn: ()=>celestialApi.favorite(obj.id).then(r=>r.data),
    onSuccess: ()=>qc.invalidateQueries({queryKey:['favorites']}),
  });

  if (isLoading) return <div className="p-8 space-y-4"><div className="glass-card h-72 animate-pulse"/><div className="glass-card h-8 w-1/3 animate-pulse"/><div className="glass-card h-4 animate-pulse"/></div>;
  if (!obj) return <div className="flex flex-col items-center justify-center h-full p-8 text-center"><div className="text-5xl mb-4">🌑</div><p className="text-white/50">Object not found</p><Link to="/search" className="btn-ghost mt-4">Browse Objects</Link></div>;

  return (
    <div className="pb-24 md:pb-8">
      <div className="relative h-64 md:h-96 overflow-hidden">
        {obj.imageUrls?.[0]
          ? <img src={obj.imageUrls[0]} alt={obj.name} className="w-full h-full object-cover"/>
          : <div className="w-full h-full bg-stellar/20 flex items-center justify-center"><span className="text-9xl">{TYPE_EMOJI[obj.type]||'✨'}</span></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent"/>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link to="/search" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4"/> Back to search
          </Link>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={typeBadgeClass(obj.type)}>{obj.type}</span>
                {obj.constellation&&<span className="text-white/40 text-xs">{obj.constellation}</span>}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">{obj.name}</h1>
            </div>
            {isAuthenticated&&(
              <button onClick={()=>favMutation.mutate()} className="glass-card p-3 hover:border-pulsar/40 transition-all flex-shrink-0">
                <Heart className={`w-5 h-5 ${favMutation.data?.favorited?'text-pulsar fill-pulsar':'text-white/50'}`}/>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {icon:Globe2,label:'Distance',value:formatDistance(obj.distanceFromEarth)},
            {icon:Ruler,label:'Radius',value:obj.radiusKm?`${(obj.radiusKm/1000).toFixed(0)}K km`:'Unknown'},
            {icon:Thermometer,label:'Temperature',value:formatTemp(obj.temperatureK)},
            {icon:Zap,label:'Magnitude',value:obj.apparentMagnitude?.toFixed(2)??'Unknown'},
          ].map(({icon:Icon,label,value})=>(
            <div key={label} className="glass-card p-4 text-center">
              <Icon className="w-5 h-5 text-aurora mx-auto mb-2 opacity-60"/>
              <p className="data-label mb-1">{label}</p>
              <p className="text-white font-medium text-sm">{value}</p>
            </div>
          ))}
        </div>

        {obj.description&&(
          <div className="glass-card p-6">
            <h2 className="font-display text-xs text-aurora tracking-widest mb-3">ABOUT</h2>
            <p className="text-white/70 leading-relaxed">{obj.description}</p>
          </div>
        )}

        {obj.facts?.length>0&&(
          <div className="glass-card p-6">
            <h2 className="font-display text-xs text-aurora tracking-widest mb-4">KEY FACTS</h2>
            <div className="space-y-3">
              {obj.facts.map((f:any)=>(
                <div key={f.id} className="flex items-start gap-3">
                  <span className="text-nova mt-0.5 flex-shrink-0">✦</span>
                  <p className="text-white/70 text-sm">{f.fact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {(obj.discoveredBy||obj.discoveryYear)&&(
          <div className="glass-card p-6">
            <h2 className="font-display text-xs text-aurora tracking-widest mb-3">DISCOVERY</h2>
            <div className="flex gap-8">
              {obj.discoveredBy&&<div><p className="data-label mb-1">Discovered By</p><p className="text-white">{obj.discoveredBy}</p></div>}
              {obj.discoveryYear&&<div><p className="data-label mb-1">Year</p><p className="text-white">{obj.discoveryYear}</p></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
