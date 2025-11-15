import sys
import os
# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.loader import load_words, save_words

def update_word(word, meaning=None, synonyms=None, examples=None, translation=None):
    db = load_words()
    words = db.get("words",{})
    word = word.lover()

    if word not in words:
        words[word] = {}

    if meaning is not None:
        words[word]["meaning"] = meaning

    if synonyms is not None:
        words[word]["synonyms"] = synonyms

    if examples is not None:
        words[word]["examples"] = examples

    if translation is not None:
        words[word]["translation"] = translation

    db["words"] = words

    save_words(db)
    return words[word]
