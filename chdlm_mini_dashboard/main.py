import locale
import logging

from fastapi import FastAPI

from chdlm_mini_dashboard.routers import commands

locale.setlocale(locale.LC_ALL, 'fr_CA')

logging.basicConfig(level=logging.INFO)
app = FastAPI()

app.include_router(commands.router)
