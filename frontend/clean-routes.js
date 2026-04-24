const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else if (/\.tsx?$/.test(file) && !file.includes('page.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getAllFiles(apiDir);
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Remove ALL existing import statements for pool (any form)
  content = content.replace(/import\s+pool\s+from\s+['"][^'"]+['"];?\r?\n?/g, '');
  content = content.replace(/import\s*\{\s*pool\s*\}\s*from\s+['"][^'"]+['"];?\r?\n?/g, '');
  content = content.replace(/import\s*\{\s*Pool\s*\}\s*from\s+['"]pg['"];?\r?\n?/g, '');
  
  // 2. Remove any local pool creation
  content = content.replace(/const\s+pool\s*=\s*new\s+Pool\([^;]+\);?\r?\n?/g, '');
  content = content.replace(/const\s+pool\s*=\s*.*?;\r?\n?/g, '');
  
  // 3. Remove ALL existing imports from 'next/server' (NextRequest, NextResponse)
  content = content.replace(/import\s*\{\s*[^}]+\s*\}\s*from\s+['"]next\/server['"];?\r?\n?/g, '');
  
  // 4. Remove any export const dynamic line
  content = content.replace(/export\s+const\s+dynamic\s*=\s*.*?;\r?\n?/g, '');
  
  // 5. Determine what Next.js imports are needed by scanning the remaining code
  const usesNextRequest = /:\s*NextRequest|\bNextRequest\b/.test(content);
  const usesNextResponse = /:\s*NextResponse|\bNextResponse\b/.test(content);
  
  // 6. Build the new header
  let newHeader = `export const dynamic = 'force-dynamic';\n\nimport pool from '@/lib/db';\n`;
  if (usesNextRequest || usesNextResponse) {
    let imports = [];
    if (usesNextRequest) imports.push('NextRequest');
    if (usesNextResponse) imports.push('NextResponse');
    newHeader += `import { ${imports.join(', ')} } from 'next/server';\n`;
  }
  newHeader += '\n';
  
  // 7. Prepend header
  const newContent = newHeader + content;
  
  // 8. Write back
  fs.writeFileSync(file, newContent, 'utf8');
  console.log(`Cleaned: ${file}`);
  fixedCount++;
});

console.log(`\n✅ Cleaned ${fixedCount} files.`);