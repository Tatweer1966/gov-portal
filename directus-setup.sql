-- Add columns if they don't exist
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS title_ar VARCHAR(255);
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS title_en VARCHAR(255);
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS summary_ar TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS summary_en TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS content_ar TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS content_en TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS featured_image UUID;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS gallery_images JSONB;

-- Insert metadata into directus_fields so they appear in the admin UI
INSERT INTO directus_fields (collection, field, type, meta) VALUES
('news_articles', 'title_ar', 'string', '{"required":true,"interface":"input"}'),
('news_articles', 'title_en', 'string', '{}'),
('news_articles', 'slug', 'string', '{"required":true,"interface":"input"}'),
('news_articles', 'summary_ar', 'text', '{}'),
('news_articles', 'summary_en', 'text', '{}'),
('news_articles', 'content_ar', 'text', '{"required":true,"interface":"input-rich-text-html"}'),
('news_articles', 'content_en', 'text', '{}'),
('news_articles', 'category', 'string', '{}'),
('news_articles', 'priority', 'integer', '{}'),
('news_articles', 'is_featured', 'boolean', '{}'),
('news_articles', 'published_at', 'datetime', '{}'),
('news_articles', 'featured_image', 'uuid', '{"interface":"file-image","special":["file"]}'),
('news_articles', 'gallery_images', 'json', '{"interface":"list","special":["cast-json"]}')
ON CONFLICT (collection, field) DO NOTHING;

-- Set public permissions (create and read)
INSERT INTO directus_permissions (role, collection, action, permissions, fields)
SELECT id, 'news_articles', 'create', '{}', '*'
FROM directus_roles WHERE name = 'Public'
ON CONFLICT (role, collection, action) DO NOTHING;

INSERT INTO directus_permissions (role, collection, action, permissions, fields)
SELECT id, 'news_articles', 'read', '{}', '*'
FROM directus_roles WHERE name = 'Public'
ON CONFLICT (role, collection, action) DO NOTHING;
