const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');

function getAllRouteFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllRouteFiles(fullPath));
    } else if (item === 'route.ts' || item === 'route.tsx') {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getAllRouteFiles(apiDir);
let fixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Remove all existing imports from 'next/server' (any form)
  content = content.replace(/import\s*\{[^}]*\}\s*from\s*['"]next\/server['"]\s*;?\r?\n?/g, '');
  
  // 2. Remove all existing imports of pool (any form)
  content = content.replace(/import\s+pool\s+from\s*['"][^'"]+['"]\s*;?\r?\n?/g, '');
  content = content.replace(/import\s*\{\s*pool\s*\}\s*from\s*['"][^'"]+['"]\s*;?\r?\n?/g, '');
  
  // 3. Remove any local pool creation
  content = content.replace(/const\s+pool\s*=\s*new\s+Pool\([^;]+\);?\r?\n?/g, '');
  content = content.replace(/const\s+pool\s*=\s*.*?;\r?\n?/g, '');
  
  // 4. Remove any export const dynamic line
  content = content.replace(/export\s+const\s+dynamic\s*=\s*.*?;\r?\n?/g, '');
  
  // 5. Remove any import of Pool from 'pg'
  content = content.replace(/import\s*\{\s*Pool\s*\}\s*from\s*['"]pg['"]\s*;?\r?\n?/g, '');
  
  // 6. Detect which Next.js imports are needed
  const needsNextRequest = /:\s*NextRequest\b|\bNextRequest\b/.test(content);
  const needsNextResponse = /:\s*NextResponse\b|\bNextResponse\b/.test(content);
  
  // 7. Build the new header
  let header = `export const dynamic = 'force-dynamic';\n\nimport pool from '@/lib/db';\n`;
  if (needsNextRequest || needsNextResponse) {
    const imports = [];
    if (needsNextRequest) imports.push('NextRequest');
    if (needsNextResponse) imports.push('NextResponse');
    header += `import { ${imports.join(', ')} } from 'next/server';\n`;
  }
  header += '\n';
  
  // 8. Prepend header
  const newContent = header + content;
  
  // 9. Write back
  fs.writeFileSync(file, newContent, 'utf8');
  console.log(`Cleaned: ${file}`);
  fixed++;
}

console.log(`\n✅ Cleaned ${fixed} route files.`);