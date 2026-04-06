# Phase 1 Setup Guide: PostgreSQL Installation & Database Creation

## Prerequisites Check

PostgreSQL is not currently installed on this system. You have 3 options:

### Option 1: Install PostgreSQL via Chocolatey (RECOMMENDED - Easiest)

If you have Chocolatey installed:

```powershell
choco install postgresql -y
```

Then verify installation:
```powershell
psql --version
```

### Option 2: Install PostgreSQL via Direct Download

1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer (use default settings):
   - Port: 5432 (default)
   - Password: (leave empty for development, set DB_PASSWORD="" in .env)
   - Superuser: postgres
3. Verify installation:
   ```powershell
   psql --version
   ```

### Option 3: Use Windows Subsystem for Linux (WSL) - Alternative

If you prefer Linux environment:
```bash
wsl
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib -y
sudo service postgresql start
```

---

## Step 1: Create Database

After installing PostgreSQL, run:

```powershell
# Connect to PostgreSQL as superuser
psql -U postgres

# Inside psql prompt:
CREATE DATABASE n8n_traceability;
\q
```

Verify creation:
```powershell
psql -U postgres -l | findstr n8n_traceability
```

---

## Step 2: Deploy Schema

Run the schema.sql file to create all tables, views, and triggers:

```powershell
cd C:\Users\dylan.a.thomas\Projects\VSCode_March26
psql -U postgres -d n8n_traceability < Knowledge\observability\schema.sql
```

Verify tables created:
```powershell
psql -U postgres -d n8n_traceability -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';"
```

Expected output: `16` (total table count)

---

## Step 3: Verify All Components

### 3.1 Verify tables exist

```powershell
psql -U postgres -d n8n_traceability -c "
SELECT tablename FROM pg_tables 
WHERE schemaname='public' 
ORDER BY tablename;
"
```

Expected: 16 tables
- agent_runs
- mcp_tool_calls
- agent_decisions
- documents
- document_changes
- n8n_executions
- otel_spans
- otel_events
- trace_links
- tool_parameters
- decision_metrics
- span_tags
- execution_summary
- metric_values
- agent_statistics
- system_health

### 3.2 Verify views exist

```powershell
psql -U postgres -d n8n_traceability -c "
SELECT viewname FROM pg_views 
WHERE schemaname='public' 
ORDER BY viewname;
"
```

Expected: 3 views
- trace_links_details
- execution_summary
- metric_values

### 3.3 Verify indexes

```powershell
psql -U postgres -d n8n_traceability -c "
SELECT indexname, tablename FROM pg_indexes 
WHERE schemaname='public' 
ORDER BY tablename, indexname;
"
```

Expected: ~8-10 indexes on frequently queried columns

---

## Step 4: Run Python Database Test

Activate your Python environment and run the verification script:

```powershell
# Activate venv
. .\.venv\Scripts\Activate.ps1

# Run database test
python agents\database_test.py
```

### Expected Output:

```
Phase 1: Database Setup & Verification
==================================================

PostgreSQL Connection:
  [OK] Connected to PostgreSQL 15.x on ...

Tables Exist:
  [OK] All 16 tables exist

Views Exist:
  [OK] All 3 views exist

CRUD Operations:
  [OK] CRUD operations work (C,R,U,D all successful)

==================================================
Result: 4/4 tests passed
OK Phase 1 Complete - Database Ready!
```

---

## Troubleshooting

### Issue: "psql: command not found"
- **Cause**: PostgreSQL not installed
- **Solution**: Go back to Option 1, 2, or 3 above and install PostgreSQL

### Issue: "database 'n8n_traceability' does not exist"
- **Cause**: Database not created
- **Solution**: Run `CREATE DATABASE n8n_traceability;` in psql

### Issue: "permission denied" when running schema.sql
- **Cause**: File permissions issue
- **Solution**: Try from PowerShell directly instead of WSL

### Issue: "could not connect to server: No such file or directory"
- **Cause**: PostgreSQL service not running
- **Solution**: Start PostgreSQL service
  - Windows: Services → PostgreSQL → Start
  - WSL: `sudo service postgresql start`

### Issue: "psycopg2 module not found"
- **Cause**: psycopg2 not installed in venv
- **Solution**: Already installed via requirements-optimized.txt, just verify:
  ```powershell
  . .\.venv\Scripts\Activate.ps1
  pip list | findstr psycopg2
  ```

---

## Next Steps (Phase 2)

Once Phase 1 tests pass (4/4), Phase 2 is ready:
- Update sample_agent.py with correct Agent Framework v1.0.0b260107 API
- Run smoke_test.py to verify all 7/7 tests pass
- Est. time: 45 minutes

---

## Configuration Summary

Your `.env` file has been updated with:
```
DB_TYPE=postgresdb
DB_POSTGRESDB_DATABASE=n8n_traceability
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=
```

If you need to change credentials later, update these values in `.env`.

---

**Last Updated**: 2026-03-05
