"use client"

import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Settings2,
  Zap,
  Star,
  Trophy,
  Loader2,
  Trash2,
  Bot,
  Code2,
  Globe,
  Rocket,
  Terminal,
  Layers,
  Search,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { 
  generateHighQualityPrompt, 
} from '@/ai/flows/generate-high-quality-prompt';
import { 
  refinePrompt, 
} from '@/ai/flows/reasoning-enhanced-prompt-refinement';
import { 
  detectLanguageAndTranslatePrompt,
} from '@/ai/flows/detect-language-and-translate-prompt';
import Link from 'next/link';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { useFirestore } from '@/firebase/provider';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const PROMPT_TYPES = [
  { value: 'content writing', label: 'Content Writing', icon: '📝' },
  { value: 'YouTube script', label: 'YouTube Script', icon: '🎥' },
  { value: 'ad copy', label: 'Ad Copy', icon: '📢' },
  { value: 'business plan', label: 'Business Plan', icon: '💼' },
  { value: 'image/video prompt', label: 'AI Image/Video', icon: '🎨' },
  { value: 'coding/app idea', label: 'Coding & Apps', icon: '💻' },
];

const QUALITY_LEVELS = [
  { value: 'Basic', label: 'Basic', icon: <Zap className="h-3 w-3" />, color: 'bg-muted', pro: false },
  { value: 'Advanced', label: 'Advanced', icon: <Star className="h-3 w-3" />, color: 'bg-primary/20', pro: true },
  { value: 'Expert', label: 'Expert / Viral', icon: <Trophy className="h-3 w-3" />, color: 'bg-primary', pro: true },
];

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
];

const AI_TARGETS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/?q=', icon: <Bot className="h-4 w-4" />, category: 'AI Chat' },
  { name: 'Gemini', url: 'https://gemini.google.com/app?q=', icon: <Sparkles className="h-4 w-4" />, category: 'AI Chat' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/?q=', icon: <Search className="h-4 w-4" />, category: 'AI Chat' },
  { name: 'Claude', url: 'https://claude.ai/new', icon: <Layers className="h-4 w-4" />, category: 'AI Chat' },
  { name: 'Bolt.new', url: 'https://bolt.new', icon: <Zap className="h-4 w-4" />, category: 'Development' },
  { name: 'Lovable', url: 'https://lovable.dev', icon: <Rocket className="h-4 w-4" />, category: 'Development' },
  { name: 'Replit', url: 'https://replit.com', icon: <Terminal className="h-4 w-4" />, category: 'Development' },
  { name: 'Cursor', url: 'https://cursor.com', icon: <Code2 className="h-4 w-4" />, category: 'Development' },
  { name: 'v0.dev', url: 'https://v0.dev', icon: <Globe className="h-4 w-4" />, category: 'UI/UX' },
];

interface PromptWalaMainProps {
  presetIdea?: string;
  presetType?: string;
}

export function PromptWalaMain({ presetIdea, presetType }: PromptWalaMainProps) {
  const [idea, setIdea] = useState('');
  const [promptType, setPromptType] = useState('content writing');
  const [qualityLevel, setQualityLevel] = useState<'Basic' | 'Advanced' | 'Expert'>('Basic');
  const [targetLanguage, setTargetLanguage] = useState<'English' | 'Spanish' | 'French'>('English');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const { user } = useFirebaseAuth();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsProfileLoading(true);
      const loadProfile = async () => {
        try {
          const profileRef = doc(firestore, 'userProfiles', user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data());
          }
        } catch (e) {
          console.error("Error loading profile", e);
        } finally {
          setIsProfileLoading(false);
        }
      };
      loadProfile();
    }
  }, [user, firestore]);

  const credits = userProfile?.remainingDailyFreePrompts ?? 3;
  const isPro = userProfile?.creditsBalance ? userProfile.creditsBalance > 0 : false;

  useEffect(() => {
    if (presetIdea) setIdea(presetIdea);
    if (presetType) setPromptType(presetType);
  }, [presetIdea, presetType]);

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to use the tool and save history.",
        action: <Link href="/login"><Button size="sm" className="bg-primary text-primary-foreground font-bold">Login</Button></Link>
      });
      return;
    }

    if (!idea.trim()) {
      toast({
        title: "Empty Idea?",
        description: "Please write something first!",
        variant: "destructive"
      });
      return;
    }

    if (!isPro) {
      if (qualityLevel !== 'Basic') {
        toast({
          title: "Pro Feature",
          description: "Advanced and Expert features require a Pro plan.",
          variant: "destructive",
          action: (
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="font-bold border-primary text-primary hover:bg-primary/10">Upgrade</Button>
            </Link>
          )
        });
        return;
      }

      if (credits <= 0) {
        toast({
          title: "Credits Exhausted!",
          description: "Your daily free prompts are finished. Upgrade to Pro for unlimited access.",
          variant: "destructive",
          action: (
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="font-bold border-primary text-primary hover:bg-primary/10">Join Pro</Button>
            </Link>
          )
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      let generatedText = '';
      
      if (qualityLevel === 'Expert') {
        const res = await refinePrompt({ idea, promptType, qualityLevel });
        generatedText = res.refinedPrompt;
      } else {
        const res = await generateHighQualityPrompt({ idea, promptType, qualityLevel });
        generatedText = res.prompt;
      }

      if (targetLanguage !== 'English') {
        const translation = await detectLanguageAndTranslatePrompt({ 
          text: generatedText, 
          targetLanguage 
        } as any);
        generatedText = translation.translatedPrompt;
      }

      setResult(generatedText);

      // Save to Firestore
      if (user) {
        try {
          await addDoc(collection(firestore, 'prompts'), {
            userId: user.uid,
            inputIdea: idea,
            generatedPromptText: generatedText,
            promptType,
            qualityLevel,
            outputLanguage: targetLanguage,
            createdAt: new Date().toISOString(),
            isArchived: false,
            detectedInputLanguage: 'unknown'
          });
        } catch (err) {
          console.error("Failed to save history to Firestore:", err);
        }
      }
      
      toast({
        title: "Prompt Ready!",
        description: isPro ? "Professional prompt generated and saved." : `Remaining credits: ${credits - 1}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Something Went Wrong",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const redirectToTool = (baseUrl: string) => {
    if (!result) return;
    const url = baseUrl.includes('?q=') ? `${baseUrl}${encodeURIComponent(result)}` : baseUrl;
    navigator.clipboard.writeText(result);
    window.open(url, '_blank');
    toast({
      title: "Opening Tool",
      description: "Prompt copied to clipboard. Just paste it in the AI tool.",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Input Section */}
      <div className="lg:col-span-7 space-y-6">
        <Card className="border-none shadow-2xl shadow-primary/10 dark:shadow-white/5 bg-white/80 dark:bg-card backdrop-blur-md transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-primary/30 dark:bg-white/10 rounded-lg">
                  <Settings2 className="h-5 w-5 text-primary-foreground dark:text-white" />
                </div>
                Build Your Prompt
              </CardTitle>
              {!isPro && user && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-[10px] font-bold uppercase tracking-widest border border-border animate-pulse">
                  {credits} / 3 Daily Credits Left
                </div>
              )}
            </div>
            <CardDescription>
              Describe your idea, we'll make it professional.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Your Idea</label>
              <Textarea 
                placeholder="e.g., I need a diet plan for weight gain focused on high protein..."
                className="min-h-[160px] resize-none text-base border-primary/20 dark:border-white/10 focus-visible:ring-primary bg-white/50 dark:bg-black/20 transition-all duration-300 hover:border-primary/40 dark:hover:border-white/30"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Prompt Type</label>
                <Select value={promptType} onValueChange={setPromptType}>
                  <SelectTrigger className="border-primary/20 dark:border-white/10 bg-white/50 dark:bg-black/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/20 dark:border-white/10 shadow-xl">
                    {PROMPT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="rounded-lg">
                        <span className="mr-2">{type.icon}</span> {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Output Language</label>
                <Select value={targetLanguage} onValueChange={(v: any) => setTargetLanguage(v)}>
                  <SelectTrigger className="border-primary/20 dark:border-white/10 bg-white/50 dark:bg-black/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/20 dark:border-white/10 shadow-xl">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="rounded-lg">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center justify-between">
                Quality Level
                {!isPro && <span className="text-[10px] font-bold text-primary dark:text-white flex items-center gap-1"><Lock className="h-2 w-2"/> PRO EXCLUSIVE</span>}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {QUALITY_LEVELS.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => setQualityLevel(q.value as any)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden active:scale-95 hover:scale-105",
                      qualityLevel === q.value 
                        ? 'border-primary dark:border-white bg-primary dark:bg-white shadow-lg scale-105' 
                        : 'border-transparent bg-muted/40 hover:bg-muted/60'
                    )}
                  >
                    {!isPro && q.pro && (
                      <div className="absolute top-2 right-2">
                        <Lock className="h-3 w-3 opacity-40" />
                      </div>
                    )}
                    <div className={cn(
                      "p-2 rounded-full transition-all duration-300",
                      qualityLevel === q.value ? 'bg-white dark:bg-black text-primary dark:text-white' : q.color
                    )}>
                      {q.icon}
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest transition-colors",
                      qualityLevel === q.value ? 'text-primary-foreground dark:text-black' : 'text-muted-foreground'
                    )}>
                      {q.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 dark:shadow-white/5 hover:shadow-primary/40 dark:hover:shadow-white/10 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 bg-primary dark:bg-white text-primary-foreground dark:text-black border-none"
              onClick={handleGenerate}
              disabled={isLoading || isProfileLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  Crafting Perfection...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-6 w-6" />
                  {user ? "Generate High-Value Prompt" : "Login to Generate"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Result Section */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="h-full border-none shadow-2xl bg-primary dark:bg-card text-primary-foreground dark:text-white overflow-hidden transition-all duration-500 hover:shadow-primary/20 dark:hover:shadow-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <Zap className="h-5 w-5 text-black dark:text-white fill-current" />
                The Output
              </CardTitle>
            </div>
            {result && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 border-none transition-soft"
                onClick={() => setResult('')}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)] flex flex-col gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-2xl blur-2xl group-hover:bg-white/40 dark:group-hover:bg-black/40 transition-all opacity-40" />
              <div className="relative h-full min-h-[300px] w-full bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/10 p-5 font-mono text-sm overflow-auto scrollbar-hide text-black dark:text-white font-medium transition-soft group-hover:bg-white/90 dark:group-hover:bg-black/60">
                {result ? (
                  <p className="whitespace-pre-wrap leading-relaxed animate-in fade-in zoom-in-95 duration-700 text-black dark:text-white">
                    {result}
                  </p>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-black/60 dark:text-white/60 animate-in fade-in duration-1000">
                    <Bot className="h-16 w-16 text-black dark:text-white opacity-40 animate-bounce duration-[2000ms]" />
                    <p className="text-lg font-bold text-black dark:text-white">
                      Ready for Magic? <br/>
                      <span className="text-sm font-medium opacity-70">Type your idea and click Generate.</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div className="grid grid-cols-2 gap-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Button 
                  onClick={copyToClipboard}
                  className="h-14 bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 font-bold border-none rounded-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                >
                  {isCopied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                  {isCopied ? 'Copied' : 'Copy Prompt'}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      className="h-14 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white font-bold rounded-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Quick Open
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl shadow-3xl border-primary/20 dark:border-white/10 animate-in zoom-in-95 duration-300">
                    <DropdownMenuLabel className="px-4 py-3">Import Prompt To...</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Assistants</div>
                    {AI_TARGETS.filter(t => t.category === 'AI Chat').map(target => (
                      <DropdownMenuItem key={target.name} onClick={() => redirectToTool(target.url)} className="cursor-pointer px-4 py-3 hover:bg-primary/10 dark:hover:bg-white/10 rounded-lg mx-1 transition-soft">
                        {target.icon} <span className="ml-3 font-semibold">{target.name}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dev Tools</div>
                    {AI_TARGETS.filter(t => t.category === 'Development' || t.category === 'UI/UX').map(target => (
                      <DropdownMenuItem key={target.name} onClick={() => redirectToTool(target.url)} className="cursor-pointer px-4 py-3 hover:bg-primary/10 dark:hover:bg-white/10 rounded-lg mx-1 transition-soft">
                        {target.icon} <span className="ml-3 font-semibold">{target.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}