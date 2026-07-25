import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Heart, Eye, List, LogOut, Settings } from 'lucide-react';
import { userApi } from '../../api/client';
import { useAuthStore } from '../../store/stores';
import { typeBadgeClass } from '../../lib/utils';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [tab, setTab] = useState<'favorites'|'observations'|'watchlists'>('favorites');

  const { data: favorites } = useQuery({ queryKey:['favorites'], queryFn:()=>userApi.getFavorites().then(r=>r.data), enabled:tab==='favorites' });
  const { data: observations } = useQuery({ queryKey:['observations'], queryFn:()=>userApi.getObservations().then(r=>r.data), enabled:tab==='observations' });
  const { data: watchlists } = useQuery({ queryKey:['watchlists'], queryFn:()=>userApi.getWatchlists().then(r=>r.data), enabled:tab==='watchlists' });

  if (!user) return <div className="flex items-center justify-center h-full"><Link to="/auth/login" className="btn-primary">Sign In</Link></div>;

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto">
      <div className="glass-card p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-aurora/20 border-2 border-aurora/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover"/> : <User className="w-8 h-8 text-aurora"/>}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{user.name}</h1>
          <p className="text-white/40 text-sm truncate">{user.email}</p>
          <span className={`badge mt-2 inline-flex ${user.plan==='FREE'?'badge-aurora':'badge-nova'}`}>{user.plan} PLAN</span>
        </div>
        <button onClick={logout} className="btn-ghost px-3 py-2 text-sm text-pulsar/70 hover:text-pulsar hover:border-pulsar/30 flex-shrink-0">
          <LogOut className="w-4 h-4"/>
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {([['favorites','Favorites',Heart],['observations','Observations',Eye],['watchlists','Watchlists',List]] as const).map(([key,label,Icon])=>(
          <button key={key} onClick={()=>setTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-all ${tab===key?'bg-aurora/20 text-aurora border border-aurora/40':'text-white/40 hover:text-white border border-transparent'}`}>
            <Icon className="w-4 h-4"/>{label}
          </button>
        ))}
      </div>

      {tab==='favorites' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {favorites?.map((obj:any)=>(
            <Link key={obj.id} to={`/object/${obj.slug}`}>
              <motion.div whileHover={{scale:1.02}} className="glass-card overflow-hidden hover:border-white/20 transition-all">
                <div className="h-24 bg-stellar/30 flex items-center justify-center overflow-hidden">
                  {obj.imageUrls?.[0]?<img src={obj.imageUrls[0]} alt="" className="w-full h-full object-cover"/>:<span className="text-3xl">⭐</span>}
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-medium truncate">{obj.name}</p>
                  <span className={`${typeBadgeClass(obj.type)} text-xs mt-1`}>{obj.type}</span>
                </div>
              </motion.div>
            </Link>
          ))}
          {(!favorites||favorites.length===0)&&<div className="col-span-4 text-center py-12 text-white/30">No favorites yet. Explore and ❤️ objects!</div>}
        </div>
      )}
      {tab==='observations' && (
        <div className="space-y-3">
          {observations?.map((obs:any)=>(
            <div key={obs.id} className="glass-card p-4">
              <p className="font-medium text-white">{obs.title}</p>
              <p className="text-white/40 text-xs mt-1">{new Date(obs.observedAt).toLocaleDateString()} · {obs.object?.name||obs.locationName||'General observation'}</p>
              {obs.notes&&<p className="text-white/50 text-sm mt-2 line-clamp-2">{obs.notes}</p>}
            </div>
          ))}
          {(!observations||observations.length===0)&&<div className="text-center py-12 glass-card text-white/30">No observations logged yet. Start stargazing!</div>}
        </div>
      )}
      {tab==='watchlists' && (
        <div className="space-y-3">
          {watchlists?.map((wl:any)=>(
            <div key={wl.id} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-white">{wl.name}</p>
                <span className="text-white/30 text-xs">{wl._count?.items||0} items</span>
              </div>
              {wl.description&&<p className="text-white/40 text-sm">{wl.description}</p>}
            </div>
          ))}
          {(!watchlists||watchlists.length===0)&&<div className="text-center py-12 glass-card text-white/30">No watchlists yet.</div>}
        </div>
      )}
    </div>
  );
}
