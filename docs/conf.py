import json
import os
import sys, re
from datetime import datetime
from babel.dates import format_date
from docutils import io, nodes
from docutils.core import publish_doctree

sys.path.insert(0, os.path.abspath('.'))

source_suffix = '.rst'

project = 'angie'
copyright = '2024, zorion1234'
author = 'zorion1234'
release = '1'
html_title= 'angie'
favicon = "../_static/img/favicon.svg"
language = 'ru'


master_doc = 'index'

build_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'build', language)
sys.path.append(os.path.abspath('.'))

sys.path.append(os.path.abspath("./_ext"))
extensions = [
    'sphinx.ext.githubpages',
    'notfound.extension',
    'sphinxcontrib.sass',
]

# 404 page
notfound_template = 'partials/404.html'
notfound_urls_prefix = None

# scss
sass_src_dir = f'./_mytheme/static/scss'
sass_out_dir = f'./_mytheme/static'
sass_output_style = 'compact'
sass_include_paths = [f'./_mytheme/static']
sass_targets = {
 "style.scss": "style.css"
}


templates_path = ['_templates']
html_static_path = ['_static']

html_css_files = [
    'css/libs/pagination.min.css',
]

html_context = {
    'favicon': './_static/img/favicon.svg'
}

html_js_files = [
    ('js/libs/jquery.min.js', {'defer': 'defer'}),
    ('js/libs/pagination.min.js', {'defer': 'defer'}),
    ('js/customPagination.js', {'defer': 'defer'}),
    ('js/app.js', {'defer': 'defer'}),
]
html_theme = f"_mytheme"
html_theme_path = ["./"]
# html_theme_path = [f"./{language}/source/"]
smartquotes = False

# rst_prolog = open('global.rst', 'r').read()

def setup_my_func(app, pagename, templatename, context, doctree):

    def generate_context_meta(lang, context, path=""):
        context_metadata = read_metadata(f"./{lang}/source/{path}{context}.rst")
        return context_metadata

    def test_print():
        ""

    def from_json(mystring):
        json_obj = json.loads(mystring)
        return json_obj

    def to_json(list):
        str_list = str(list)
        formatted_str = str_list.replace('“', '"').replace('”', '"').replace('\'', '"').replace('"[', '[').replace(']"', ']')
        return formatted_str

    def static_file_exists(path: str, type = "sphinx"):

        if type == "sphinx":
            src_dir = app.env.srcdir

            abs_path = f'{src_dir}/{path}'
            is_path_exists = os.path.exists(abs_path)



    def date_format(date_str):
        locale = app.builder.config.language
        date_obj = datetime.strptime(date_str, "%d.%m.%Y")
        # print('date_obj', date_obj)
        formatted_date = format_date(date_obj, format='long', locale=locale).replace('г.', '')
        # print('date', formatted_date)
        return formatted_date

    def read_metadata(filename):
        try:
            with open(filename, mode='r', encoding='utf8') as f:
                rst_content = f.read()

            # Удаление директивы toctree
            rst_content = re.sub(r'\.\. toctree::.*?(\n\s+.*)*', '', rst_content, flags=re.DOTALL)

            doctree = publish_doctree(rst_content)
            metadata = {}

            for node in doctree.traverse(nodes.field):
                name = node[0].astext()
                value = node[1].astext()
                metadata[name] = value

            return metadata
        except Exception as e:
            raise Exception(f"Error while try read file {filename}: {e}")

    context['generate_context_meta'] = generate_context_meta
    context['test_print'] = test_print
    context['from_json'] = from_json
    context['to_json'] = to_json
    context['static_file_exists'] = static_file_exists
    context['date_format'] = date_format

def add_meta_from_child_pages_to_index_pages(app, pagename, templatename, context, doctree):
    metadata_news = []
    metadata_products = []
    env = app.env
    all_pages = env.found_docs

    for page in all_pages:
        if ('products/' in page and page != 'products/index'):
            env.metadata[page]['page'] = page
            metadata_products.append(env.metadata[page])

        if ('company/news/' in page and page != 'company/news/index'):
            env.metadata[page]['page'] = page
            metadata_news.append(env.metadata[page])


    env.metadata['products/index']['products'] = metadata_products
    env.metadata['company/news/index']['news'] = metadata_news

def setup(app):
    app.connect("html-page-context", add_meta_from_child_pages_to_index_pages)
    app.connect("html-page-context", setup_my_func)
