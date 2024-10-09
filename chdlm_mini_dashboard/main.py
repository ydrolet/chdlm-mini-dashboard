import locale
import logging

import uvicorn
from fastapi import FastAPI
from fastapi.routing import APIRoute

from chdlm_mini_dashboard.routers import command, data, info

locale.setlocale(locale.LC_ALL, 'fr_CA')

logging.basicConfig(level=logging.INFO)


# For TypeScript client generation (https://fastapi.tiangolo.com/advanced/generate-clients/)
def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

app.include_router(command.router)
app.include_router(data.router)
app.include_router(info.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
