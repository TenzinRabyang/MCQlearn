import json

path = "src/data/imported/womens-and-reproductive-health.json"
with open(path, 'r') as f:
    data = json.load(f)

letter_to_index = {'A': 0, 'B': 1, 'C': 2, 'D': 3}

new_data = []
for item in data:
    new_item = {
        "id": item["id"],
        "category": item["subject"],
        "question": item["text"],
        "options": item["options"],
        "correctAnswer": letter_to_index.get(item["correctAnswer"], 0),
        "explanation": item["explanation"]
    }
    new_data.append(new_item)

with open(path, 'w') as f:
    json.dump(new_data, f, indent=2)

print("Fixed JSON format")
