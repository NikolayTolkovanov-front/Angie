import os
import glob
from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import unquote
from bs4 import BeautifulSoup
import json

app = Flask(__name__)
CORS(app)

allowed_pages = ["new", "products"]

def is_valid_json(string):
    try:
        json.loads(string)
        return False
    except ValueError:
        return True

def search_text_in_html_files(directory, search_query, domain):
    html_files = glob.glob(os.path.join(directory, '**/*.html'), recursive=True)
    words_to_find = search_query.replace('#', '').lower().split() if search_query.startswith('#') else [search_query.lower()]
    results = []

    for file_path in html_files:
        if any(page in file_path for page in allowed_pages):
            try:
                with open(file_path, 'r', encoding='utf-8') as file:
                    content = file.read().lower()
                    soup = BeautifulSoup(content, 'html.parser')

                    for word in words_to_find:
                        elements = soup.find_all(string=lambda text: word in text.lower())

                        for element in elements:
                            if element.parent and element.parent.parent:
                                parent_element = element.parent.parent
                                snippet = str(parent_element).replace('"', "'")

                                meta_data = {
                                    "tag":  parent_element.name,
                                    "class": parent_element.get('class'),
                                    "id": parent_element.get('id'),
                                    "text": parent_element.get_text(),
                                }

                                if not is_valid_json(meta_data["text"]):
                                    continue

                                page_url = file_path.replace(directory, domain)
                                if any(result['page'] == page_url for result in results):
                                    continue

                                results.append({
                                    "query": word,
                                    "page": page_url,
                                    "html": snippet,
                                    "meta_data": meta_data,
                                    "parent_block": parent_element.prettify()
                                })

            except Exception as e:
                print(f'Ошибка при чтении файла {file_path}: {e}')

    return results

@app.route('/api/search', methods=['GET'])
def search():
    query = unquote(request.args.get('query', ''))
    domain = request.args.get('domain', '')
    directory = request.args.get('directory', '../docs/build')

    if not query:
        return jsonify({"error": "query parameter is required"}), 400

    if not domain:
        return jsonify({"error": "domain parameter is required"}), 400

    results = search_text_in_html_files(directory, query, domain)

    return jsonify(results)

if __name__ == '__main__':
    port = 8080
    app.run(debug=True, port=port)
