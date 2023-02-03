import jinja2
from jinja2 import FileSystemLoader


def init_templating(templates_dir):
    return jinja2.Environment(loader=FileSystemLoader(templates_dir))
