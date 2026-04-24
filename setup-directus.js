const fs = require('fs');

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
    throw new Error(HTTP : );
  }
  return res.json();
}

async function login() {
  console.log('Logging into Directus...');
  const data = await fetchJSON(${DIRECTUS_URL}/auth/login, {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  token = data.data.access_token;
  console.log('Login successful');
}

async function createCollection(name) {
  console.log(Creating collection ''...);
  try {
    await fetchJSON(${DIRECTUS_URL}/collections/, {
      headers: { Authorization: Bearer your-full-access-token },
    });
    console.log(Collection '' already exists);
    return;
  } catch (err) {
    if (!err.message.includes('404')) throw err;
  }
  await fetchJSON(${DIRECTUS_URL}/collections, {
    method: 'POST',
    headers: { Authorization: Bearer your-full-access-token },
    body: JSON.stringify({ collection: name, meta: { singleton: false } }),
  });
  console.log(Collection '' created);
}

async function addField(collection, field, type, required = false, defaultValue = null) {
  console.log(Adding field ''...);
  try {
    await fetchJSON(${DIRECTUS_URL}/fields//, {
      headers: { Authorization: Bearer your-full-access-token },
    });
    console.log(Field '' already exists, skipping);
    return;
  } catch (err) {
    if (!err.message.includes('404')) throw err;
  }
  const body = {
    field,
    type,
    meta: { required },
    schema: {},
  };
  if (defaultValue !== null) body.schema.default_value = defaultValue;
  await fetchJSON(${DIRECTUS_URL}/fields/, {
    method: 'POST',
    headers: { Authorization: Bearer your-full-access-token },
    body: JSON.stringify(body),
  });
  console.log(Field '' added);
}

async function setPublicPermissions(collection) {
  console.log(Setting public permissions for ''...);
  const roles = await fetchJSON(${DIRECTUS_URL}/roles, {
    headers: { Authorization: Bearer your-full-access-token },
  });
  const publicRole = roles.data.find(r => r.name === 'Public');
  if (!publicRole) {
    console.log('Public role not found');
    return;
  }
  await fetchJSON(${DIRECTUS_URL}/permissions, {
    method: 'POST',
    headers: { Authorization: Bearer your-full-access-token },
    body: JSON.stringify({
      collection,
      role: publicRole.id,
      action: 'create',
      permissions: {},
      fields: '*',
    }),
  }).catch(e => console.log('Create permission may already exist'));
  await fetchJSON(${DIRECTUS_URL}/permissions, {
    method: 'POST',
    headers: { Authorization: Bearer your-full-access-token },
    body: JSON.stringify({
      collection,
      role: publicRole.id,
      action: 'read',
      permissions: {},
      fields: '*',
    }),
  }).catch(e => console.log('Read permission may already exist'));
  console.log('Public permissions set');
}

async function main() {
  await login();
  const collection = 'news_articles';
  await createCollection(collection);

  const fields = [
    { name: 'title_ar', type: 'string', required: true },
    { name: 'title_en', type: 'string', required: false },
    { name: 'slug', type: 'string', required: true },
    { name: 'summary_ar', type: 'text', required: false },
    { name: 'summary_en', type: 'text', required: false },
    { name: 'content_ar', type: 'text', required: true },
    { name: 'content_en', type: 'text', required: false },
    { name: 'category', type: 'string', required: false },
    { name: 'priority', type: 'integer', required: false, default: 0 },
    { name: 'is_featured', type: 'boolean', required: false, default: false },
    { name: 'published_at', type: 'datetime', required: false },
    { name: 'featured_image', type: 'uuid', required: false },
    { name: 'gallery_images', type: 'json', required: false },
  ];

  for (const f of fields) {
    await addField(collection, f.name, f.type, f.required, f.default);
  }

  await setPublicPermissions(collection);
  console.log('\n✅ Directus setup complete!');
}

main().catch(console.error);
