import asyncio
from services.alio_service import AlioService

async def test():
    service = AlioService()
    print("Testing fetch...")
    res = await service.fetch_active_jobs()
    print("Done:", res)

loop = asyncio.get_event_loop()
loop.run_until_complete(test())
