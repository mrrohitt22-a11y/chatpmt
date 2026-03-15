"use client"

import { Navigation } from '@/components/Navigation';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto max-w-4xl px-4 py-20 pb-32">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="text-muted-foreground space-y-8 leading-relaxed prose prose-invert max-w-none">
          <section>
            <p>Last Updated: March 2026</p>
            <p className="mt-4">
              Welcome to ChatPMT AI! Your privacy is very important to us. This Privacy Policy outlines what kinds of data we gather, how we use it, how it gets protected, and your rights concerning your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p>We may collect information when you engage with us, such as:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Personal Info:</strong> Details like your name, email address, and authentication data across platforms (Google, GitHub, etc.) when you create an account with us.</li>
              <li><strong>Usage Details:</strong> Information about how you interact with our platform, including the prompts you generate (which are stored securely for your history), and your credit balance.</li>
              <li><strong>Payment Data:</strong> To process payments, we use a secure third-party gateway (Razorpay). We do not store full credit card details on our local servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Processing Your Information</h2>
            <p>We use your data strictly to boost your experience on our platform:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To provide, manage, and scale the ChatPMT template library & AI generation services.</li>
              <li>To manage your account and billing.</li>
              <li>To notify you about significant updates or promotional offers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Sharing and Protection</h2>
            <p>
              We highly respect the sanctity of your generated data. We do not sell your data to outside marketing firms. Personal information might be shared with trusted third parties exclusively to facilitate core functions like hosting, advanced AI generation (Genkit/Firebase), and payments. We implement top-tier encryption and restrictive access measures to maintain absolute data safety.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Your Control</h2>
            <p>
              Depending on the jurisdiction you operate within, you possess the right to request access to your stored personal information, update your profile details, or initiate complete deletion of your account footprint. These actions can be done via your account settings or by contacting our community support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Revisions</h2>
            <p>
              This policy might be refreshed occasionally to reflect internal workflow updates or adhere to international privacy protocols. Substantial shifts in our data handling rules will be broadcasted to users beforehand.
            </p>
          </section>

        </div>
      </div>
      
      <footer className="container mx-auto px-4 py-8 border-t border-muted text-center text-muted-foreground text-sm">
        © 2026 ChatPMT AI. All Rights Reserved.
      </footer>
    </main>
  );
}
