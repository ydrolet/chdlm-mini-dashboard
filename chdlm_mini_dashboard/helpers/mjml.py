from pathlib import Path

import jinja2
from mjml import mjml2html


def render_mjml_template_to_html(mjml_template_file: Path, context: dict | None = None) -> str:
    environment = jinja2.Environment()
    mjml_template = environment.from_string(mjml_template_file.read_text(encoding="utf-8"))
    mjml_template.globals.update({})
    rendered_mjml_template = mjml_template.render(context or {})
    return mjml2html(rendered_mjml_template)
