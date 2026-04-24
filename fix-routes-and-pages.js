const fs = require('fs');
const path = require('path');

// Helper to write file with UTF-8 without BOM
function writeUtf8(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
}

// 1. Add export const dynamic = 'force-dynamic' to all API route.ts files
const apiBase = path.join(__dirname, 'frontend', 'app', 'api');
function processApiFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processApiFiles(fullPath);
        } else if (item === 'route.ts') {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes("export const dynamic = 'force-dynamic'")) {
                content = "export const dynamic = 'force-dynamic';\n\n" + content;
                writeUtf8(fullPath, content);
                console.log(`Updated API: ${fullPath}`);
            }
        }
    }
}
if (fs.existsSync(apiBase)) {
    processApiFiles(apiBase);
} else {
    console.error(`API base folder not found: ${apiBase}`);
}

// 2. Create placeholder pages for all static/dynamic routes (with UTF-8)
const pages = [
    "about-governorate", "schools-directory", "special-needs-schools", "kindergarten-application",
    "sponsorship-policy", "sponsors", "things-to-do", "vault", "login", "property-lookup",
    "verify-id", "documents", "media-gallery", "investment-map", "open-source", "admin/review-queue",
    "services", "events", "marketplace", "news", "jobs", "tech-centers", "tech-centers/request",
    "social-services", "social-services/request", "social-services/domestic-violence-report",
    "social-services/family-counseling", "golden-citizen", "golden-citizen/volunteer-register",
    "golden-citizen/request-service", "governor-qa", "governor-qa/ask", "governor-qa/admin",
    "health/state-funded-treatment", "health/comprehensive-insurance", "health/insurance-inquiry",
    "property/building-reconciliation", "property/hand-possession", "gifted", "gifted/apply", "gifted/programs"
];

const appBase = path.join(__dirname, 'frontend', 'app');
for (const page of pages) {
    const folder = path.join(appBase, page);
    const filePath = path.join(folder, 'page.tsx');
    const content = `export default function Page() {
  return <div className="p-8 text-center text-lg">صفحة ${page} - قيد الإنشاء</div>;
}
`;
    writeUtf8(filePath, content);
    console.log(`Created placeholder: ${filePath}`);
}

console.log('All done.');