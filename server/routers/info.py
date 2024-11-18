from typing import Annotated

from fastapi import APIRouter, Depends

from server.dependencies import get_chdlm_involvement_manager
from server.managers.chdlm_involvement import ChdlmInvolvementManager
from server.models.info import Info
from server.settings import settings

router = APIRouter(prefix="/info", tags=["info"])


@router.get("/", response_model=Info)
async def get_info(
    chdlm_involvement_manager: Annotated[ChdlmInvolvementManager, Depends(get_chdlm_involvement_manager)],
):
    extracted_data = chdlm_involvement_manager.get_timesheets_extracted_data()

    return Info(
        min_preceding_months=settings.min_preceding_months,
        max_preceding_months=settings.max_preceding_months,
        latest_extraction=extracted_data.extraction_info.timestamp,
    )
