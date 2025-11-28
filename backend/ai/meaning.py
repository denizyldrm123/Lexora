from openai import OpenAI
import os

def get_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_word_translation(word):
    print("get word api is called")
    client = get_client()

    input_prompt = (
        f"Translate the word '{word}' to Turkish.\n"
        "Return ONLY a JSON object in this exact format:\n"
        "{ \"translation\": \"<Turkish translation>\" }\n"
        "Rules:\n"
        "- Only the most common Turkish translation.\n"
        "- One line only.\n"
        "- No English definition.\n"
        "- No examples or synonyms.\n"
        "- Output MUST be valid JSON ONLY."
    )

    response = client.responses.create(
        model="gpt-4o-mini",
        input=input_prompt
    )

    return response.output_text

def get_word_meaning(word):
    print("get word meaning api is called")
    client = get_client()

    input_prompt = (
        f"Generate the English definition of the word '{word}'.\n"
        "Return ONLY a JSON object in this exact format:\n"
        "{ \"meaning\": \"<English definition>\" }\n"
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
    print("get word synonymus api is called")
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



def get_word_examples(word):
    print("get word examples api is called")
    client = get_client()

    input_prompt = (
        f"Generate short example sentences that contain the word '{word}'.\n"
        "Return ONLY a JSON object:\n"
        "{ \"examples\": [\"sentence1\", \"sentence2\", \"sentence3\"] }\n"
        "Rules:\n"
        "- Provide 2 or 3 short English sentences.\n"
        "- Each sentence MUST contain the word.\n"
        "- No meanings.\n"
        "- No synonyms.\n"
        "- Output MUST be valid JSON ONLY."
    )

    response = client.responses.create(
        model="gpt-4o-mini",
        input=input_prompt
    )

    return response.output_text
