export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDistance(ly?: number | null): string {
  if (!ly) return 'Unknown';
  if (ly < 0.001) return `${(ly * 63241).toFixed(0)} AU`;
  if (ly < 1) return `${(ly * 63241).toFixed(0)} AU`;
  if (ly < 1000) return `${ly.toFixed(1)} ly`;
  if (ly < 1e6) return `${(ly / 1000).toFixed(1)} kly`;
  if (ly < 1e9) return `${(ly / 1e6).toFixed(1)} Mly`;
  return `${(ly / 1e9).toFixed(1)} Gly`;
}

export function formatTemp(k?: number | null): string {
  if (!k) return 'Unknown';
  if (k < 1000) return `${k.toFixed(0)} K`;
  return `${(k / 1000).toFixed(1)}K K`;
}

export function typeColor(type: string): string {
  const map: Record<string, string> = {
    STAR: 'aurora', PLANET: 'nova', MOON: 'text-white/60',
    GALAXY: 'pulsar', NEBULA: 'quasar', BLACK_HOLE: 'text-red-400',
    COMET: 'nova', ASTEROID: 'text-orange-400',
  };
  return map[type] || 'aurora';
}

export function typeBadgeClass(type: string): string {
  const map: Record<string, string> = {
    STAR: 'badge-aurora', PLANET: 'badge-nova', GALAXY: 'badge-pulsar',
    NEBULA: 'badge-quasar', BLACK_HOLE: 'bg-red-500/15 text-red-400 border border-red-400/30 badge',
    MOON: 'bg-white/10 text-white/60 border border-white/20 badge',
    COMET: 'badge-nova', ASTEROID: 'bg-orange-500/15 text-orange-400 border border-orange-400/30 badge',
  };
  return map[type] || 'badge-aurora';
}
