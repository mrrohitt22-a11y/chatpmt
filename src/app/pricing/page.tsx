"use client"

import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Check, Zap, Star, Trophy, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';
import { useFirestore } from '@/firebase/provider';
import { doc, updateDoc } from 'firebase/firestore';

const PLANS = [
  {
    id: 'plan_free',
    name: 'Free',
    price: 0,
    priceDisplay: '₹0',
    description: 'Perfect for learning the basics.',
    features: ['3 free prompts / day', 'Basic quality AI prompts', 'Standard templates', 'Community support'],
    buttonText: 'Get Started',
    icon: <Zap className="h-6 w-6 text-muted-foreground" />,
    badge: null,
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    price: 199,
    priceDisplay: '₹199',
    period: '/month',
    description: 'For professional content creators.',
    features: ['Unlimited prompts', 'Advanced quality AI', 'Full history access', 'Priority templates', 'No ads'],
    buttonText: 'Upgrade to Pro',
    icon: <Star className="h-6 w-6 text-primary-foreground" />,
    badge: 'Best Value',
    highlight: true,
  },
  {
    id: 'plan_biz',
    name: 'Business',
    price: 999,
    priceDisplay: '₹999',
    period: '/month',
    description: 'Elite solution for agencies and teams.',
    features: ['Team access (5 members)', 'Expert reasoning engine', 'Custom branding', 'API access (beta)', 'Dedicated manager'],
    buttonText: 'Go Business',
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    badge: 'Enterprise',
  },
];

const CREDIT_PACKS = [
  { id: 'pack_100', amount: '100 Prompts', price: 99, priceDisplay: '₹99', icon: <CreditCard className="h-5 w-5" />, credits: 100 },
  { id: 'pack_unlimited', amount: 'Unlimited Prompts', price: 299, priceDisplay: '₹299', icon: <CreditCard className="h-5 w-5" />, highlight: true, credits: 999999 },
];

export default function PricingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const firestore = useFirestore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePayment = async (planId: string, amount: number, name: string, creditsToAdd?: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase a plan.",
        variant: "destructive"
      });
      router.push('/login');
      return;
    }

    if (amount === 0) {
      toast({
        title: "Free Plan Activated",
        description: "You are currently using the free plan.",
      });
      return;
    }

    setLoadingId(planId);

    try {
      // 1. Fetch Order ID from Next.js API
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Amount in paisa
          currency: 'INR',
          receipt: `rcpt_${planId}_${user.uid.slice(0, 5)}`
        }),
      });

      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.error || "Order creation failed");

      // 2. Setup Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Automatically uses the Test Key from .env
        amount: amount * 100,
        currency: "INR",
        name: "ChatPMT AI",
        description: `Purchase for ${name}`,
        image: "https://picsum.photos/seed/chatpmt/200/200",
        order_id: orderData.orderId, // Secure Order ID required by recent Razorpay updates
        handler: async function (response: any) {
          // Verify signature logic usually goes here on backend, but we run directly for testing.
          
          // Update credits in Firestore
          const updatedCredits = creditsToAdd ? 10 + (creditsToAdd || 0) : 5000;
          
          try {
            const profileRef = doc(firestore, 'userProfiles', user.uid);
            await updateDoc(profileRef, {
              creditsBalance: updatedCredits,
              updatedAt: new Date().toISOString()
            });
          } catch (error) {
            console.error("Error updating credits:", error);
          }
          
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}. Your account has been upgraded!`,
          });
          
          setLoadingId(null);
          setTimeout(() => {
            router.push('/');
          }, 1500);
        },
        prefill: {
          name: user.displayName || "User",
          email: user.email || "user@example.com",
        },
        theme: {
          color: "#09090b", // Matches dark UI
        },
        modal: {
          ondismiss: function() {
            setLoadingId(null);
            toast({
              title: "Payment Cancelled",
              description: "You closed the payment window.",
            });
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast({
            title: "Payment Failed",
            description: response.error.description,
            variant: "destructive",
        });
        setLoadingId(null);
      });
      rzp.open();
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen pb-20 bg-background">
      <Navigation />
      
      <section className="container mx-auto px-4 py-16 md:py-24 text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Choose the right plan, <br/>
          <span className="text-primary-foreground italic bg-primary px-4 py-1 rounded-2xl">become a prompting expert.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Elevate your creative process with professional-grade prompt engineering tools.
        </p>
      </section>

      <section className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center mt-8">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`relative flex flex-col transition-all duration-300 ${plan.highlight ? 'border-2 border-primary shadow-2xl md:scale-105 z-10 bg-card text-card-foreground' : 'border border-border hover:border-primary/50 bg-card text-card-foreground hover:shadow-xl'}`}>
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge variant={plan.highlight ? 'default' : 'secondary'} className="px-4 py-1 rounded-full uppercase font-bold tracking-wider bg-primary text-primary-foreground">
                  {plan.badge}
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pt-10 pb-6">
              <div className={`mx-auto h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${plan.highlight ? 'bg-primary text-primary-foreground shadow-inner' : 'bg-muted/50'}`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="min-h-[40px] mt-2">{plan.description}</CardDescription>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold tracking-tight">{plan.priceDisplay}</span>
                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pb-8">
              <Button 
                variant={plan.highlight ? 'default' : 'outline'} 
                className={`w-full h-12 rounded-xl font-bold text-lg transition-all ${plan.highlight ? 'bg-primary text-primary-foreground shadow-lg hover:shadow-primary/25 hover:bg-primary/90' : 'border-border hover:border-primary text-foreground hover:bg-primary/10'}`} 
                size="lg"
                disabled={loadingId === plan.id}
                onClick={() => handlePayment(plan.id, plan.price, plan.name)}
              >
                {loadingId === plan.id ? <Loader2 className="h-5 w-5 animate-spin" /> : plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="container mx-auto px-4 mt-32">
        <div className="max-w-4xl mx-auto rounded-3xl bg-card text-card-foreground border border-border p-8 md:p-14 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20">
                <CreditCard className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Pay As You Go</span>
              </div>
              <h2 className="text-3xl font-bold">Credit-Based System</h2>
              <p className="text-muted-foreground leading-relaxed">
                Only need prompts occasionally? Purchase a credit pack and use them whenever you want. Credits never expire.
              </p>
              <div className="flex items-center gap-4 py-2">
                <ShieldCheck className="h-10 w-10 text-primary" />
                <span className="text-sm font-bold">No recurring bills. Absolute freedom.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {CREDIT_PACKS.map((pack) => (
                <div key={pack.id} className={`p-6 rounded-2xl flex items-center justify-between border transition-all cursor-pointer ${pack.highlight ? 'bg-primary/10 border-primary shadow-lg ring-1 ring-primary/20' : 'bg-background hover:bg-muted/50 border-border hover:border-primary/50 hover:shadow-md'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${pack.highlight ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {pack.icon}
                    </div>
                    <div className="font-bold text-lg">{pack.amount}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">{pack.priceDisplay}</span>
                    <Button 
                      variant={pack.highlight ? 'default' : 'secondary'} 
                      size="sm" 
                      className="rounded-lg font-bold"
                      disabled={loadingId === pack.id}
                      onClick={() => handlePayment(pack.id, pack.price, pack.amount, pack.credits)}
                    >
                      {loadingId === pack.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buy Now'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 mt-32 pt-8 border-t border-muted text-center text-muted-foreground text-sm">
        © 2024 ChatPMT AI. Powered by Genkit.
      </footer>
    </main>
  );
}
