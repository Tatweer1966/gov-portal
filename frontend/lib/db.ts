import { Pool } from 'pg';

// Global pool instance to reuse connections
const globalPool = new Pool({
  host: process.env.DATABASE_HOST || 'gov-portal-db',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
  max: 20,                       // maximum number of clients in the pool
  idleTimeoutMillis: 30000,      // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection not established
});

// Helper to set the tenant schema on a client
export async function setTenantSchema(client: any, schema: string) {
  await client.query(`SET search_path TO ${schema}, public`);
}

// Export the pool directly for simple queries
export default globalPool;