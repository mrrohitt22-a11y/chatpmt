"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Mail, Github, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { user, isLoading: isUserLoading } = useSupabaseAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Handle successful login and profile creation
  useEffect(() => {
    if (user && !isUserLoading) {
      const initializeProfileAndRedirect = async () => {
        try {
          // Initialize user profile in Supabase Database
          const { error } = await supabase
            .from('userProfiles')
            .upsert({
              id: user.id,
              email: user.email || '',
              displayName: user.user_metadata?.full_name || displayName || 'Creative User',
              preferredLanguage: 'English',
              remainingDailyFreePrompts: 3,
              lastFreePromptResetDate: new Date().toISOString(),
              creditsBalance: 0,
              updatedAt: new Date().toISOString()
            }, { onConflict: 'id' });
            
          if (error) {
            console.error("Profile initialization failed:", error);
          }
          
          router.push('/');
        } catch (error: any) {
          console.error("Profile setup error:", error);
          router.push('/'); // Redirect anyway so user isn't stuck
        }
      };
      initializeProfileAndRedirect();
    }
  }, [user, isUserLoading, router, displayName]);

  const handleAuthError = (error: any) => {
    setIsLoading(false);
    
    let message = error?.message || "An error occurred during authentication.";
    if (message.toLowerCase().includes('already registered')) message = "Email already registered. Try logging in.";
    if (message.toLowerCase().includes('invalid')) message = "Invalid email or password.";
    
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: message,
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && !agreeTerms) {
      toast({ title: "Action Required", description: "Please agree to the Terms and Conditions." });
      return;
    }
    
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName || email.split('@')[0],
            }
          }
        });
        if (error) throw error;
        toast({ title: "Success", description: "Account created! Please verify your email if needed, or you are logged in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : '',
        }
      });
      if (error) throw error;
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : '',
        }
      });
      if (error) throw error;
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto max-w-md px-4 py-20 flex flex-col items-center">
        <div className="w-full space-y-8">
          <div className="text-left space-y-2">
            <h1 className="text-3xl font-bold text-black">{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setShowEmailForm(false); }}
                className="text-black font-semibold underline hover:text-primary transition-colors"
              >
                {mode === 'signup' ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-14 font-semibold text-base flex items-center justify-center gap-3 border-border hover:bg-muted/50 transition-all rounded-xl"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <Button 
              variant="outline" 
              className="w-full h-14 font-semibold text-base flex items-center justify-center gap-3 border-border hover:bg-muted/50 transition-all rounded-xl"
              onClick={handleGithubLogin}
              disabled={isLoading}
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </Button>

            {!showEmailForm ? (
              <Button 
                variant="outline" 
                className="w-full h-14 font-semibold text-base flex items-center justify-center gap-3 border-border hover:bg-muted/50 transition-all rounded-xl"
                onClick={() => setShowEmailForm(true)}
                disabled={isLoading}
              >
                <Mail className="h-5 w-5" />
                Continue with Email
              </Button>
            ) : (
              <form onSubmit={handleEmailAuth} className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {mode === 'signup' && (
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Name</Label>
                    <Input id="name" placeholder="John Doe" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="h-12 border-muted rounded-xl" />
                  </div>
                )}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 border-muted rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 border-muted rounded-xl" />
                </div>
                <Button className="w-full font-bold h-12 bg-black text-white hover:bg-black/90 rounded-xl" type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (mode === 'signup' ? 'Create Account' : 'Sign In')}
                </Button>
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={() => setShowEmailForm(false)}>
                  Cancel
                </Button>
              </form>
            )}
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="text-center">
            <Button 
              variant="ghost" 
              className="text-sm font-semibold text-black hover:bg-muted/50 w-full h-12 rounded-xl gap-2" 
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              <UserCircle className="h-4 w-4" />
              Try as Guest
            </Button>
          </div>

          <div className="space-y-4 pt-6">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={agreeTerms} 
                onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-tight">
                I agree to the <span className="text-black underline cursor-pointer">Terms and Conditions</span> and <span className="text-black underline cursor-pointer">Privacy Policy</span>.
              </Label>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
