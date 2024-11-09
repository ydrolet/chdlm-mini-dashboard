import yaml

from server.main import app

with open("app/openapi/chdlm/openapi.yaml", "wt") as f:
    yaml.dump(app.openapi(), f)
