import locale
import logging

from fastapi import FastAPI

from chdlm_mini_dashboard.routers import command, data, info

locale.setlocale(locale.LC_ALL, 'fr_CA')

logging.basicConfig(level=logging.INFO)
app = FastAPI()

app.include_router(command.router)
app.include_router(data.router)
app.include_router(info.router)
