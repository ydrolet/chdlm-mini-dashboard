import base64
import logging
import os
import socket
from email.mime.text import MIMEText

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from pydantic import FilePath


class GoogleApiClient:
    def __init__(self, token_file: FilePath, scopes: list[str]):
        self.token_file = token_file

        if os.path.exists(token_file):
            self.credentials = Credentials.from_authorized_user_file(token_file, scopes)
        else:
            raise FileNotFoundError(f'Token file "{token_file.absolute()} not found')

        self._check_token()

    def _check_token(self):
        if not self.credentials or not self.credentials.valid:
            if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                self.credentials.refresh(Request())
                with open(self.token_file, "w") as token:
                    token.write(self.credentials.to_json())

    def execute_script_function(self, script_id: str, function_name: str):
        self._check_token()

        try:
            socket.setdefaulttimeout(300)

            service = build("script", "v1", credentials=self.credentials)

            response = service.scripts().run(
                scriptId=script_id,
                body={
                    "function": function_name
                }
            ).execute()

            if "error" in response:
                raise Exception(response["error"])

            return response
        finally:
            socket.setdefaulttimeout(60)

    def send_email(self,
                   subject: str,
                   html_content: str,
                   recipient_email_address: str,
                   ):
        # TODO: Add quota check (https://developers.google.com/gmail/api/reference/quota)
        try:
            service = build("gmail", "v1", credentials=self.credentials)
            message = MIMEText(html_content, 'html')

            message["To"] = recipient_email_address
            message["Subject"] = subject

            result = (
                service.users()
                .messages()
                .send(userId="me", body={"raw": base64.urlsafe_b64encode(message.as_bytes()).decode()})
                .execute()
            )
        except HttpError as error:
            logging.error(f"An error occurred when sending email to {recipient_email_address}: {error}")
            result = None

        return result
