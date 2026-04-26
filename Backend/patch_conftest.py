import sys

with open("tests/conftest.py", "r") as f:
    content = f.read()

override_code = """
from fastapi import Request
import json

async def override_get_current_household(request: Request, session: AsyncSession = Depends(get_session)):
    # Very permissive auth mock for tests
    try:
        body = await request.json()
        if "household_id" in body:
            h = await session.get(Household, body["household_id"])
            if h: return h
    except Exception:
        pass
        
    h_id = request.query_params.get("household_id")
    if h_id:
        h = await session.get(Household, h_id)
        if h: return h
        
    path = request.url.path
    if "/households/" in path:
        parts = path.split("/households/")
        if len(parts) > 1:
            h_id = parts[1].split("/")[0]
            if h_id:
                h = await session.get(Household, h_id)
                if h: return h

    h = (await session.execute(select(Household))).scalars().first()
    if h: return h
    return Household(id="dummy", username="dummy", name="Dummy", password_hash="hash")

app.dependency_overrides[get_current_household] = override_get_current_household
"""

if "override_get_current_household" not in content:
    content = content.replace("app.dependency_overrides[get_session] = override_get_session", "app.dependency_overrides[get_session] = override_get_session\n    " + override_code.replace('\n', '\n    '))
    with open("tests/conftest.py", "w") as f:
        f.write(content)
