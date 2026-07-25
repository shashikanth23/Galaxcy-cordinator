import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { useAuthStore } from './store/stores'
import { AppShell } from './components/layout/AppShell'

const HomePage             = lazy(() => import('./pages/Home/index'))
const SpaceMapPage         = lazy(() => import('./pages/SpaceMap/index'))
const SkyFinderPage        = lazy(() => import('./pages/SkyFinder/index'))
const SearchPage           = lazy(() => import('./pages/Search/index'))
const GalaxyExplorerPage   = lazy(() => import('./pages/GalaxyExplorer/index'))
const PlanetDatabasePage   = lazy(() => import('./pages/PlanetDatabase/index'))
const NasaFeedPage         = lazy(() => import('./pages/NasaFeed/index'))
const AIAssistantPage      = lazy(() => import('./pages/AIAssistant/index'))
const EventsPage           = lazy(() => import('./pages/Events/index'))
const QuizzesPage          = lazy(() => import('./pages/Quizzes/index'))
const ProfilePage          = lazy(() => import('./pages/Profile/index'))
const CelestialDetailPage  = lazy(() => import('./pages/CelestialDetail/index'))
const LoginPage            = lazy(() => import('./pages/Auth/index').then(m => ({ default: m.LoginPage })))
const RegisterPage         = lazy(() => import('./pages/Auth/index').then(m => ({ default: m.RegisterPage })))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5*60*1000, gcTime: 30*60*1000, retry: 1, refetchOnWindowFocus: false } },
})

const Loader = () => (
  <div className="flex items-center justify-center h-screen bg-void">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-aurora border-t-transparent rounded-full animate-spin"/>
      <p className="text-aurora/70 font-mono text-sm tracking-widest">LOADING...</p>
    </div>
  </div>
)

const Protected = ({ children }: { children: React.ReactNode }) => {
  const ok = useAuthStore(s => s.isAuthenticated)
  return ok ? <>{children}</> : <Navigate to="/auth/login" replace/>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loader/>}>
          <Routes>
            <Route path="/auth/login"    element={<LoginPage/>}/>
            <Route path="/auth/register" element={<RegisterPage/>}/>
            <Route element={<AppShell/>}>
              <Route path="/"              element={<HomePage/>}/>
              <Route path="/map"           element={<SpaceMapPage/>}/>
              <Route path="/sky"           element={<SkyFinderPage/>}/>
              <Route path="/search"        element={<SearchPage/>}/>
              <Route path="/galaxy"        element={<GalaxyExplorerPage/>}/>
              <Route path="/planets"       element={<PlanetDatabasePage/>}/>
              <Route path="/nasa"          element={<NasaFeedPage/>}/>
              <Route path="/ai"            element={<AIAssistantPage/>}/>
              <Route path="/events"        element={<EventsPage/>}/>
              <Route path="/quizzes"       element={<QuizzesPage/>}/>
              <Route path="/object/:slug"  element={<CelestialDetailPage/>}/>
              <Route path="/profile"       element={<Protected><ProfilePage/></Protected>}/>
            </Route>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
