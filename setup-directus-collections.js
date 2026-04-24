const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin1234';

let token = null;

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

async function login() {
  console.log('Logging into Directus...');
  const data = await fetchJSON(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  token = data.data.access_token;
  console.log('Login successful');
}

async function createCollection(name, fields) {
  console.log(`Creating collection '${name}'...`);
  try {
    await fetchJSON(`${DIRECTUS_URL}/collections/${name}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`Collection '${name}' already exists, skipping creation.`);
  } catch (err) {
    if (!err.message.includes('404')) throw err;
    await fetchJSON(`${DIRECTUS_URL}/collections`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ collection: name, meta: { singleton: false } }),
    });
    console.log(`Collection '${name}' created.`);
  }

  // Add fields
  for (const field of fields) {
    console.log(`  Adding field '${field.name}'...`);
    try {
      await fetchJSON(`${DIRECTUS_URL}/fields/${name}/${field.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`    Field already exists, skipping.`);
    } catch (err) {
      if (!err.message.includes('404')) throw err;
      const body = {
        field: field.name,
        type: field.type,
        meta: { required: field.required || false },
        schema: {},
      };
      if (field.default !== undefined) body.schema.default_value = field.default;
      await fetchJSON(`${DIRECTUS_URL}/fields/${name}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      console.log(`    Field added.`);
    }
  }
}

async function setPublicReadPermission(collection) {
  console.log(`Setting Public read permission for '${collection}'...`);
  const roles = await fetchJSON(`${DIRECTUS_URL}/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const publicRole = roles.data.find(r => r.name === 'Public');
  if (!publicRole) {
    console.log('Public role not found');
    return;
  }
  // Check if permission already exists
  const existing = await fetchJSON(`${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[role][_eq]=${publicRole.id}&filter[action][_eq]=read`, {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => null);
  if (existing && existing.data.length > 0) {
    console.log(`  Read permission already exists.`);
    return;
  }
  await fetchJSON(`${DIRECTUS_URL}/permissions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      collection,
      role: publicRole.id,
      action: 'read',
      permissions: {},
      fields: '*',
    }),
  });
  console.log(`  Read permission added.`);
}

async function main() {
  await login();

  // Services collection
  await createCollection('services', [
    { name: 'name_ar', type: 'string', required: true },
    { name: 'slug', type: 'string', required: true },
    { name: 'description_ar', type: 'text', required: false },
    { name: 'is_featured', type: 'boolean', required: false, default: false },
  ]);
  await setPublicReadPermission('services');

  // Events collection
  await createCollection('events', [
    { name: 'title_ar', type: 'string', required: true },
    { name: 'description_ar', type: 'text', required: false },
    { name: 'start_date', type: 'datetime', required: false },
    { name: 'location_ar', type: 'string', required: false },
  ]);
  await setPublicReadPermission('events');

  console.log('\n✅ Collections created and permissions set.');
}

main().catch(console.error);