import re
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from chdlm_mini_dashboard.dependencies import get_chdlm_involvement_manager
from chdlm_mini_dashboard.helpers.utils import EmailSendingException
from chdlm_mini_dashboard.managers.chdlm_involvement import ChdlmInvolvementManager
from chdlm_mini_dashboard.models.commands import SendInvolvementSummaryEmail, SendInvolvementSummaryEmailResult

router = APIRouter(prefix="/command", tags=["command"])


@router.post("/send-email", response_model=SendInvolvementSummaryEmailResult)
async def send_involvement_summary_email(
        command: SendInvolvementSummaryEmail,
        chdlm_involvement_manager: Annotated[ChdlmInvolvementManager, Depends(get_chdlm_involvement_manager)],
):
    try:
        member = chdlm_involvement_manager.send_involvement_summary_email(
            command.member_full_name,
            command.preceding_months,
        )
    except KeyError as e:
        raise HTTPException(status_code=404, detail=f"Le résident '{command.member_full_name}' est introuvable.")
    except EmailSendingException:
        raise HTTPException(status_code=500, detail=f"Une erreur s'est produite lors de l'envoi du courriel.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Une erreur inattendue s'est produite: {e}")

    return SendInvolvementSummaryEmailResult(
        member_full_name=member.full_name,
        preceding_months=command.preceding_months,
        masked_email_address=re.sub(r"(?<=.).(?=.*.@)", '*', member.email_address),
    )
