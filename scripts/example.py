#!/usr/bin/env python3
"""
Example: Build a complete Famulor assistant setup.

This script demonstrates how to use the FamulorClient to:
1. List available models, voices, and languages
2. Create an assistant with a system prompt
3. Test the assistant with a conversation
4. Create a mid-call tool and attach it

Set FAMULOR_API_KEY before running:
    export FAMULOR_API_KEY="your-key-here"
    python3 example.py
"""

import json
from famulor_client import FamulorClient


def main():
    client = FamulorClient()

    # 1. Discover available options
    print("=== Available Models ===")
    models = client.get_models()
    print(json.dumps(models, indent=2))

    print("\n=== Available Languages ===")
    languages = client.get_languages()
    print(json.dumps(languages, indent=2))

    print("\n=== Available Voices (pipeline mode) ===")
    voices = client.get_voices(mode="pipeline")
    print(json.dumps(voices, indent=2))

    # 2. Create an inbound assistant
    print("\n=== Creating Assistant ===")
    assistant = client.create_assistant(
        name="Customer Support Bot",
        voice_id=1,
        language_id=1,
        type="inbound",
        mode="pipeline",
        timezone="Europe/Berlin",
        initial_message="Hello! Welcome to our support line. How can I help you today?",
        system_prompt=(
            "You are a friendly customer support agent for a software company. "
            "Help customers with account issues, billing questions, and technical problems. "
            "If you cannot resolve an issue, offer to transfer the call to a human agent. "
            "Always be polite and patient."
        ),
        llm_model_id=1,
        post_call_evaluation=True,
        post_call_schema=[
            {"name": "issue_type", "type": "string", "description": "Category of the customer's issue"},
            {"name": "resolved", "type": "boolean", "description": "Whether the issue was resolved"},
            {"name": "customer_sentiment", "type": "string", "description": "Customer mood: positive, neutral, or negative"},
        ],
    )
    print(json.dumps(assistant, indent=2))

    # 3. Test with a conversation
    if "data" in assistant and "id" in assistant["data"]:
        # Note: for conversations, you need the assistant's UUID, not the integer ID
        # You'd get this from the list_assistants response
        print("\n=== Testing with a conversation ===")
        print("(Fetch assistant UUID from list_assistants to create test conversations)")

    # 4. Create a mid-call tool
    print("\n=== Creating Mid-Call Tool ===")
    tool = client.create_mid_call_tool(
        name="check_order_status",
        description="Checks the status of a customer order by order ID",
        endpoint="https://api.example.com/orders/status",
        method="GET",
        timeout=10,
        schema=[
            {"name": "order_id", "type": "string", "description": "The customer's order ID"},
        ],
    )
    print(json.dumps(tool, indent=2))

    print("\nDone! You can now attach the tool to your assistant using update_assistant.")


if __name__ == "__main__":
    main()
