from dataclasses import dataclass

import httpx


@dataclass
class From:
    email: str
    name: str


class MailgunClient:
    def __init__(self, api_key: str, domain_name: str):
        self.api_key = api_key
        self.domain_name = domain_name

    def send_email(self,
                   from_: From,
                   to: str,
                   subject: str,
                   html_content: str,
                   ):
        return httpx.post(
            f"https://api.mailgun.net/v3/{self.domain_name}/messages",
            auth=("api", self.api_key),
            data={"from": f"{from_.name} <{from_.email}>",
                  "to": to,
                  "subject": subject,
                  "html": html_content,
                  })
