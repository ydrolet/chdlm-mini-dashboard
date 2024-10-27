from fastapi import APIRouter

from server.models.info import Info
from server.settings import settings

router = APIRouter(prefix="/info", tags=["info"])


@router.get("/", response_model=Info)
async def get_info():
    return Info(
        min_preceding_months=settings.min_preceding_months,
        max_preceding_months=settings.max_preceding_months,
    )
