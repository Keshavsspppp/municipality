from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
import json
from typing import List, Dict

app = Flask(__name__)
CORS(app)

# Initialize Groq client
MODEL_NAME = "llama3-70b-8192"

try:
    client = Groq(api_key=os.getenv("GROQ_API_KEY")) if os.getenv("GROQ_API_KEY") else None
    if not client:
        print("Groq client initialization failed: No API key provided")
except Exception as e:
    client = None
    print(f"Failed to initialize Groq client: {e}")

class CommentStorage:
    def __init__(self):
        self.comments: List[str] = []
        self.groups: List[Dict] = []
    
    def add_comment(self, text: str) -> None:
        # Sanitize input: remove quotes, newlines, and excessive whitespace
        sanitized_text = ' '.join(text.replace('"', '').replace('\n', ' ').split()).strip()
        if sanitized_text:
            self.comments.append(sanitized_text)
        else:
            print(f"Skipped invalid comment: {text}")
    
    def group_with_llm(self) -> bool:
        """Group comments using LLM"""
        if not client:
            print("No Groq client available")
            return False
        if not self.comments:
            print("No comments to process")
            return False
            
        try:
            # Log input comments for debugging
            print(f"Processing comments: {self.comments}")
            
            prompt = f"""
You are an AI that groups similar comments based on their content and generates valid JSON. Follow these rules:
1. Analyze the provided comments and group them based on semantic similarity of their content.
2. Create a concise summary for each group (max 50 characters).
3. List all comments in each group.
4. Ensure valid JSON output with properly escaped characters.
5. If grouping isn't possible, place each comment in its own group with a summary describing it.
6. Avoid extra quotes, commas, or invalid JSON syntax.
7. Handle special characters by escaping them properly.

Comments:
{json.dumps(self.comments, ensure_ascii=False)}

Return JSON in this exact structure:
{{
    "groups": [
        {{
            "summary": "Summary text",
            "comments": ["comment1", "comment2"]
        }}
    ]
}}
"""
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=MODEL_NAME,
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=1500
            )
            
            result = json.loads(response.choices[0].message.content)
            if "groups" not in result or not isinstance(result["groups"], list):
                print(f"Invalid response format: {result}")
                # Fallback: create individual groups for each comment
                self.groups = [{"summary": f"Comment: {c[:40]}...", "comments": [c]} for c in self.comments]
                return True
            
            self.groups = result["groups"]
            print(f"Generated groups: {self.groups}")
            return True
            
        except Exception as e:
            print(f"LLM Error: {str(e)}")
            # Fallback: create individual groups for each comment
            self.groups = [{"summary": f"Comment: {c[:40]}...", "comments": [c]} for c in self.comments]
            return True

    def clear(self) -> None:
        """Clear stored comments and groups"""
        self.comments = []
        self.groups = []

storage = CommentStorage()

@app.route('/comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    if not data or 'text' not in data or not isinstance(data['text'], str) or not data['text'].strip():
        return jsonify({"error": "Valid comment text is required"}), 400
    
    storage.add_comment(data['text'])
    success = storage.group_with_llm()
    
    if not success:
        return jsonify({"error": "Failed to process comments. Check API key or input data."}), 500
    
    return jsonify({
        "message": "Comment added and processed",
        "groups": storage.groups
    })

@app.route('/summaries', methods=['GET'])
def get_summaries():
    return jsonify({
        "groups": storage.groups,
        "total_comments": len(storage.comments)
    })

@app.route('/clear', methods=['POST'])
def clear_storage():
    storage.clear()
    return jsonify({"message": "Storage cleared successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=True)