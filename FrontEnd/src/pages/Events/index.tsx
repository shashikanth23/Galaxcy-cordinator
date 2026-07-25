import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { eventsApi } from '../../api/client';
import { format } from 'date-fns';

const TYPE_EMOJI: Record<string,string> = {
  METEOR_SHOWER:'🌠',SOLAR_ECLIPSE:'🌑',LUNAR_ECLIPSE:'🌕',PLANETARY_ALIGNMENT:'🪐',
  ROCKET_LAUNCH:'🚀',ISS_PASS:'🛰️',SUPERMOON:'🌕',AURORA:'🌌',CONJUNCTION:'✨',
  OPPOSITION:'🔭',TRANSIT:'⭕',COMET_VISIBLE:'☄️',
};

export default function EventsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['events-all'],
    queryFn: () => eventsApi.list({ upcoming: true }).then(r => r.data),
  });

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto">
      <h1 className="section-title mb-2">🗓️ Space Events</h1>
      <p className="text-white/50 mb-8">Upcoming astronomical events worldwide</p>
      {isLoading ? (
        <div className="space-y-3">{Array(5).fill(0).map((_,i)=><div key={i} className="glass-card h-24 animate-pulse"/>)}</div>
      ) : data?.events?.length > 0 ? (
        <div className="space-y-3">
          {data.events.map((ev: any, i: number) => (
            <motion.div key={ev.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
              <div className="glass-card p-5 hover:border-white/20 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl flex-shrink-0">{TYPE_EMOJI[ev.type]||'🌠'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <h3 className="font-semibold text-white">{ev.title}</h3>
                      <span className="badge-nova text-xs flex-shrink-0">{ev.type.replace(/_/g,' ')}</span>
                    </div>
                    {ev.description && <p className="text-white/50 text-sm mt-1 line-clamp-2">{ev.description}</p>}
                    <div className="flex items-center gap-4 mt-3 flex-wrap">
                      <span className="text-aurora text-xs font-mono">{format(new Date(ev.startTime),'PPp')}</span>
                      {ev.isGlobal && <span className="badge-quasar">🌍 Global</span>}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-white/50">No upcoming events. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
