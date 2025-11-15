import json
import os

WORDS_DB = "database/words.json"
USER_DB = "database/user.json"

# ---- WORDS ----
def load_words():
    if not os.path.exists(WORDS_DB):
        return {"Words":{}}

    with open(WORDS_DB, "r") as f:
        data= json.load(f)
    
    if "words" not in data:
        data={"words":{}}
    return data

def save_words(data):
    with open(WORDS_DB, "w") as f:
        json.dump(data, f, indent=4)

# ---- USER ----
def load_user():
    if not os.path.exists(USER_DB):
        return {"streak": 0, "last_opened": None}

    with open(USER_DB, "r") as f:
        return json.load(f)

def save_user(data):
    with open(USER_DB, "w") as f:
        json.dump(data, f, indent=4)
