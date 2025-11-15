from openai import OpenAI
import os

# OpenAI client (API key .env'den alınır)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_word_meaning(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Explain the meaning simply and clearly."},
            {"role": "user", "content": f"Give the meaning of: {text}"}
        ]
    )

    meaning = response.choices[0].message.content
    return meaning


def get_word_example_sentence(text):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Use this word in a sentence"},
            {"role": "user", "content": f"use the word in s{text}"}
        ]
    )
    meaning = response.choices[0].message.content
    return meaning