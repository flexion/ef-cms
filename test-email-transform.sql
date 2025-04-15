-- Email Anonymization Script
-- This script updates all email fields and fields that might contain emails
-- with a standardized anonymized email address format

-- Set parameters for email anonymization
DO $$
DECLARE
  anonymized_domain VARCHAR := 'example.com';
  prefix VARCHAR := 'user';
BEGIN
  RAISE NOTICE 'Starting email anonymization process...';

  -- Function to anonymize emails within JSON(B) fields
  CREATE OR REPLACE FUNCTION anonymize_email(email TEXT) 
  RETURNS TEXT AS $$
  BEGIN
    IF email IS NULL OR email = '' OR position('@' in email) = 0 THEN
      RETURN email;
    END IF;
    RETURN prefix || '_' || MD5(email) || '@' || anonymized_domain;
  END;
  $$ LANGUAGE plpgsql;

  -- Function to process JSON objects and anonymize email fields within them
  CREATE OR REPLACE FUNCTION anonymize_json_emails(data JSONB)
  RETURNS JSONB AS $$
  DECLARE
    result JSONB := data;
    k TEXT;
    v JSONB;
  BEGIN
    IF data IS NULL OR jsonb_typeof(data) != 'object' THEN
      RETURN data;
    END IF;
    
    FOR k, v IN SELECT * FROM jsonb_each(data)
    LOOP
      IF jsonb_typeof(v) = 'object' THEN
        -- Recursively process nested objects
        result := result || jsonb_build_object(k, anonymize_json_emails(v));
      ELSIF jsonb_typeof(v) = 'array' THEN
        -- Process arrays
        result := result || jsonb_build_object(k, anonymize_json_array_emails(v));
      ELSIF jsonb_typeof(v) = 'string' AND 
            (k LIKE '%email%' OR k LIKE '%Email%' OR 
             (v::TEXT LIKE '%@%' AND v::TEXT LIKE '%.%')) THEN
        -- Anonymize email fields
        result := result || jsonb_build_object(k, to_jsonb(anonymize_email(v::TEXT)));
      END IF;
    END LOOP;
    
    RETURN result;
  END;
  $$ LANGUAGE plpgsql;

  -- Function to process JSON arrays and anonymize email fields within them
  CREATE OR REPLACE FUNCTION anonymize_json_array_emails(data JSONB)
  RETURNS JSONB AS $$
  DECLARE
    result JSONB := '[]'::JSONB;
    item JSONB;
  BEGIN
    IF data IS NULL OR jsonb_typeof(data) != 'array' THEN
      RETURN data;
    END IF;
    
    FOR item IN SELECT * FROM jsonb_array_elements(data)
    LOOP
      IF jsonb_typeof(item) = 'object' THEN
        result := result || jsonb_build_array(anonymize_json_emails(item));
      ELSIF jsonb_typeof(item) = 'array' THEN
        result := result || jsonb_build_array(anonymize_json_array_emails(item));
      ELSE
        result := result || jsonb_build_array(item);
      END IF;
    END LOOP;
    
    RETURN result;
  END;
  $$ LANGUAGE plpgsql;

  -- Update tables with direct email columns
  -- Based on the schema files, look for potential email fields

  -- 1. Update workitem table's docket_entry column which contains JSON data
  RAISE NOTICE 'Processing workitem table...';
  UPDATE workitem
  SET docket_entry = anonymize_json_emails(docket_entry::jsonb)::jsonb
  WHERE docket_entry IS NOT NULL;

  -- 2. Process any other tables with email fields
  -- Note: Based on the shared schemas, explicit email fields weren't found
  -- but we can look for commonly named email columns

  RAISE NOTICE 'Processing tables with potential email fields...';
  
  -- Check if users table exists and update email fields
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
    EXECUTE 'UPDATE users SET email = anonymize_email(email) WHERE email IS NOT NULL';
    EXECUTE 'UPDATE users SET service_email = anonymize_email(service_email) WHERE service_email IS NOT NULL';
  END IF;

  -- Check for contact_primary and contact_secondary in case table
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'case' AND column_name = 'contact_primary'
  ) THEN
    EXECUTE 'UPDATE "case" SET contact_primary = anonymize_json_emails(contact_primary::jsonb)::jsonb WHERE contact_primary IS NOT NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'case' AND column_name = 'contact_secondary'
  ) THEN
    EXECUTE 'UPDATE "case" SET contact_secondary = anonymize_json_emails(contact_secondary::jsonb)::jsonb WHERE contact_secondary IS NOT NULL';
  END IF;

  -- Process petitioners data if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'case' AND column_name = 'petitioners'
  ) THEN
    EXECUTE 'UPDATE "case" SET petitioners = anonymize_json_array_emails(petitioners::jsonb)::jsonb WHERE petitioners IS NOT NULL';
  END IF;

  -- Process any JSON columns in tables mentioned in the schema files
  RAISE NOTICE 'Processing JSON columns in all tables...';

  -- Process case_correspondence table
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'case_correspondence') THEN
    -- Look for JSON/JSONB columns
    FOR r IN 
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'case_correspondence' 
      AND data_type IN ('json', 'jsonb')
    LOOP
      EXECUTE format('UPDATE case_correspondence SET %I = anonymize_json_emails(%I::jsonb)::jsonb WHERE %I IS NOT NULL', 
                    r.column_name, r.column_name, r.column_name);
    END LOOP;
  END IF;

  -- Process other tables similarly
  DECLARE
    tables TEXT[] := ARRAY['case', 'case_deadline', 'case_worksheet', 'docket_entry', 'user_case_note', 'workitem'];
    table_name TEXT;
  BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
      FOR r IN 
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = table_name 
        AND data_type IN ('json', 'jsonb')
      LOOP
        EXECUTE format('UPDATE %I SET %I = anonymize_json_emails(%I::jsonb)::jsonb WHERE %I IS NOT NULL', 
                      table_name, r.column_name, r.column_name, r.column_name);
      END LOOP;
    END LOOP;
  END;

  -- Clean up temp functions
  DROP FUNCTION IF EXISTS anonymize_email;
  DROP FUNCTION IF EXISTS anonymize_json_emails;
  DROP FUNCTION IF EXISTS anonymize_json_array_emails;
  
  RAISE NOTICE 'Email anonymization completed successfully.';
END $$;

