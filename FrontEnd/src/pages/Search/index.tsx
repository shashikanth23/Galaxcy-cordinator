import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { celestialApi } from '../../api/client';
import { formatDistance, typeBadgeClass } from '../../lib/utils';

const TYPES = ['ALL','STAR','PLANET','MOON','GALAXY','NEBULA','BLACK_HOLE','COMET','ASTEROID'];
const EMOJI: Record<string,string> = {STAR:'⭐',PLANET:'🪐',MOON:'🌙',GALAXY:'🌌',NEBULA:'🌫️',BLACK_HOLE:'⚫',COMET:'☄️',ASTEROID:'🪨',ALL:'🔭'};

export default function SearchPage() {
  const [q, setQ]                   = useState('sirius');
  const [inputVal, setInputVal]     = useState('');
  const [type, setType]             = useState('ALL');
  const [page, setPage]             = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ['search', q, type, page],
    queryFn: () => celestialApi.search({ q, type: type==='ALL'?undefined:type, page, limit:20 }).then(r=>r.data),
    staleTime: 60000,
  });

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setQ(inputVal||'a'); setPage(1); };

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="section-title mb-2">🔍 Celestial Search</h1>
        <p className="text-white/50">Search 2M+ stars, planets, galaxies, and more</p>
      </div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"/>
          <input value={inputVal} onChange={e=>setInputVal(e.target.value)}
            placeholder="Search Andromeda, Sirius, Betelgeuse..."
            className="input-space pl-12 pr-12 py-4 text-base"/>
          {inputVal && (
            <button type="button" onClick={()=>{setInputVal('');setQ('sirius');}}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
              <X className="w-4 h-4"/>
            </button>
          )}
        </div>
      </form>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {TYPES.map(t=>(
          <button key={t} onClick={()=>{setType(t);setPage(1);}}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${type===t?'bg-aurora/20 text-aurora border-aurora/40':'bg-stellar/20 text-white/40 border-glassborder hover:text-white'}`}>
            <span>{EMOJI[t]}</span>{t==='ALL'?'All Types':t.replace(/_/g,' ')}
          </button>
        ))}
      </div>
      {isFetching && <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-aurora border-t-transparent rounded-full animate-spin"/></div>}
      {data && !isFetching && (
        <>
          <p className="text-white/30 text-sm mb-4">{data.total?.toLocaleString()||0} objects found</p>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {data.items?.map((obj:any,i:number)=>(
                <motion.div key={obj.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:i*0.03}}>
                  <Link to={`/object/${obj.slug}`}>
                    <div className="glass-card p-4 flex items-center gap-4 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200">
                      <div className="w-14 h-14 rounded-xl bg-stellar/30 flex-shrink-0 overflow-hidden">
                        {obj.imageUrls?.[0]
                          ? <img src={obj.imageUrls[0]} alt={obj.name} className="w-full h-full object-cover"/>
                          : <div className="w-full h-full flex items-center justify-center text-2xl">{EMOJI[obj.type]||'✨'}</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-white truncate">{obj.name}</p>
                          <span className={typeBadgeClass(obj.type)}>{obj.type}</span>
                        </div>
                        <p className="text-white/40 text-sm line-clamp-1">{obj.shortDescription}</p>
                      </div>
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <p className="data-value">{formatDistance(obj.distanceFromEarth)}</p>
                        <p className="data-label">from Earth</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {data.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-ghost px-4 py-2 text-sm disabled:opacity-30">← Prev</button>
              <span className="text-white/40 text-sm">{page} / {data.pages}</span>
              <button onClick={()=>setPage(p=>Math.min(data.pages,p+1))} disabled={page===data.pages} className="btn-ghost px-4 py-2 text-sm disabled:opacity-30">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
