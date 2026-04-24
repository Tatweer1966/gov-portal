const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'govportal',
  user: process.env.DB_USER || 'govportal',
  password: process.env.DB_PASSWORD || 'GovPortal@2025',
});

async function migratePages() {
  const rows = [];
  const csvPath = path.join(__dirname, 'old-pages.csv');
  if (!fs.existsSync(csvPath)) {
    console.log('No old-pages.csv found. Skipping migration.');
    return;
  }

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      for (const row of rows) {
        await pool.query(
          `INSERT INTO gov_giza.pages (title_ar, content_ar, slug, status, created_at)
           VALUES ($1, $2, $3, 'published', NOW())`,
          [row.title, row.body, row.slug || row.title.toLowerCase().replace(/ /g, '-')]
        );
      }
      console.log(`✅ Migrated ${rows.length} pages from old CSV.`);
      process.exit(0);
    });
}

migratePages().catch(console.error);