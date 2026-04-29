// lib/tenant.ts

export interface Tenant {
  schema: string;
  name: string;
}

export function getTenant(host: string): Tenant {
  // For local development: treat port 3002 as Alexandria
  if (host.includes('3002') || host.includes('alexandria') || host.includes('alex')) {
    return { schema: 'gov_alexandria', name: 'alexandria' };
  }
  // Default to Giza (public schema)
  return { schema: 'public', name: 'giza' };
}