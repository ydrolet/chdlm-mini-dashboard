import logging

import uvicorn
from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware

from server.routers import command, data, info

logging.basicConfig(level=logging.INFO)

# For TypeScript client generation (https://fastapi.tiangolo.com/advanced/generate-clients/)
def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"

app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
      "http://localhost:9185",
      "https://app.coopdelamontagne.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(command.router)
app.include_router(data.router)
app.include_router(info.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
