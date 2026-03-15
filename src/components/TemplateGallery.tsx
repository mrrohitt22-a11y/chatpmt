"use client"

import { 
  Zap, 
  Target, 
  Search, 
  PenTool, 
  Briefcase,
  PlayCircle,
  TrendingUp,
  Mail
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const TEMPLATES = [
  {
    id: 'viral-reel',
    title: 'Viral Reel Script',
    description: 'Hook, value, and CTA structured for global audience retention.',
    icon: <PlayCircle className="h-6 w-6 text-red-500" />,
    badge: 'Trending',
    category: 'Social Media',
    color: 'from-red-500/10 to-pink-500/10',
    darkColor: 'from-white/5 to-white/10',
    presetIdea: 'Create a viral script for Instagram. Topic: How to start a side hustle with 0 investment. Include a strong hook in the first 3 seconds.',
    presetType: 'YouTube script'
  },
  {
    id: 'fb-ad-copy',
    title: 'High-ROAS FB Ad',
    description: 'Direct response copy using PAS (Problem-Agitate-Solution) framework.',
    icon: <Target className="h-6 w-6 text-blue-500" />,
    badge: 'Best Seller',
    category: 'Marketing',
    color: 'from-blue-500/10 to-cyan-500/10',
    darkColor: 'from-white/5 to-white/10',
    presetIdea: 'Write a high-converting Facebook ad copy for a luxury watch brand. Use the PAS framework. Target audience: Professionals aged 25-40.',
    presetType: 'ad copy'
  },
  {
    id: 'seo-blog',
    title: 'SEO Blog Outline',
    description: 'Structured outline with LSI keywords and H1-H3 hierarchy.',
    icon: <Search className="h-6 w-6 text-teal-500" />,
    badge: 'Essential',
    category: 'SEO',
    color: 'from-teal-500/10 to-emerald-500/10',
    darkColor: 'from-white/5 to-white/10',
    presetIdea: 'Generate a detailed SEO blog outline for the topic "Top 10 AI tools for small businesses in 2025". Include H1, H2, and H3 tags and suggested keywords.',
    presetType: 'content writing'
  },
  {
    id: 'linkedin-hook',
    title: 'Authority Hook',
    description: '5 high-impact hooks for professional LinkedIn branding.',
    icon: <Briefcase className="h-6 w-6 text-indigo-500" />,
    badge: 'New',
    category: 'Personal Brand',
    color: 'from-indigo-500/10 to-purple-500/10',
    darkColor: 'from-white/5 to-white/10',
    presetIdea: 'Write 5 scroll-stopping LinkedIn hooks for a post about "Why prompt engineering is the most important skill in 2025". Each hook should be different (e.g., controversial, question-based, data-driven).',
    presetType: 'content writing'
  },
  {
    id: 'sales-email',
    title: 'Warm Sales Outreach',
    description: 'Non-spammy outreach email that actually gets replies.',
    icon: <Mail className="h-6 w-6 text-orange-500" />,
    badge: 'Expert',
    category: 'Sales',
    color: 'from-orange-500/10 to-yellow-500/10',
    darkColor: 'from-white/5 to-white/10',
    presetIdea: 'Write a warm, personalized sales outreach email for a digital marketing agency reaching out to local restaurants. Focus on building trust, not just selling.',
    presetType: 'ad copy'
  },
  {
    id: 'startup-pitch',
    title: 'Startup Pitch Deck',
    description: 'Slide-by-slide prompt for an investor-ready presentation.',
    icon: <TrendingUp className="h-6 w-6 text-violet-500" />,
    badge: 'Premium',
    category: 'Business',
    color: 'from-violet-500/10 to-fuchsia-500/10',
    darkColor: 'from-white/5 to-white/10',
    presetIdea: 'Create a slide-by-slide structure for a startup pitch deck. The startup is an AI-based EdTech platform. Include Problem, Solution, Market Size, and Business Model slides.',
    presetType: 'business plan'
  }
];

interface TemplateGalleryProps {
  onSelect: (idea: string, type: string) => void;
}

export function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  return (
    <div id="templates" className="space-y-12 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 dark:bg-white/10 text-primary dark:text-white border border-primary/30 dark:border-white/20">
            <Zap className="h-4 w-4 fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">PRO DESIGNS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Template Library</h2>
          <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">Start with the right context. Best hooks and structures are pre-loaded for you.</p>
        </div>
        <Badge variant="outline" className="px-6 py-2 rounded-xl border-primary/30 dark:border-white/20 text-primary dark:text-white font-bold text-sm bg-white dark:bg-black shadow-sm">
          68+ More coming soon
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEMPLATES.map((template, idx) => (
          <Card 
            key={template.id} 
            className="group relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white/80 dark:bg-card backdrop-blur-md hover:-translate-y-2 active:scale-95 animate-in fade-in zoom-in-95"
            style={{ animationDelay: `${idx * 100}ms` }}
            onClick={() => onSelect(template.presetIdea, template.presetType)}
          >
            {/* Background Gradient Effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${template.color} dark:${template.darkColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <CardContent className="p-8 relative z-10 space-y-6">
              <div className="flex items-start justify-between">
                <div className="p-4 rounded-2xl bg-white dark:bg-black shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {template.icon}
                </div>
                <Badge variant="secondary" className="bg-white/90 dark:bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest border border-black/5 dark:border-white/5 shadow-sm">
                  {template.badge}
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">{template.category}</span>
                <h3 className="text-2xl font-bold group-hover:text-primary dark:group-hover:text-white transition-colors duration-300">{template.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed opacity-80">
                  {template.description}
                </p>
              </div>

              <div className="pt-4 flex items-center text-sm font-bold text-primary dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-20px] group-hover:translate-x-0">
                Use Template 
                <PenTool className="ml-2 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}