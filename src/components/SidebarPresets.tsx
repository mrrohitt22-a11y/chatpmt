import { Dumbbell, Building2, ShoppingCart, Youtube, Smartphone, Briefcase } from 'lucide-react';

const PRESETS = [
  { id: 'gym', label: 'Gym & Fitness', icon: Dumbbell, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'real-estate', label: 'Real Estate', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'youtube', label: 'YouTube Content', icon: Youtube, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'instagram', label: 'Instagram Reels', icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'business', label: 'Agency / Business', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export function SidebarPresets() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">Industry Presets</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-transparent hover:border-primary/20 hover:shadow-md transition-all active:scale-95"
          >
            <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${preset.bg}`}>
              <preset.icon className={`h-6 w-6 ${preset.color}`} />
            </div>
            <span className="text-xs font-semibold text-center group-hover:text-primary transition-colors">{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}