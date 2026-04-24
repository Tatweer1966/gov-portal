-- ============================================
-- APP DATABASE BOOTSTRAP
-- ============================================
CREATE DATABASE govportal_app;
\connect govportal_app;

-- ============================================
-- GOVERNMENT PORTAL - INITIAL DATABASE SCHEMA
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- OPTIONAL GOVERNORATE SCHEMAS
-- ============================================
CREATE SCHEMA IF NOT EXISTS gov_giza;
CREATE SCHEMA IF NOT EXISTS gov_alexandria;
CREATE SCHEMA IF NOT EXISTS gov_qalyubia;
CREATE SCHEMA IF NOT EXISTS gov_monufia;
CREATE SCHEMA IF NOT EXISTS gov_benisuef;
CREATE SCHEMA IF NOT EXISTS gov_minya;
CREATE SCHEMA IF NOT EXISTS gov_kafrelsheikh;
CREATE SCHEMA IF NOT EXISTS gov_marsamatrouh;
CREATE SCHEMA IF NOT EXISTS gov_beheira;
CREATE SCHEMA IF NOT EXISTS gov_assiut;
CREATE SCHEMA IF NOT EXISTS gov_sohag;
CREATE SCHEMA IF NOT EXISTS gov_newvalley;

-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    national_id VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen',
    governorate VARCHAR(50),
    mfa_enabled BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SERVICE CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.service_categories (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SERVICES
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(50) UNIQUE NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id INTEGER REFERENCES public.service_categories(id) ON DELETE SET NULL,
    description_ar TEXT,
    description_en TEXT,
    required_documents TEXT[],
    fees_ar TEXT,
    fees_en TEXT,
    processing_time_ar VARCHAR(100),
    processing_time_en VARCHAR(100),
    eligibility_criteria_ar TEXT,
    eligibility_criteria_en TEXT,
    service_type VARCHAR(50) DEFAULT 'online',
    department_name_ar VARCHAR(255),
    department_name_en VARCHAR(255),
    department_phone VARCHAR(50),
    department_email VARCHAR(255),
    location_address_ar TEXT,
    location_address_en TEXT,
    application_steps_ar TEXT[],
    application_steps_en TEXT[],
    legal_basis_ar TEXT,
    is_online BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SERVICE APPLICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.service_applications (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE NOT NULL,
    service_id INTEGER REFERENCES public.services(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    application_data JSONB,
    status VARCHAR(50) DEFAULT 'draft',
    tracking_number VARCHAR(100) UNIQUE,
    submitted_at TIMESTAMP,
    reviewed_at TIMESTAMP,
    completed_at TIMESTAMP,
    estimated_completion_date DATE,
    fee_amount DECIMAL(10,2),
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_receipt_url TEXT,
    uploaded_documents JSONB,
    reviewer_notes TEXT,
    citizen_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COMPLAINTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.complaints (
    id SERIAL PRIMARY KEY,
    complaint_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attachment_url TEXT,
    governorate VARCHAR(50) DEFAULT 'giza',
    status VARCHAR(50) DEFAULT 'pending',
    status_reason TEXT,
    assigned_to VARCHAR(100),
    resolution_notes TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NEWS
-- ============================================
CREATE TABLE IF NOT EXISTS public.governorate_news (
    id SERIAL PRIMARY KEY,
    news_number VARCHAR(50) UNIQUE NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    summary_ar TEXT,
    summary_en TEXT,
    content_ar TEXT NOT NULL,
    content_en TEXT,
    category VARCHAR(50),
    priority INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    featured_image TEXT,
    gallery_images TEXT[],
    video_url VARCHAR(500),
    video_embed_code TEXT,
    attachments TEXT[],
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'published',
    created_by INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.governorate_events (
    id SERIAL PRIMARY KEY,
    event_number VARCHAR(50) UNIQUE NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    event_type VARCHAR(50) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    location_ar VARCHAR(255),
    location_en VARCHAR(255),
    address_ar TEXT,
    address_en TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    organizer_ar VARCHAR(255),
    organizer_en VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    website VARCHAR(255),
    ticket_info_ar TEXT,
    ticket_info_en TEXT,
    is_free BOOLEAN DEFAULT true,
    fee_ar VARCHAR(100),
    status VARCHAR(50) DEFAULT 'upcoming',
    featured_image TEXT,
    gallery_images TEXT[],
    tags TEXT[],
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- EVENT SUGGESTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.event_suggestions (
    id SERIAL PRIMARY KEY,
    suggestion_number VARCHAR(50) UNIQUE NOT NULL,
    event_id INTEGER REFERENCES public.governorate_events(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    citizen_name VARCHAR(255) NOT NULL,
    citizen_phone VARCHAR(20),
    citizen_email VARCHAR(255),
    suggestion_text TEXT NOT NULL,
    suggestion_type VARCHAR(50) DEFAULT 'improvement',
    status VARCHAR(50) DEFAULT 'pending',
    admin_response TEXT,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MARKETPLACE
-- ============================================
CREATE TABLE IF NOT EXISTS public.marketplace_categories (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_marketplace_categories_name_ar UNIQUE (name_ar)
);

CREATE TABLE IF NOT EXISTS public.marketplace_listings (
    id SERIAL PRIMARY KEY,
    listing_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES public.marketplace_categories(id) ON DELETE SET NULL,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT NOT NULL,
    description_en TEXT,
    price DECIMAL(12,2),
    price_negotiable BOOLEAN DEFAULT false,
    condition VARCHAR(50) DEFAULT 'new',
    images TEXT[],
    location VARCHAR(255),
    governorate VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    views INTEGER DEFAULT 0,
    expires_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.marketplace_inquiries (
    id SERIAL PRIMARY KEY,
    inquiry_number VARCHAR(50) UNIQUE NOT NULL,
    listing_id INTEGER REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
    from_user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- JOBS
-- ============================================
CREATE TABLE IF NOT EXISTS public.job_categories (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT uq_job_categories_name_ar UNIQUE (name_ar)
);

CREATE TABLE IF NOT EXISTS public.employers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    company_name_ar VARCHAR(255) NOT NULL,
    company_name_en VARCHAR(255),
    commercial_registration VARCHAR(100),
    tax_card_number VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.job_listings (
    id SERIAL PRIMARY KEY,
    job_number VARCHAR(50) UNIQUE NOT NULL,
    employer_id INTEGER REFERENCES public.employers(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES public.job_categories(id) ON DELETE SET NULL,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT NOT NULL,
    description_en TEXT,
    requirements_ar TEXT,
    requirements_en TEXT,
    location VARCHAR(255),
    governorate VARCHAR(100),
    employment_type VARCHAR(50),
    salary_from DECIMAL(10,2),
    salary_to DECIMAL(10,2),
    is_salary_negotiable BOOLEAN DEFAULT false,
    application_deadline DATE,
    is_active BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.job_applications (
    id SERIAL PRIMARY KEY,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    job_id INTEGER REFERENCES public.job_listings(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_national_id VARCHAR(20) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_email VARCHAR(255),
    cover_letter TEXT,
    cv_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DOCUMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.government_documents (
    id SERIAL PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    category VARCHAR(50),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    download_count INTEGER DEFAULT 0,
    publish_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.user_documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
    document_number VARCHAR(50) UNIQUE NOT NULL,
    category_id INTEGER,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description TEXT,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    verified_by INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- THEMES
-- ============================================
CREATE TABLE IF NOT EXISTS public.governorate_themes (
    id SERIAL PRIMARY KEY,
    governorate_slug VARCHAR(100) UNIQUE NOT NULL,
    primary_color VARCHAR(7) DEFAULT '#0066CC',
    secondary_color VARCHAR(7) DEFAULT '#003366',
    logo_url TEXT,
    footer_text_ar TEXT,
    footer_text_en TEXT,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GIFTED
-- ============================================
CREATE TABLE IF NOT EXISTS public.talent_categories (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    assessment_methods TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_talent_categories_name_ar UNIQUE (name_ar)
);

CREATE TABLE IF NOT EXISTS public.gifted_applications (
    id SERIAL PRIMARY KEY,
    application_number VARCHAR(50) UNIQUE NOT NULL,
    applicant_type VARCHAR(50) NOT NULL,
    applicant_name VARCHAR(255),
    applicant_phone VARCHAR(20),
    applicant_email VARCHAR(255),
    student_name VARCHAR(255) NOT NULL,
    student_national_id VARCHAR(20) NOT NULL,
    student_birth_date DATE NOT NULL,
    student_grade VARCHAR(50),
    student_school VARCHAR(255),
    student_governorate VARCHAR(100),
    student_district VARCHAR(100),
    talent_category_id INTEGER REFERENCES public.talent_categories(id) ON DELETE SET NULL,
    talent_description TEXT NOT NULL,
    achievements TEXT,
    supporting_docs TEXT[],
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.gifted_assessments (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES public.gifted_applications(id) ON DELETE CASCADE,
    assessment_stage VARCHAR(50) NOT NULL,
    assessor_name VARCHAR(255),
    assessor_title VARCHAR(255),
    assessment_date DATE,
    assessment_method VARCHAR(100),
    score DECIMAL(5,2),
    assessment_notes TEXT,
    recommendation VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.gifted_programs (
    id SERIAL PRIMARY KEY,
    program_code VARCHAR(50) UNIQUE NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES public.talent_categories(id) ON DELETE SET NULL,
    description_ar TEXT,
    description_en TEXT,
    program_type VARCHAR(50),
    duration_hours INTEGER,
    start_date DATE,
    end_date DATE,
    location VARCHAR(255),
    max_participants INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GOVERNOR Q&A
-- ============================================
CREATE TABLE IF NOT EXISTS public.governor_qa_questions (
    id SERIAL PRIMARY KEY,
    question_number VARCHAR(50) UNIQUE NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    user_name VARCHAR(255),
    user_phone VARCHAR(20),
    user_email VARCHAR(255),
    question_text TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending',
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.governor_qa_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER UNIQUE REFERENCES public.governor_qa_questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    answered_by VARCHAR(255),
    answered_by_title VARCHAR(255),
    answer_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT true
);

-- ============================================
-- SOCIAL / HEALTH
-- ============================================
CREATE TABLE IF NOT EXISTS public.social_assistance_requests (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    program_type VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    national_id VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    governorate VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    description TEXT NOT NULL,
    urgency_level VARCHAR(50) DEFAULT 'normal',
    is_anonymous BOOLEAN DEFAULT false,
    assigned_to VARCHAR(255),
    response_notes TEXT,
    resolved_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.state_funding_treatment_requests (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    citizen_name VARCHAR(255) NOT NULL,
    citizen_national_id VARCHAR(20) NOT NULL,
    citizen_phone VARCHAR(20) NOT NULL,
    citizen_email VARCHAR(255),
    governorate VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    diagnosis_ar TEXT NOT NULL,
    required_treatment_ar TEXT NOT NULL,
    medical_reports_url TEXT[],
    hospital_name_ar VARCHAR(255),
    hospital_type VARCHAR(50),
    urgency_level VARCHAR(50) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'pending',
    committee_decision TEXT,
    committee_meeting_date DATE,
    approved_amount DECIMAL(12,2),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.comprehensive_health_insurance_requests (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    head_of_family_name VARCHAR(255) NOT NULL,
    head_of_family_national_id VARCHAR(20) NOT NULL,
    head_of_family_phone VARCHAR(20) NOT NULL,
    head_of_family_email VARCHAR(255),
    governorate VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT,
    family_members JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    insurance_number VARCHAR(50),
    card_issue_date DATE,
    card_delivery_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.health_insurance_cards (
    id SERIAL PRIMARY KEY,
    insurance_number VARCHAR(50) UNIQUE NOT NULL,
    request_id INTEGER REFERENCES public.comprehensive_health_insurance_requests(id) ON DELETE CASCADE,
    card_serial_number VARCHAR(50),
    issue_date DATE,
    expiry_date DATE,
    card_status VARCHAR(50) DEFAULT 'pending',
    delivery_tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- GOLDEN CITIZEN
-- ============================================
CREATE TABLE IF NOT EXISTS public.golden_citizen_volunteers (
    id SERIAL PRIMARY KEY,
    volunteer_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    national_id VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    profession VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    bio TEXT,
    available_days VARCHAR(100),
    available_hours VARCHAR(100),
    location VARCHAR(255),
    governorate VARCHAR(100),
    district VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0,
    total_services INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.golden_citizen_services (
    id SERIAL PRIMARY KEY,
    volunteer_id INTEGER REFERENCES public.golden_citizen_volunteers(id) ON DELETE CASCADE,
    service_name_ar VARCHAR(255) NOT NULL,
    service_name_en VARCHAR(255),
    service_type VARCHAR(50) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    max_beneficiaries_per_day INTEGER DEFAULT 1,
    delivery_method VARCHAR(50) DEFAULT 'in_person',
    estimated_duration_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.golden_citizen_requests (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    service_id INTEGER REFERENCES public.golden_citizen_services(id) ON DELETE SET NULL,
    volunteer_id INTEGER REFERENCES public.golden_citizen_volunteers(id) ON DELETE SET NULL,
    citizen_name VARCHAR(255) NOT NULL,
    citizen_national_id VARCHAR(20) NOT NULL,
    citizen_phone VARCHAR(20) NOT NULL,
    citizen_email VARCHAR(255),
    citizen_address TEXT,
    governorate VARCHAR(100),
    district VARCHAR(100),
    preferred_date DATE,
    preferred_time TIME,
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    completion_notes TEXT,
    rating INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROPERTY
-- ============================================
CREATE TABLE IF NOT EXISTS public.building_violation_reconciliation (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_national_id VARCHAR(20) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_email VARCHAR(255),
    applicant_address TEXT,
    property_address TEXT NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    property_number VARCHAR(100),
    land_area DECIMAL(10,2),
    built_area DECIMAL(10,2),
    violation_description TEXT,
    construction_year INTEGER,
    attached_documents TEXT[],
    status VARCHAR(50) DEFAULT 'pending',
    committee_decision TEXT,
    estimated_fees DECIMAL(12,2),
    rejection_reason TEXT,
    reconciliation_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.hand_possession_legalization (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_national_id VARCHAR(20) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    applicant_email VARCHAR(255),
    applicant_address TEXT,
    property_type VARCHAR(50) NOT NULL,
    property_address TEXT NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    land_area DECIMAL(12,2),
    possession_years INTEGER,
    possession_description TEXT,
    attached_documents TEXT[],
    status VARCHAR(50) DEFAULT 'pending',
    committee_decision TEXT,
    estimated_value DECIMAL(12,2),
    rejection_reason TEXT,
    legalization_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TECH CENTERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.tech_centers (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address_ar TEXT NOT NULL,
    address_en TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    working_hours_ar VARCHAR(255),
    working_hours_en VARCHAR(255),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tech_centers_name_ar UNIQUE (name_ar)
);

CREATE TABLE IF NOT EXISTS public.tech_services (
    id SERIAL PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    estimated_duration_minutes INTEGER DEFAULT 30,
    fee_ar VARCHAR(100),
    fee_en VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tech_services_name_ar UNIQUE (name_ar)
);

CREATE TABLE IF NOT EXISTS public.center_services (
    center_id INTEGER REFERENCES public.tech_centers(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES public.tech_services(id) ON DELETE CASCADE,
    PRIMARY KEY (center_id, service_id)
);

CREATE TABLE IF NOT EXISTS public.service_bookings (
    id SERIAL PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    center_id INTEGER REFERENCES public.tech_centers(id) ON DELETE SET NULL,
    service_id INTEGER REFERENCES public.tech_services(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    citizen_name VARCHAR(255) NOT NULL,
    citizen_national_id VARCHAR(20) NOT NULL,
    citizen_phone VARCHAR(20) NOT NULL,
    citizen_email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CHATBOT
-- ============================================
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    intent VARCHAR(100),
    confidence DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.chatbot_training_data (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_national_id ON public.users(national_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category_id);
CREATE INDEX IF NOT EXISTS idx_service_applications_user ON public.service_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_service_applications_status ON public.service_applications(status);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.governorate_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.governorate_events(start_date);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_job_listings_active ON public.job_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_gifted_applications_status ON public.gifted_applications(status);
CREATE INDEX IF NOT EXISTS idx_governor_qa_questions_status ON public.governor_qa_questions(status);
CREATE INDEX IF NOT EXISTS idx_social_assistance_status ON public.social_assistance_requests(status);
CREATE INDEX IF NOT EXISTS idx_treatment_requests_status ON public.state_funding_treatment_requests(status);
CREATE INDEX IF NOT EXISTS idx_insurance_requests_status ON public.comprehensive_health_insurance_requests(status);
CREATE INDEX IF NOT EXISTS idx_golden_volunteers_status ON public.golden_citizen_volunteers(status);
CREATE INDEX IF NOT EXISTS idx_reconciliation_status ON public.building_violation_reconciliation(status);
CREATE INDEX IF NOT EXISTS idx_possession_status ON public.hand_possession_legalization(status);
CREATE INDEX IF NOT EXISTS idx_tech_centers_governorate ON public.tech_centers(governorate);
CREATE INDEX IF NOT EXISTS idx_service_bookings_date ON public.service_bookings(booking_date);

-- ============================================
-- FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION public.archive_expired_news()
RETURNS void AS $$
BEGIN
    UPDATE public.governorate_news
    SET status = 'archived'
    WHERE expires_at < NOW() AND status = 'published';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;