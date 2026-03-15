"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, History, Menu, LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { useAuth } from '@/firebase/provider';
import { signOut } from 'firebase/auth';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HistorySheet } from '@/components/HistorySheet';

export function Navigation() {
  const { user, isLoading: isUserLoading } = useFirebaseAuth();
  const auth = useAuth();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-foreground">ChatPMT</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-wider text-primary sm:block">AI Tool</span>
            </div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/#tool-main" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tool</Link>
            <Link href="/#templates" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Templates</Link>
            <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            )}

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden sm:flex gap-2 font-bold"
                  onClick={() => setIsHistoryOpen(true)}
                >
                  <History className="h-4 w-4" />
                  History
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt={user.displayName || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email || 'Anonymous'}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsHistoryOpen(true)}>
                      <History className="mr-2 h-4 w-4" />
                      <span>Prompt History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="rounded-full px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <HistorySheet isOpen={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
    </>
  );
}
