# apps/api — WellSync AI Backend

FastAPI backend service.

## Stack

- **Framework**: FastAPI
- **Language**: Python 3.12+
- **Database**: Neon Postgres via Prisma (accessed through `packages/database`)
- **AI**: Groq API
- **Voice**: Vapi AI webhooks
- **Testing**: Pytest

## Development

```bash
# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start dev server
uvicorn app.main:app --reload --port 8000
```
