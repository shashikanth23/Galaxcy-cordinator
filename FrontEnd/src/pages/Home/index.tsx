import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Telescope, Brain, Calendar, Satellite } from 'lucide-react';
import { nasaApi, celestialApi, eventsApi } from '../../api/client';
import { formatDistance, typeBadgeClass } from '../../lib/utils';
import { format } from 'date-fns';

const EVENT_EMOJI: Record<string,string> = {
  METEOR_SHOWER:'🌠',SOLAR_ECLIPSE:'🌑',LUNAR_ECLIPSE:'🌕',PLANETARY_ALIGNMENT:'🪐',
  ROCKET_LAUNCH:'🚀',ISS_PASS:'🛰️',SUPERMOON:'🌕',AURORA:'🌌',CONJUNCTION:'✨',
  OPPOSITION:'🔭',COMET_VISIBLE:'☄️',
};

export default function HomePage() {
  const { data: apod }     = useQuery({ queryKey:['apod'],     queryFn:()=>nasaApi.apod().then(r=>r.data) });
  const { data: featured } = useQuery({ queryKey:['featured'], queryFn:()=>celestialApi.featured().then(r=>r.data) });
  const { data: events }   = useQuery({ queryKey:['upcoming'], queryFn:()=>eventsApi.upcoming().then(r=>r.data) });

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Hero */}
      <section className="relative px-4 md:px-8 pt-12 pb-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-aurora/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-nova/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <span className="badge-aurora mb-4 inline-flex">🌌 Space Exploration Platform</span>
          </motion.div>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
            className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
            Explore the{' '}
            <span className="text-gradient-aurora">Universe</span>
            <br />in Your Pocket
          </motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
            className="text-white/50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time star maps, AI astronomy assistant, NASA data, and an interactive
            3D universe — all from your smartphone.
          </motion.p>
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
            className="flex flex-wrap justify-center gap-3">
            <Link to="/map" className="btn-primary text-base px-7 py-3">
              <Globe className="w-4 h-4" /> Explore Map
            </Link>
            <Link to="/sky" className="btn-ghost text-base px-7 py-3">
              <Telescope className="w-4 h-4" /> Sky Finder
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick nav */}
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {to:'/map',    icon:Globe,     label:'Space Map',   desc:'3D Universe',   color:'aurora'},
            {to:'/sky',    icon:Satellite, label:'Sky Finder',  desc:'AR Camera',     color:'nova'},
            {to:'/ai',     icon:Brain,     label:'AI Guide',    desc:'Ask Anything',  color:'quasar'},
            {to:'/events', icon:Calendar,  label:'Events',      desc:"What's Coming", color:'pulsar'},
          ].map(({to,icon:Icon,label,desc,color})=>(
            <Link key={to} to={to}>
              <motion.div whileHover={{scale:1.03,translateY:-4}}
                className="glass-card p-5 h-full cursor-pointer hover:border-white/20 transition-all duration-200">
                <div className={`w-10 h-10 rounded-xl bg-${color}/15 border border-${color}/30 flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 text-${color}`} />
                </div>
                <p className="font-semibold text-white text-sm mb-1">{label}</p>
                <p className="text-white/40 text-xs">{desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* APOD */}
      {apod && (
        <section className="px-4 md:px-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">🌌 Astronomy Picture of the Day</h2>
              <Link to="/nasa" className="text-aurora/70 hover:text-aurora text-sm flex items-center gap-1 transition-colors">
                See more <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} className="glass-card overflow-hidden md:flex">
              <div className="md:w-2/5 h-56 md:h-auto flex-shrink-0">
                {apod.mediaType==='image'
                  ? <img src={apod.url} alt={apod.title} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full bg-stellar/30 flex items-center justify-center text-4xl">🎬</div>
                }
              </div>
              <div className="p-6 flex flex-col justify-center">
                <span className="badge-aurora mb-3 self-start">{apod.date}</span>
                <h3 className="text-xl font-bold text-white mb-3">{apod.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-4">{apod.explanation}</p>
                {apod.copyright && <p className="text-white/30 text-xs mt-3">© {apod.copyright}</p>}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured objects */}
      {featured?.length > 0 && (
        <section className="px-4 md:px-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">⭐ Featured Objects</h2>
              <Link to="/search" className="text-aurora/70 hover:text-aurora text-sm flex items-center gap-1 transition-colors">
                Browse all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {featured.map((obj:any,i:number)=>(
                <motion.div key={obj.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} transition={{delay:i*0.05}}>
                  <Link to={`/object/${obj.slug}`}>
                    <div className="glass-card p-0 overflow-hidden group hover:border-white/20 hover:-translate-y-1 transition-all duration-200">
                      <div className="h-32 bg-stellar/30 relative overflow-hidden">
                        {obj.imageUrls?.[0]
                          ? <img src={obj.imageUrls[0]} alt={obj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                          : <div className="w-full h-full flex items-center justify-center text-4xl">
                              {obj.type==='STAR'?'⭐':obj.type==='PLANET'?'🪐':obj.type==='GALAXY'?'🌌':obj.type==='NEBULA'?'🌫️':'✨'}
                            </div>
                        }
                        <div className="absolute bottom-2 left-2">
                          <span className={typeBadgeClass(obj.type)}>{obj.type}</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-sm text-white truncate">{obj.name}</p>
                        <p className="text-white/40 text-xs mt-0.5">{formatDistance(obj.distanceFromEarth)}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {events?.length > 0 && (
        <section className="px-4 md:px-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">🗓️ Upcoming Events</h2>
              <Link to="/events" className="text-aurora/70 hover:text-aurora text-sm flex items-center gap-1 transition-colors">
                All events <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {events.map((ev:any)=>(
                <Link key={ev.id} to="/events">
                  <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}}
                    className="glass-card p-4 flex items-center gap-4 hover:border-white/20 transition-all duration-200">
                    <span className="text-3xl">{EVENT_EMOJI[ev.type]||'🌠'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">{ev.title}</p>
                      <p className="text-white/40 text-xs mt-0.5">{format(new Date(ev.startTime),'PPp')}</p>
                    </div>
                    <span className="badge-nova text-xs shrink-0">{ev.type.replace(/_/g,' ')}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[['2M+','Celestial Objects'],['Real-time','ISS Tracking'],['10+','NASA APIs'],['AI','Astronomy Assistant']].map(([v,l])=>(
                <div key={l}>
                  <p className="font-display text-2xl md:text-3xl font-bold text-gradient-aurora">{v}</p>
                  <p className="text-white/40 text-sm mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
