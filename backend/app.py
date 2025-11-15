from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
load_dotenv()
from ai.meaning  import (
    get_word_meaning,
    get_word_synonyms,
    get_word_examples
)
import os 

lexora = Flask(__name__)


@lexora.route("/")
def home():
    return render_template("dictionary.html")

@lexora.route("/api/meaning", methods=["post"])
def api_meaning():
    data = request.get_json()
    text = data.get("text","")

    result = get_word_meaning(text)
    return jsonify({"meaning": result})

@lexora.route("/api/synonyms",methods=["POST"])
def api_synonyms():
    data = request.get_json()
    text = data.get("text","")
    result = get_word_synonyms(text)
    return jsonify({"synonyms":result})

@lexora.route("/api/examples",methods=["POST"])
def api_examles():
    data = request.get_json()
    text = data.get("text", "")

    result = get_word_examples(text)
    return jsonify({"examples" :result})

if __name__ == "__main__":
    lexora.run(debug=True)