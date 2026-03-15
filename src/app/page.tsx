"use client"

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { PromptWalaMain as ChatPMTMain } from '@/components/PromptWalaMain';
import { TemplateGallery } from '@/components/TemplateGallery';
import { Toaster } from '@/components/ui/toaster';
import { Sparkles, MessageSquareText, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [templateData, setTemplateData] = useState<{idea: string, type: string} | null>(null);

  const handleTemplateSelect = (idea: string, type: string) => {
    setTemplateData({ idea, type });
    const toolSection = document.getElementById('tool-main');
    if (toolSection) {
      toolSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen pb-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background dark:from-white/5 dark:to-background">
      <Navigation />
      
      {/* Hero Header */}
      <section className="container mx-auto px-4 py-12 md:py-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground dark:text-white border border-primary/30 animate-in fade-in zoom-in duration-700 font-bold shadow-sm">
          <Zap className="h-4 w-4 fill-current" />
          <span className="text-sm uppercase tracking-wider">World Class AI Prompt Tool</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground max-w-5xl mx-auto leading-[0.95]">
          Write your idea, AI prompt <br/>
          <span className="text-primary dark:text-white italic relative">
            we'll build it.
            <div className="absolute -bottom-4 left-0 w-full h-2 bg-primary/30 dark:bg-white/10 rounded-full blur-md" />
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Convert your casual ideas into high-quality, professional AI prompts in seconds.
        </p>

        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">10k+</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Prompts Made</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold">4.9/5</div>
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-widest">User Rating</div>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="container mx-auto px-4 -mt-8" id="tool-main">
        <ChatPMTMain presetIdea={templateData?.idea} presetType={templateData?.type} />
      </section>

      {/* Premium Templates */}
      <section className="container mx-auto px-4 mt-32">
        <TemplateGallery onSelect={handleTemplateSelect} />
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 mt-40 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">Everything you need to <br/> scale your <span className="text-primary dark:text-white">Content Game</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 space-y-6 hover:shadow-2xl transition-all group">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquareText className="h-7 w-7 text-primary dark:text-white" />
            </div>
            <h3 className="text-2xl font-bold">Global Standards</h3>
            <p className="text-muted-foreground leading-relaxed">Our engine understands native nuances and converts them into structured global prompt standards.</p>
          </div>
          
          <div className="p-10 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 space-y-6 hover:shadow-2xl transition-all group">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="h-7 w-7 text-primary dark:text-white" />
            </div>
            <h3 className="text-2xl font-bold">Expert Reasoning</h3>
            <p className="text-muted-foreground leading-relaxed">We don't just add words. Our AI applies prompt engineering frameworks like Persona-Context-Output to every single request.</p>
          </div>

          <div className="p-10 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 space-y-6 hover:shadow-2xl transition-all group">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-7 w-7 text-primary dark:text-white" />
            </div>
            <h3 className="text-2xl font-bold">Privacy First</h3>
            <p className="text-muted-foreground leading-relaxed">Your business ideas and content strategies are your own. We encrypt all creative inputs for absolute security.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 mt-48 pt-12 border-t border-muted">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-primary dark:bg-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 dark:shadow-white/10">
                <Sparkles className="h-5 w-5 text-primary-foreground dark:text-black" />
              </div>
              <span className="font-bold text-2xl">ChatPMT</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Helping creators and businesses win at AI with professional prompt engineering. Just write your idea, we'll provide the prompt.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary dark:hover:text-white transition-colors">Templates</a></li>
              <li><a href="/pricing" className="hover:text-primary dark:hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-white transition-colors">Marketplace</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary dark:hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-muted py-8 text-center text-sm text-muted-foreground">
          © 2024 ChatPMT AI. Built for the Next Generation.
        </div>
      </footer>

      <Toaster />
    </main>
  );
}