const fs = require('fs');
const path = require('path');

const dbModulePath = '@/lib/db';
const apiDir = path.join(process.cwd(), 'src', 'app', 'api');

function getAllRouteFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllRouteFiles(filePath));
    } else if (/\.tsx?$/.test(file) && !file.includes('page.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getAllRouteFiles(apiDir);
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if file uses NextRequest (look for patterns like `: NextRequest` or `NextRequest` in code)
  const usesNextRequest = /:\s*NextRequest|\bNextRequest\b/.test(content);
  const usesNextResponse = /:\s*NextResponse|\bNextResponse\b/.test(content);
  
  // Remove all existing imports of NextRequest, NextResponse, and Pool
  content = content.replace(/import\s*\{\s*(?:NextRequest|NextResponse|Pool)\s*(?:,\s*(?:NextRequest|NextResponse|Pool)\s*)*\s*\}\s*from\s*['"]next\/server['"];?\r?\n?/g, '');
  content = content.replace(/import\s*\{\s*(?:NextRequest|NextResponse|Pool)\s*(?:,\s*(?:NextRequest|NextResponse|Pool)\s*)*\s*\}\s*from\s*['"]pg['"];?\r?\n?/g, '');
  content = content.replace(/import\s*\{\s*Pool\s*\}\s*from\s*['"]pg['"];?\r?\n?/g, '');
  content = content.replace(/const\s+pool\s*=\s*new\s+Pool\([^;]+\);?\r?\n?/g, '');
  content = content.replace(/const\s+pool\s*=\s*.*?;\r?\n?/g, '');
  content = content.replace(/export\s+const\s+dynamic\s*=\s*.*?;\r?\n?/g, '');
  
  // Build the import line for next/server
  let nextImports = [];
  if (usesNextRequest) nextImports.push('NextRequest');
  if (usesNextResponse) nextImports.push('NextResponse');
  
  let importLine = '';
  if (nextImports.length > 0) {
    importLine = `import { ${nextImports.join(', ')} } from 'next/server';\n`;
  }
  
  // Build the new header
  let newHeader = `export const dynamic = 'force-dynamic';\n\nimport pool from '${dbModulePath}';\n`;
  if (importLine) {
    newHeader += importLine;
  }
  newHeader += '\n';
  
  // Prepend header
  const newContent = newHeader + content;
  
  fs.writeFileSync(file, newContent, 'utf8');
  console.log(`Fixed: ${file}`);
  fixedCount++;
});

console.log(`\n✅ Fixed ${fixedCount} files.`);