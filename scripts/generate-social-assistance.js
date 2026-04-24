const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'govportal_app',   // new database name
  user: 'govportal',
  password: 'GovPortal@2025',
});

const programTypes = ['child_protection', 'addiction', 'domestic_violence', 'elderly_care', 'psychological_support', 'family_counseling'];
const statuses = ['pending', 'in_progress', 'resolved', 'rejected'];
const names = ['أحمد محمد', 'سارة علي', 'محمد إبراهيم', 'فاطمة حسين', 'كريم سيد', 'نادية عادل'];
const phones = ['01234567890', '01234567891', '01234567892', '01234567893', '01234567894', '01234567895'];

async function generate() {
  const client = await pool.connect();
  try {
    // Get existing user IDs (citizens)
    const usersRes = await client.query(`SELECT id FROM public.users WHERE role = 'citizen' LIMIT 10`);
    const userIds = usersRes.rows.map(r => r.id);
    if (userIds.length === 0) userIds.push(null);

    for (let i = 0; i < 50; i++) {
      const program = programTypes[Math.floor(Math.random() * programTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const name = names[Math.floor(Math.random() * names.length)];
      const phone = phones[Math.floor(Math.random() * phones.length)];
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const requestNumber = `SAR-SYNTH-${Date.now()}-${i}-${Math.floor(Math.random() * 10000)}`;
      const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      await client.query(`
        INSERT INTO public.social_assistance_requests (
          request_number, program_type, user_id, full_name, national_id, phone,
          description, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        requestNumber, program, userId, name, `1234567890${i}`, phone,
        `طلب مساعدة بسبب ظروف صعبة: ${program}`,
        status, createdDate, createdDate
      ]);
    }
    console.log('Inserted 50 synthetic social assistance requests');
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

generate();