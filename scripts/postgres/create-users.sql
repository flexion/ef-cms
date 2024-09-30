-- RUN BOTH OF THESE STATEMENTS IN SQL AFTER RDS CLUSTER IS CREATED

CREATE USER ENVREPLACEME_dawson WITH LOGIN;
GRANT rds_iam TO ENVREPLACEME_dawson;
GRANT CONNECT ON DATABASE ENVREPLACEME_dawson TO ENVREPLACEME_dawson;
GRANT USAGE ON SCHEMA public TO ENVREPLACEME_dawson;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ENVREPLACEME_dawson;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ENVREPLACEME_dawson;
GRANT CREATE ON SCHEMA public TO ENVREPLACEME_dawson;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ENVREPLACEME_dawson;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO ENVREPLACEME_dawson;

CREATE USER ENVREPLACEME_developers WITH LOGIN;
GRANT rds_iam TO ENVREPLACEME_developers;
GRANT CONNECT ON DATABASE ENVREPLACEME_dawson TO ENVREPLACEME_developers;
GRANT USAGE ON SCHEMA public TO ENVREPLACEME_developers;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ENVREPLACEME_developers;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ENVREPLACEME_developers;
GRANT CREATE ON SCHEMA public TO ENVREPLACEME_developers;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ENVREPLACEME_developers;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO ENVREPLACEME_developers;
