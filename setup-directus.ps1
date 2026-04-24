# setup-directus.ps1
$directusUrl = "http://localhost:8055"
$adminEmail = "admin@example.com"
$adminPassword = "Admin1234"

# ----- 1. Login and get access token -----
Write-Host "Logging into Directus..." -ForegroundColor Cyan
$loginBody = @{ email = $adminEmail; password = $adminPassword } | ConvertTo-Json
try {
    $loginResp = Invoke-RestMethod -Uri "$directusUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResp.data.access_token
    Write-Host "Login successful, token obtained." -ForegroundColor Green
} catch {
    Write-Host "Login failed: $_" -ForegroundColor Red
    exit 1
}

$headers = @{
    Authorization = "Bearer $token"
    "Content-Type" = "application/json"
}

# ----- 2. Helper function to create collection (if missing) -----
function Create-Collection {
    param($collectionName)
    Write-Host "Checking if collection '$collectionName' exists..." -ForegroundColor Cyan
    $existing = Invoke-RestMethod -Uri "$directusUrl/collections/$collectionName" -Method Get -Headers $headers -ErrorAction SilentlyContinue
    if ($existing -and $existing.data) {
        Write-Host "Collection '$collectionName' already exists. Skipping creation." -ForegroundColor Yellow
        return
    }
    $body = @{ collection = $collectionName; meta = @{ singleton = $false } } | ConvertTo-Json -Depth 3
    try {
        Invoke-RestMethod -Uri "$directusUrl/collections" -Method Post -Headers $headers -Body $body
        Write-Host "Collection '$collectionName' created." -ForegroundColor Green
    } catch {
        Write-Host "Failed to create collection: $_" -ForegroundColor Red
    }
}

# ----- 3. Helper function to add a field (if missing) -----
function Add-Field {
    param($collectionName, $fieldName, $type, $required = $false, $default = $null, $note = "")
    Write-Host "Adding field '$fieldName' to '$collectionName'..." -ForegroundColor Cyan
    # Check if field already exists
    $existingFields = Invoke-RestMethod -Uri "$directusUrl/fields/$collectionName" -Method Get -Headers $headers -ErrorAction SilentlyContinue
    if ($existingFields.data | Where-Object { $_.field -eq $fieldName }) {
        Write-Host "Field '$fieldName' already exists. Skipping." -ForegroundColor Yellow
        return
    }
    $body = @{
        field = $fieldName
        type = $type
        meta = @{
            required = $required
            note = $note
        }
        schema = @{}
    }
    if ($default -ne $null) { $body.schema.default_value = $default }
    $json = $body | ConvertTo-Json -Depth 3
    try {
        Invoke-RestMethod -Uri "$directusUrl/fields/$collectionName" -Method Post -Headers $headers -Body $json
        Write-Host "Field '$fieldName' added." -ForegroundColor Green
    } catch {
        Write-Host "Failed to add field '$fieldName': $_" -ForegroundColor Red
    }
}

# ----- 4. Create collection and fields -----
$collection = "news_articles"
Create-Collection -collectionName $collection

# List of fields to add
$fields = @(
    @{ name = "title_ar"; type = "string"; required = $true; note = "العنوان بالعربية" },
    @{ name = "title_en"; type = "string"; required = $false; note = "Title in English" },
    @{ name = "slug"; type = "string"; required = $true; note = "URL-friendly identifier" },
    @{ name = "summary_ar"; type = "text"; required = $false; note = "الملخص بالعربية" },
    @{ name = "summary_en"; type = "text"; required = $false; note = "Summary in English" },
    @{ name = "content_ar"; type = "text"; required = $true; note = "المحتوى بالعربية (Rich text)" },
    @{ name = "content_en"; type = "text"; required = $false; note = "Content in English" },
    @{ name = "category"; type = "string"; required = $false; note = "التصنيف" },
    @{ name = "priority"; type = "integer"; required = $false; default = 0; note = "أولوية العرض" },
    @{ name = "is_featured"; type = "boolean"; required = $false; default = $false; note = "خبر مميز" },
    @{ name = "published_at"; type = "datetime"; required = $false; note = "تاريخ النشر" },
    @{ name = "featured_image"; type = "uuid"; required = $false; note = "الصورة الرئيسية (File ID)" },
    @{ name = "gallery_images"; type = "json"; required = $false; note = "معرض الصور (Array of File IDs)" }
)

foreach ($field in $fields) {
    Add-Field -collectionName $collection -fieldName $field.name -type $field.type -required $field.required -default $field.default -note $field.note
}

# ----- 5. Set Public permissions (full access for create and read) -----
Write-Host "Setting public permissions for '$collection'..." -ForegroundColor Cyan
$publicRoleId = (Invoke-RestMethod -Uri "$directusUrl/roles?filter[name][_eq]=Public" -Headers $headers).data[0].id
if (-not $publicRoleId) {
    Write-Host "Public role not found. Skipping permissions." -ForegroundColor Yellow
} else {
    # Check if policy already exists
    $existingPolicy = Invoke-RestMethod -Uri "$directusUrl/permissions?filter[collection][_eq]=$collection&filter[role][_eq]=$publicRoleId&limit=1" -Headers $headers -ErrorAction SilentlyContinue
    if ($existingPolicy.data.Count -gt 0) {
        Write-Host "Permissions for '$collection' already exist. Skipping." -ForegroundColor Yellow
    } else {
        $permissionBody = @{
            collection = $collection
            role = $publicRoleId
            action = "create"
            permissions = @{}
            fields = "*"
        } | ConvertTo-Json -Depth 3
        Invoke-RestMethod -Uri "$directusUrl/permissions" -Method Post -Headers $headers -Body $permissionBody | Out-Null
        $permissionBodyRead = @{
            collection = $collection
            role = $publicRoleId
            action = "read"
            permissions = @{}
            fields = "*"
        } | ConvertTo-Json -Depth 3
        Invoke-RestMethod -Uri "$directusUrl/permissions" -Method Post -Headers $headers -Body $permissionBodyRead | Out-Null
        Write-Host "Public permissions (create & read) added." -ForegroundColor Green
    }
}

Write-Host "`n✅ Directus setup completed!" -ForegroundColor Green