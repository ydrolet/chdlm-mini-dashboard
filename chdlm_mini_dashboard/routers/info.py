from fastapi import APIRouter

from chdlm_mini_dashboard.models.info import Info
from chdlm_mini_dashboard.settings import settings

router = APIRouter(prefix="/info")


@router.get("/", response_model=Info)
async def get_info():
    return Info(
        min_preceding_months=settings.min_preceding_months,
        max_preceding_months=settings.max_preceding_months,
    )
