import re
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

from chdlm_mini_dashboard.dependencies import get_chdlm_involvement_manager
from chdlm_mini_dashboard.managers.chdlm_involvement import ChdlmInvolvementManager
from chdlm_mini_dashboard.models.commands import SendEmail, SendEmailResponse

router = APIRouter(prefix="/command")


@router.post("/send-email/", response_model=SendEmailResponse, status_code=202)
async def send_email(
        command: SendEmail,
        chdlm_involvement_manager: Annotated[ChdlmInvolvementManager, Depends(get_chdlm_involvement_manager)],
        background_tasks: BackgroundTasks
):
    try:
        chdlm_involvement_manager.google_api_client.check_token()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred when checking token validity: {e}")

    target_resident = (await chdlm_involvement_manager.get_residents_list())[command.resident_name]
    background_tasks.add_task(chdlm_involvement_manager.send_involvement_summary_email,
        target_resident,
        command.preceding_months,
    )

    return SendEmailResponse(
        resident_name=target_resident.full_name,
        preceding_months=command.preceding_months,
        masked_email_address=re.sub(r"(?<=.).(?=.*.@)", '*', target_resident.email_address),
    )
