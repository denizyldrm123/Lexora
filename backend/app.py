from flask import Flask, request, jsonify, render_template
from ai.meaning import (
    get_word_meaning,
    get_word_synonyms,
    get_word_examples
)
import os 
from dotenv import load_dotenv

lexora = Flask(__name__)
client =OpenAI(api_keys=os.getenv("OPENAI_API_KEY"))
load_dotenv()

@lexora.route("/")
def home():
    return render_template("mainpage.html")
