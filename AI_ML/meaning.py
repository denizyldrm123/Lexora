from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_word_meaning(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Give the meaning clearly and simply."},
            {"role": "user", "content": f"Meaning of: {text}"}
        ]
    )
    return response.choices[0].message.content


def get_word_synonyms(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Return exactly 3 synonyms or related words."},
            {"role": "user", "content": f"Give 3 synonyms for: {text}"}
        ]
    )
    return response.choices[0].message.content


def get_word_examples(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Provide 2–3 short example sentences."},
            {"role": "user", "content": f"Give example sentences for: {text}"}
        ]
    )
    return response.choices[0].message.content
