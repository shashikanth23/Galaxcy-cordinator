import { Outlet, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Telescope, Search, Star, ChevronRight, Bell, User, Menu, Calendar, Brain, Sparkles, Satellite, HelpCircle } from 'lucide-react'
import { useUIStore, useAuthStore } from '../../store/stores'
import { StarField } from '../celestial/StarField'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/',        icon: Globe,       label: 'Home',        short: 'Home' },
  { to: '/map',     icon: Telescope,   label: 'Space Map',   short: 'Map' },
  { to: '/sky',     icon: Satellite,   label: 'Sky Finder',  short: 'Sky' },
  { to: '/search',  icon: Search,      label: 'Search',      short: 'Search' },
  { to: '/galaxy',  icon: Sparkles,    label: 'Galaxies',    short: 'Galaxy' },
  { to: '/planets', icon: Star,        label: 'Planets',     short: 'Planets' },
  { to: '/nasa',    icon: Star,        label: 'NASA Feed',   short: 'NASA' },
  { to: '/ai',      icon: Brain,       label: 'AI Guide',    short: 'AI' },
  { to: '/events',  icon: Calendar,    label: 'Events',      short: 'Events' },
  { to: '/quizzes', icon: HelpCircle,  label: 'Quizzes',     short: 'Quiz' },
]

export function AppShell() {
  const { sidebarOpen, toggleSidebar, notifications } = useUIStore()
  const { user } = useAuthStore()

  return (
    <div className="flex h-screen overflow-hidden bg-void relative">
      <StarField />

      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden md:flex flex-col h-full border-r border-glassborder transition-all duration-300 z-20 relative flex-shrink-0',
        'bg-cosmos/80 backdrop-blur-xl',
        sidebarOpen ? 'w-56' : 'w-16'
      )}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-glassborder h-16">
          <div className="w-8 h-8 rounded-lg bg-aurora/20 border border-aurora/40 flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4 text-aurora" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="font-display text-sm font-bold text-gradient-aurora whitespace-nowrap">
                GALAXCY
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {({ isActive }) => (
                <div className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer',
                  isActive ? 'bg-aurora/15 text-aurora border border-aurora/30' : 'text-white/50 hover:text-white hover:bg-white/5'
                )}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap font-medium">
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <button onClick={toggleSidebar}
          className="flex items-center justify-center p-4 border-t border-glassborder text-white/30 hover:text-aurora transition-colors">
          <ChevronRight className={cn('w-4 h-4 transition-transform duration-300', sidebarOpen && 'rotate-180')} />
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-glassborder bg-cosmos/60 backdrop-blur-xl z-10 flex-shrink-0">
          <button onClick={toggleSidebar} className="md:hidden text-white/60 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <Globe className="w-5 h-5 text-aurora" />
            <span className="font-display text-sm font-bold text-gradient-aurora">GALAXCY</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <NavLink to="/search" className="text-white/50 hover:text-aurora transition-colors">
              <Search className="w-5 h-5" />
            </NavLink>
            <NavLink to="/notifications" className="relative text-white/50 hover:text-aurora transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-aurora text-void text-xs rounded-full flex items-center justify-center font-mono">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </NavLink>
            <NavLink to={user ? '/profile' : '/auth/login'}>
              {user?.avatarUrl
                ? <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-glassborder object-cover" />
                : <div className="w-8 h-8 rounded-full bg-stellar/50 border border-glassborder flex items-center justify-center">
                    <User className="w-4 h-4 text-white/50" />
                  </div>
              }
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex border-t border-glassborder bg-cosmos/90 backdrop-blur-xl safe-bottom z-20 flex-shrink-0">
          {navItems.slice(0, 5).map(({ to, icon: Icon, short }) => (
            <NavLink key={to} to={to} end={to === '/'} className="flex-1">
              {({ isActive }) => (
                <div className={cn('flex flex-col items-center gap-1 py-2 text-xs transition-colors', isActive ? 'text-aurora' : 'text-white/40')}>
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px]">{short}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
