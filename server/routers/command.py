from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from server.dependencies import get_chdlm_involvement_manager
from server.helpers.utils import EmailSendingException, NoEmailAddress, mask_email_address
from server.managers.chdlm_involvement import ChdlmInvolvementManager
from server.models.commands import EmailedInvolvementSummaryRequest, EmailedInvolvementSummaryRequestResult

router = APIRouter(prefix="/command", tags=["command"])


@router.post("/send-email", response_model=EmailedInvolvementSummaryRequestResult)
async def send_involvement_summary_email(
        command: EmailedInvolvementSummaryRequest,
        chdlm_involvement_manager: Annotated[ChdlmInvolvementManager, Depends(get_chdlm_involvement_manager)],
):
    try:
        member = chdlm_involvement_manager.send_involvement_summary_email(
            command.member_full_name,
            command.preceding_months,
        )
    except KeyError:
        raise HTTPException(status_code=404, detail=f"Le résident '{command.member_full_name}' est introuvable.")
    except NoEmailAddress:
        raise HTTPException(status_code=406, detail=f"Le résident '{command.member_full_name}' n'a pas d'adresse courriel.")
    except EmailSendingException:
        raise HTTPException(status_code=500, detail=f"Une erreur s'est produite lors de l'envoi du courriel.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Une erreur inattendue s'est produite: {e}")

    return EmailedInvolvementSummaryRequestResult(
        member_full_name=member.full_name,
        preceding_months=command.preceding_months,
        masked_email_address=mask_email_address(member.email_address),
    )
