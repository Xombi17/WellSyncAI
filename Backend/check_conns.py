import asyncio
import os
from sqlalchemy import text
from app.core.database import engine

async def check_connections():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT count(*) FROM pg_stat_activity WHERE datname = 'postgres';"))
        count = result.scalar()
        print(f"📊 Active connections: {count}")
        
        result = await conn.execute(text("SELECT usename, application_name, client_addr FROM pg_stat_activity WHERE datname = 'postgres';"))
        for row in result:
            print(f"👤 {row[0]} | 💻 {row[1]} | 🌐 {row[2]}")

if __name__ == "__main__":
    asyncio.run(check_connections())
