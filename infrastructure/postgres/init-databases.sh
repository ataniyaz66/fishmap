#!/bin/bash
set -e
set -u

# Function to create a user and database if they do not exist
function create_service_db() {
    local db_name=$1
    local db_user=$2
    local db_password=$3
    local enable_postgis=${4:-false}

    echo "Checking and configuring database '$db_name' for user '$db_user'..."

    # Check if user exists, if not create
    local user_exists
    user_exists=$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_roles WHERE rolname='$db_user';")
    if [ "$user_exists" != "1" ]; then
        echo "Creating user '$db_user'..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
            CREATE USER $db_user WITH ENCRYPTED PASSWORD '$db_password';
EOSQL
    else
        echo "User '$db_user' already exists, updating password..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
            ALTER USER $db_user WITH ENCRYPTED PASSWORD '$db_password';
EOSQL
    fi

    # Check if database exists, if not create
    local db_exists
    db_exists=$(psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$db_name';")
    if [ "$db_exists" != "1" ]; then
        echo "Creating database '$db_name' owned by '$db_user'..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
            CREATE DATABASE $db_name OWNER $db_user;
EOSQL
    else
        echo "Database '$db_name' already exists, ensuring owner is '$db_user'..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
            ALTER DATABASE $db_name OWNER TO $db_user;
EOSQL
    fi

    # Grant privileges and ensure schema access in PostgreSQL 15+
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$db_name" <<-EOSQL
        GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;
        GRANT ALL ON SCHEMA public TO $db_user;
EOSQL

    # Enable PostGIS if requested and available
    if [ "$enable_postgis" = "true" ]; then
        echo "Enabling PostGIS extension in '$db_name'..."
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$db_name" <<-EOSQL
            CREATE EXTENSION IF NOT EXISTS postgis;
EOSQL
    fi

    echo "Database '$db_name' configured successfully."
}

# Service databases configuration: db_name, user, password, enable_postgis
create_service_db "fishmap_auth" "fishmap_auth" "fishmap_auth_dev_password" false
create_service_db "fishmap_users" "fishmap_users" "fishmap_users_dev_password" false
create_service_db "fishmap_fishing" "fishmap_fishing" "fishmap_fishing_dev_password" true
create_service_db "fishmap_inventory" "fishmap_inventory" "fishmap_inventory_dev_password" false
create_service_db "fishmap_social" "fishmap_social" "fishmap_social_dev_password" false
create_service_db "fishmap_chat" "fishmap_chat" "fishmap_chat_dev_password" false
create_service_db "fishmap_media" "fishmap_media" "fishmap_media_dev_password" false
create_service_db "fishmap_weather" "fishmap_weather" "fishmap_weather_dev_password" false
create_service_db "fishmap_ai" "fishmap_ai" "fishmap_ai_dev_password" false

echo "All FishMap service databases and users initialized."
