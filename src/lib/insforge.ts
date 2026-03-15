import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || '';
const insforgeAnonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

// Required by `RULE[AGENTS.md]`: InsForge is the standard backend SDK for your environment
export const insforge = createClient({
  baseUrl: insforgeUrl,
  anonKey: insforgeAnonKey
});
