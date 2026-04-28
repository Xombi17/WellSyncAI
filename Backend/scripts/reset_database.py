import asyncio
import os
import sys

# Add the Backend directory to the python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, ".env"))

from sqlalchemy import text
from app.core.database import engine

async def reset_database():
    print("Starting database reset...")
    async with engine.begin() as conn:
        # Truncate other tables first using CASCADE to handle any potential FKs we missed
        other_tables = [
            "conversations", 
            "health_notes", 
            "growth_records", 
            "medicine_regimens", 
            "pregnancy_profiles"
        ]
        for table in other_tables:
            await conn.execute(text(f"TRUNCATE TABLE {table} CASCADE;"))
            print(f"Truncated {table}.")

        # 1. Delete health_events
        result = await conn.execute(text("DELETE FROM health_events;"))
        print(f"Deleted {result.rowcount} rows from health_events.")
        
        # 3. Delete reminders
        result = await conn.execute(text("DELETE FROM reminders;"))
        print(f"Deleted {result.rowcount} rows from reminders.")
        
        # 2. Delete dependents
        result = await conn.execute(text("DELETE FROM dependents;"))
        print(f"Deleted {result.rowcount} rows from dependents.")
        
        # 4. Delete households
        result = await conn.execute(text("DELETE FROM households;"))
        print(f"Deleted {result.rowcount} rows from households.")

    print("Database reset completed successfully.")

if __name__ == "__main__":
    asyncio.run(reset_database())
