from typing import Annotated

from fastapi import APIRouter, Depends

from chdlm_mini_dashboard.dependencies import get_chdlm_involvement_manager
from chdlm_mini_dashboard.managers.chdlm_involvement import ChdlmInvolvementManager
from chdlm_mini_dashboard.models.chdlm_involvement_data import MemberStatus

router = APIRouter(prefix="/data")


@router.get("/members", response_model=list[str])
async def members_list(
        chdlm_involvement_manager: Annotated[ChdlmInvolvementManager, Depends(get_chdlm_involvement_manager)],
):
    members = chdlm_involvement_manager.get_members_involvement_data()
    return sorted([member.full_name for member in members.values() if member.member_status != MemberStatus.former])
