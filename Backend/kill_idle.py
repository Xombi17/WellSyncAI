import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

async def kill_idle():
    url = "postgresql+asyncpg://postgres:Oxamm7eE3RoubzZ1@db.azvvmmekxfcuzdadxlub.supabase.co:5432/postgres"
    engine = create_async_engine(url)
    async with engine.begin() as conn:
        print("🧹 Killing idle connections for 'postgres' user...")
        # Kil all postgres connections that are NOT current one
        # pid != pg_backend_pid()
        await conn.execute(text("""
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE usename = 'postgres'
            AND pid != pg_backend_pid();
        """))
        print("✅ Done!")

if __name__ == "__main__":
    asyncio.run(kill_idle())
