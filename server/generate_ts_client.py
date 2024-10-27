###############################################################################################################
# TypeScript client generator based on this guide: https://fastapi.tiangolo.com/advanced/generate-clients/
###############################################################################################################
import json
import subprocess
from pathlib import Path

from server.main import app

openapi_content = app.openapi()

for path_data in openapi_content["paths"].values():
    for operation in path_data.values():
        tag = operation["tags"][0]
        operation_id = operation["operationId"]
        to_remove = f"{tag}-"
        new_operation_id = operation_id[len(to_remove) :]
        operation["operationId"] = new_operation_id

openapi_file_path = Path("/tmp/chdlm-mini-dashboard-openapi.json")
openapi_file_path.write_text(json.dumps(openapi_content))

openapi_ts_config_path = Path("/tmp/openapi-ts.config.json")
openapi_ts_config_path.write_text(json.dumps({
    "client": "@hey-api/client-axios",
    "input": openapi_file_path.as_posix(),
    "output": "app/src/clients/chdlm",
    "services": {"asClass": True},
}))

subprocess.run(["npx", "@hey-api/openapi-ts", "--file", openapi_ts_config_path.as_posix()])
