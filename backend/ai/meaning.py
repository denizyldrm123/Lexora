from openai import OpenAI
import os

def get_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_word_meaning1(text):
    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Give the meaning clearly and simply."},
            {"role": "user", "content": f"Meaning of: {text}"}
        ]
    )
    return response.choices[0].message.content

def get_word_meaning(word):
    client = get_client()

    input_prompt = (
        f"Generate the English definition of the word '{word}'.\n"
        "Return ONLY a JSON object in this exact format:\n"
        "{ \"meaning_en\": \"<English definition>\" }\n"
        "Rules:\n"
        "- Only one line English definition.\n"
        "- No Turkish meaning.\n"
        "- No examples.\n"
        "- No synonyms.\n"
        "- Output MUST be valid JSON ONLY."
    )

    response = client.responses.create(
        model="gpt-4o-mini",
        input=input_prompt
    )

    return response.output_text


def get_word_synonyms(word):
    client = get_client()
    input_prompt = (
        f"Generate synonyms for the word '{word}'.\n"
        "Return ONLY a JSON object:\n"
        "{ \"synonyms\": [\"syn1\", \"syn2\", \"syn3\"] }\n"
        "Rules:\n"
        "- EXACTLY 3 English synonyms.\n"
        "- No Turkish meaning.\n"
        "- No definitions.\n"
        "- No example sentences.\n"
        "- Output MUST be valid JSON ONLY."
    )
    response = client.responses.create(
        model="gpt-4o-mini",
        input=input_prompt
    )
    return response.output_text



def get_word_examples(text):
    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Provide 2–3 short example sentences."},
            {"role": "user", "content": f"Give example sentences for: {text}"}
        ]
    )
    return response.choices[0].message.content
