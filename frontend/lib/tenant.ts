export function getTenant(host: string): Tenant {
  // For local development: treat port 3002 as Alexandria
  if (host.includes('3002') || host.includes('alexandria')) {
    return { schema: 'gov_alexandria', name: 'alexandria' };
  }
  return { schema: 'public', name: 'giza' };
}