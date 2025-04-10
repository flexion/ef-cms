DO $$
DECLARE
    r RECORD;
    sql TEXT;
BEGIN
    -- Update text/varchar columns with email-like values
    FOR r IN
        SELECT table_schema, table_name, column_name
        FROM information_schema.columns
        WHERE data_type IN ('text', 'character varying')
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
          AND table_schema NOT LIKE 'pg_toast%'
          AND table_schema NOT LIKE 'pg_temp%'
    LOOP
        sql := format(
            'UPDATE %I.%I
             SET %I = ''user_'' || floor(random()*100000)::int || ''@example.com''
             WHERE %I ~ ''^[^@]+@[^@]+\.[^@]+$''',
            r.table_schema, r.table_name, r.column_name, r.column_name
        );

        RAISE NOTICE 'Running: %', sql;
        EXECUTE sql;
    END LOOP;

    -- Scrub emails from json/jsonb columns
    FOR r IN
        SELECT table_schema, table_name, column_name, data_type
        FROM information_schema.columns
        WHERE data_type IN ('json', 'jsonb')
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
          AND table_schema NOT LIKE 'pg_toast%'
          AND table_schema NOT LIKE 'pg_temp%'
    LOOP
        sql := format(
            'UPDATE %I.%I
             SET %I = regexp_replace(%I::text,
                  ''[a-zA-Z0-9._%%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'',
                  ''user_'' || floor(random()*100000)::int || ''@example.com'', ''g'')::%s
             WHERE %I::text ~ ''[a-zA-Z0-9._%%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}''',
            r.table_schema, r.table_name, r.column_name,
            r.column_name, r.data_type, r.column_name
        );

        RAISE NOTICE 'Running: %', sql;
        EXECUTE sql;
    END LOOP;
END $$;

