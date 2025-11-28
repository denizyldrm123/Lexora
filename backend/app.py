from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
import sys
import os
import json

# Add parent directory to path to access both database and services
current_dir = os.path.dirname(os.path.abspath(__file__))  # backend/
parent_dir = os.path.dirname(current_dir)  # lexora/
sys.path.append(parent_dir)

# Now we can import from both database and services
from database.loader import load_words, save_words
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
    print("api library worked")
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
    print("meaning router is called")
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
    print("translation router is called")
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
    print("synonyms router is called")
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
    print("examples  router is called")
    data = request.get_json()
    word = data.get("text", "")
    example_json = json.loads(get_word_examples(word))
    result = example_json["examples"]
    update_word(
        word=word,
        examples=result
    )
    return jsonify({"examples" :result})

@lexora.route("/api/delete-word", methods=["POST"])
def api_delete_word():
    try:
        data = request.get_json()
        print("🔍 Received data:", data)  # ✅ EKLE
        
        word = data.get("text", "")
        print("🔍 Word extracted:", word)  # ✅ EKLE
        
        if not word:
            print("❌ Word is empty!")  # ✅ EKLE
            return jsonify({"error": "Word is required"}), 400
        
        db = load_words()
        words = db.get("words", {})
        word_lower = word.lower()
        
        print("🔍 Looking for word:", word_lower)  # ✅ EKLE
        print("🔍 Available words:", list(words.keys()))  # ✅ EKLE
        
        if word_lower in words:
            del words[word_lower]
            db["words"] = words
            save_words(db)
            print("✅ Word deleted successfully")  # ✅ EKLE
            return jsonify({"success": True, "deleted": word})
        else:
            print("❌ Word not found in database")  # ✅ EKLE
            return jsonify({"error": "Word not found"}), 404
            
    except Exception as e:
        print("❌ Exception:", str(e))  # ✅ EKLE
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    lexora.run(debug=True)