import asyncio
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import engine
from app.models.household import Household
from app.models.dependent import Dependent

async def list_db_content():
    async with AsyncSession(engine) as session:
        # Get households
        h_result = await session.execute(select(Household))
        households = h_result.scalars().all()
        
        # Get dependents
        d_result = await session.execute(select(Dependent))
        dependents = d_result.scalars().all()
        
        print("\n" + "="*80)
        print(f"📊 DATABASE SUMMARY (Total Households: {len(households)})")
        print("="*80)
        
        for h in households:
            h_deps = [d for d in dependents if d.household_id == h.id]
            print(f"\n🏠 Household: {h.name} (@{h.username})")
            print(f"   ID: {h.id}")
            print(f"   Type: {h.user_type} | Lang: {h.primary_language}")
            print(f"   Location: {h.village_town}, {h.district}, {h.state}")
            
            if h_deps:
                print("   👶 Dependents:")
                for d in h_deps:
                    print(f"      - {d.name} ({d.type}, {d.sex}) DOB: {d.date_of_birth}")
            else:
                print("   (No dependents registered)")
        
        print("\n" + "="*80)

if __name__ == "__main__":
    asyncio.run(list_db_content())
