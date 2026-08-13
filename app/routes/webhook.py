from fastapi import APIRouter, Request


router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks"],
)


@router.post("/whatsapp")
async def webhook_whatsapp(request: Request):

    payload = await request.json()

    print("\n================ WEBHOOK WHATSAPP ================\n")
    print(payload)
    print("\n===================================================\n")

    return {
        "success": True
    }