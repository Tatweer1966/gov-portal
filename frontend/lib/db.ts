import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DATABASE_HOST || 'gov-portal-db',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'govportal_app',
  user: process.env.DATABASE_USERNAME || 'govportal',
  password: process.env.DATABASE_PASSWORD || 'GovPortal@2025',
  options: '-c client_encoding=utf8',
});

// Helper to set the tenant schema on a client
export async function setTenantSchema(client: any, schema: string) {
  await client.query(`SET search_path TO ${schema}, public`);
}

export default pool;