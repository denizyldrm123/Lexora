from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import sys
import os
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.word_service import update_word
load_dotenv()

from ai.meaning import (
    get_word_meaning,
    get_word_synonyms,
    get_word_examples
)

lexora = Flask(__name__)



@lexora.route("/")
def home():
    return render_template("index.html")

@lexora.route("/dictionary")
def dictionary():
    return render_template("dictionary.html")

@lexora.route("/library")
def library():
    return render_template("library.html")

@lexora.route("/streak")
def streak():
    return render_template("streak.html")



@lexora.route("/api/meaning", methods=["post"])
def api_meaning():
    data = request.get_json()
    text = data.get("text","")

    result = get_word_meaning(text)
    return jsonify({"meaning": result})


@lexora.route("/api/synonyms",methods=["POST"])
def api_synonyms():
    data = request.get_json()
    word = data.get("text","")
    synonyms_json = json.loads(get_word_synonyms(word))
    result = synonyms_json["synonyms"]
    update_word(
        word=word,
        synonyms=result
    )
    return jsonify({"synonyms":result})


@lexora.route("/api/examples",methods=["POST"])
def api_examples():
    data = request.get_json()
    text = data.get("text", "")

    result = get_word_examples(text)
    return jsonify({"examples" :result})

if __name__ == "__main__":
    lexora.run(debug=True)