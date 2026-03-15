
"use client"

import { useState, useEffect } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  History, 
  Copy, 
  Check, 
  Trash2, 
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { useFirestore } from '@/firebase/provider';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface HistorySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistorySheet({ isOpen, onOpenChange }: HistorySheetProps) {
  const { user } = useFirebaseAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setIsLoading(true);
      const loadHistory = async () => {
        try {
          const q = query(
            collection(firestore, 'prompts'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setHistory(items);
        } catch (error) {
          console.error("Error loading history:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadHistory();
    }
  }, [user, isOpen, firestore]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied!",
      description: "Past prompt copied to clipboard.",
    });
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(firestore, 'prompts', id));
      setHistory((prev) => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
    
    toast({
      title: "Deleted",
      description: "Prompt removed from history.",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md border-l border-primary/10 bg-[#fcf9f2]">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <History className="h-6 w-6 text-primary" />
            Prompt History
          </SheetTitle>
          <SheetDescription>
            All your previous prompts are saved here.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
              <Sparkles className="h-8 w-8 animate-pulse text-primary" />
              <p className="text-sm font-medium">Loading history...</p>
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-4">
              {history
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl bg-white border border-border/50 group hover:border-primary/30 transition-all space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {item.promptType}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(item.createdAt))} ago
                        </span>
                      </div>
                      <h4 className="font-bold text-sm line-clamp-1">{item.inputIdea}</h4>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-3 bg-muted/30 p-2 rounded-lg border italic">
                    {item.generatedPromptText}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-8 text-xs font-bold gap-2 bg-white"
                      onClick={() => handleCopy(item.generatedPromptText, item.id)}
                    >
                      {copiedId === item.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedId === item.id ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-bold">No history found</p>
                <p className="text-xs text-muted-foreground px-10">
                  Generate some magic prompts and they will appear here!
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
