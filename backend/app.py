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
    get_word_examples,
    get_word_translation
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

BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
DATA_DIR = os.path.join(BASE_DIR, "..", "database")
WORDS_DB = os.path.join(DATA_DIR, "words.json")

@lexora.route("/api/library")
def api_library():
    try:
        with open(WORDS_DB, "r") as f:
            data = json.load(f)

        words_dict = data.get("words", {})

        words_list = []

        for word, info in words_dict.items():
            words_list.append({
                "word": word,
                "meaning": info.get("meaning", ""),
                "synonyms": info.get("synonyms", []),
                "examples": info.get("examples", [])
            })

        return jsonify({
            "words": words_list
        })

    except Exception as e:
        print("Error loading library:", e)
        return jsonify({"words": []})

@lexora.route("/streak")
def streak():
    return render_template("streak.html")

@lexora.route("/api/meaning", methods=["post"])
def api_meaning():
    data = request.get_json()
    word = data.get("text","")
    meaning_json = json.loads(get_word_meaning(word))
    result = meaning_json["meaning"]
    update_word(
        word=word,
        meaning=result
    )
    return jsonify({"meaning":result})

@lexora.route("/api/translation", methods=["post"])
def api_translation():
    data = request.get_json()
    word = data.get("text","")
    translation_json = json.loads(get_word_translation(word))
    result = translation_json["meaning"]
    update_word(
        word=word,
        translation=result
    )
    return jsonify({"translation":result})



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
    word = data.get("text", "")
    example_json = json.loads(get_word_examples(word))
    result = example_json["examples"]
    update_word(
        word=word,
        examples=result
    )
    return jsonify({"examples" :result})


if __name__ == "__main__":
    lexora.run(debug=True)