import requests
import os
import json
import sys


class FamulorClient:
    """Python client for the Famulor AI platform API.

    Covers all endpoints: assistants, conversations, calls, campaigns,
    knowledge bases, leads, mid-call tools, phone numbers, SMS, WhatsApp, and more.

    Usage:
        client = FamulorClient()  # reads FAMULOR_API_KEY from env
        client = FamulorClient(api_key="your-key")
    """

    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("FAMULOR_API_KEY")
        if not self.api_key:
            raise ValueError(
                "API key required. Set FAMULOR_API_KEY environment variable "
                "or pass api_key parameter. Get your key at https://app.famulor.de"
            )
        self.base_url = "https://app.famulor.de/api"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _request(self, method, endpoint, data=None, params=None, files=None):
        url = f"{self.base_url}{endpoint}"
        if files:
            # For file uploads, don't send Content-Type (let requests set multipart boundary)
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.request(
                method, url, headers=headers, data=data, files=files, params=params
            )
        else:
            response = requests.request(
                method, url, headers=self.headers, json=data, params=params
            )
        response.raise_for_status()
        if response.status_code == 204:
            return {"status": True}
        return response.json()

    # ── Assistants ──────────────────────────────────────────────────────

    def list_assistants(self, per_page=10, page=1):
        return self._request("GET", "/user/assistants/get", params={"per_page": per_page, "page": page})

    def create_assistant(self, name, voice_id, language_id, type, mode, timezone,
                         initial_message, system_prompt, **kwargs):
        data = {
            "name": name, "voice_id": voice_id, "language_id": language_id,
            "type": type, "mode": mode, "timezone": timezone,
            "initial_message": initial_message, "system_prompt": system_prompt,
        }
        data.update(kwargs)
        return self._request("POST", "/user/assistants", data=data)

    def update_assistant(self, assistant_id, **kwargs):
        return self._request("PATCH", f"/user/assistants/{assistant_id}", data=kwargs)

    def delete_assistant(self, assistant_id):
        return self._request("DELETE", f"/user/assistants/{assistant_id}")

    def get_outbound_assistants(self):
        return self._request("GET", "/user/assistants/outbound")

    def get_models(self):
        return self._request("GET", "/user/assistants/models")

    def get_languages(self):
        return self._request("GET", "/user/assistants/languages")

    def get_voices(self, mode=None):
        params = {"mode": mode} if mode else {}
        return self._request("GET", "/user/assistants/voices", params=params)

    def get_phone_numbers_for_assistant(self):
        return self._request("GET", "/user/assistants/phone-numbers")

    def get_synthesizer_providers(self):
        return self._request("GET", "/user/assistants/synthesizer-providers")

    def get_transcriber_providers(self):
        return self._request("GET", "/user/assistants/transcriber-providers")

    # ── Assistant Webhooks ──────────────────────────────────────────────

    def enable_webhook(self, assistant_uuid, webhook_url):
        return self._request("POST", f"/user/assistants/{assistant_uuid}/webhook",
                             data={"webhook_url": webhook_url})

    def disable_webhook(self, assistant_uuid):
        return self._request("DELETE", f"/user/assistants/{assistant_uuid}/webhook")

    def enable_inbound_webhook(self, assistant_uuid, webhook_url):
        return self._request("POST", f"/user/assistants/{assistant_uuid}/inbound-webhook",
                             data={"webhook_url": webhook_url})

    def disable_inbound_webhook(self, assistant_uuid):
        return self._request("DELETE", f"/user/assistants/{assistant_uuid}/inbound-webhook")

    def enable_conversation_ended_webhook(self, assistant_uuid, webhook_url):
        return self._request("POST", f"/user/assistants/{assistant_uuid}/conversation-ended-webhook",
                             data={"webhook_url": webhook_url})

    def disable_conversation_ended_webhook(self, assistant_uuid):
        return self._request("DELETE", f"/user/assistants/{assistant_uuid}/conversation-ended-webhook")

    # ── AI Chatbot (Conversations) ─────────────────────────────────────

    def create_conversation(self, assistant_id, type="test", variables=None):
        data = {"assistant_id": assistant_id, "type": type}
        if variables:
            data["variables"] = variables
        return self._request("POST", "/conversations", data=data)

    def get_conversation(self, conversation_id):
        return self._request("GET", f"/conversations/{conversation_id}")

    def send_message(self, conversation_id, message):
        return self._request("POST", f"/conversations/{conversation_id}/messages",
                             data={"message": message})

    # ── AI Replies ─────────────────────────────────────────────────────

    def generate_reply(self, assistant_id, customer_identifier, message, variables=None):
        data = {
            "assistant_id": assistant_id,
            "customer_identifier": customer_identifier,
            "message": message,
        }
        if variables:
            data["variables"] = variables
        return self._request("POST", "/replies/generate", data=data)

    # ── Conversations (List) ───────────────────────────────────────────

    def list_conversations(self, **kwargs):
        """List conversations with optional filters: type, assistant_id, customer_phone,
        whatsapp_sender_phone, external_identifier, per_page, cursor"""
        return self._request("GET", "/user/conversations", params=kwargs)

    # ── Calls ──────────────────────────────────────────────────────────

    def make_call(self, phone_number, assistant_id, variables=None):
        data = {"phone_number": phone_number, "assistant_id": assistant_id}
        if variables:
            data["variables"] = variables
        return self._request("POST", "/user/make_call", data=data)

    def list_calls(self, **kwargs):
        """List calls with optional filters: status, type, phone_number,
        assistant_id, campaign_id, date_from, date_to, per_page, page"""
        return self._request("GET", "/user/calls", params=kwargs)

    def get_call(self, call_id):
        return self._request("GET", f"/user/calls/{call_id}")

    def delete_call(self, call_id):
        return self._request("DELETE", f"/user/calls/{call_id}")

    # ── Campaigns ──────────────────────────────────────────────────────

    def create_campaign(self, name, assistant_id, **kwargs):
        data = {"name": name, "assistant_id": assistant_id}
        data.update(kwargs)
        return self._request("POST", "/user/campaigns", data=data)

    def list_campaigns(self):
        return self._request("GET", "/user/campaigns")

    def update_campaign_status(self, campaign_id, status):
        """status: 'active' or 'paused'"""
        return self._request("PATCH", f"/user/campaigns/{campaign_id}/status",
                             data={"status": status})

    # ── Knowledge Bases ────────────────────────────────────────────────

    def create_knowledgebase(self, name, description=None):
        data = {"name": name}
        if description:
            data["description"] = description
        return self._request("POST", "/user/knowledgebases", data=data)

    def get_knowledgebase(self, kb_id):
        return self._request("GET", f"/user/knowledgebases/{kb_id}")

    def list_knowledgebases(self):
        return self._request("GET", "/user/knowledgebases")

    def update_knowledgebase(self, kb_id, **kwargs):
        return self._request("PATCH", f"/user/knowledgebases/{kb_id}", data=kwargs)

    def delete_knowledgebase(self, kb_id):
        return self._request("DELETE", f"/user/knowledgebases/{kb_id}")

    def create_document(self, kb_id, name, doc_type, description=None,
                        url=None, links=None, relative_links_limit=None, file_path=None):
        """Create a document in a knowledge base.
        doc_type: 'website', 'pdf', 'txt', or 'docx'
        For website: provide url or links
        For pdf/txt/docx: provide file_path
        """
        if file_path:
            form_data = {"name": name, "type": doc_type}
            if description:
                form_data["description"] = description
            files = {"file": open(file_path, "rb")}
            return self._request("POST", f"/user/knowledgebases/{kb_id}/documents",
                                 data=form_data, files=files)
        else:
            data = {"name": name, "type": doc_type}
            if description:
                data["description"] = description
            if url:
                data["url"] = url
            if links:
                data["links"] = links
            if relative_links_limit:
                data["relative_links_limit"] = relative_links_limit
            return self._request("POST", f"/user/knowledgebases/{kb_id}/documents", data=data)

    def get_document(self, kb_id, doc_id):
        return self._request("GET", f"/user/knowledgebases/{kb_id}/documents/{doc_id}")

    def list_documents(self, kb_id):
        return self._request("GET", f"/user/knowledgebases/{kb_id}/documents")

    def update_document(self, kb_id, doc_id, **kwargs):
        return self._request("PATCH", f"/user/knowledgebases/{kb_id}/documents/{doc_id}", data=kwargs)

    def delete_document(self, kb_id, doc_id):
        return self._request("DELETE", f"/user/knowledgebases/{kb_id}/documents/{doc_id}")

    # ── Leads ──────────────────────────────────────────────────────────

    def create_lead(self, phone_number, campaign_id, variables=None,
                    allow_duplicate=False, secondary_contacts=None):
        data = {"phone_number": phone_number, "campaign_id": campaign_id}
        if variables:
            data["variables"] = variables
        if allow_duplicate:
            data["allow_dupplicate"] = True  # Note: API uses this spelling
        if secondary_contacts:
            data["secondary_contacts"] = secondary_contacts
        return self._request("POST", "/user/leads", data=data)

    def list_leads(self):
        return self._request("GET", "/user/leads")

    def update_lead(self, lead_id, **kwargs):
        return self._request("PATCH", f"/user/leads/{lead_id}", data=kwargs)

    def delete_lead(self, lead_id):
        return self._request("DELETE", f"/user/leads/{lead_id}")

    # ── Mid-Call Tools ─────────────────────────────────────────────────

    def create_mid_call_tool(self, name, description, endpoint, method,
                             timeout=10, headers=None, schema=None):
        data = {
            "name": name, "description": description,
            "endpoint": endpoint, "method": method, "timeout": timeout,
        }
        if headers:
            data["headers"] = headers
        if schema:
            data["schema"] = schema
        return self._request("POST", "/user/mid-call-tools", data=data)

    def get_mid_call_tool(self, tool_id):
        return self._request("GET", f"/user/mid-call-tools/{tool_id}")

    def list_mid_call_tools(self):
        return self._request("GET", "/user/mid-call-tools")

    def update_mid_call_tool(self, tool_id, **kwargs):
        return self._request("PATCH", f"/user/mid-call-tools/{tool_id}", data=kwargs)

    def delete_mid_call_tool(self, tool_id):
        return self._request("DELETE", f"/user/mid-call-tools/{tool_id}")

    # ── Phone Numbers ──────────────────────────────────────────────────

    def search_phone_numbers(self, country_code="DE", contains=None):
        params = {"country_code": country_code}
        if contains:
            params["contains"] = contains
        return self._request("GET", "/user/phone-numbers/search", params=params)

    def purchase_phone_number(self, phone_number):
        return self._request("POST", "/user/phone-numbers/purchase",
                             data={"phone_number": phone_number})

    def list_phone_numbers(self):
        return self._request("GET", "/user/phone-numbers")

    def release_phone_number(self, phone_number_id):
        return self._request("DELETE", f"/user/phone-numbers/{phone_number_id}")

    # ── SMS ────────────────────────────────────────────────────────────

    def send_sms(self, from_number_id, to, body):
        return self._request("POST", "/user/sms",
                             data={"from": from_number_id, "to": to, "body": body})

    # ── User ───────────────────────────────────────────────────────────

    def get_user_info(self):
        return self._request("GET", "/user/me")

    # ── WhatsApp ───────────────────────────────────────────────────────

    def get_whatsapp_senders(self):
        return self._request("GET", "/user/whatsapp/senders")

    def get_whatsapp_templates(self, sender_id):
        return self._request("GET", f"/user/whatsapp/templates/{sender_id}")

    def send_whatsapp_template(self, sender_id, template_id, recipient_phone,
                               recipient_name=None, variables=None):
        data = {
            "sender_id": sender_id,
            "template_id": template_id,
            "recipient_phone": recipient_phone,
        }
        if recipient_name:
            data["recipient_name"] = recipient_name
        if variables:
            data["variables"] = variables
        return self._request("POST", "/user/whatsapp/send", data=data)

    def send_whatsapp_freeform(self, sender_id, recipient_phone, message):
        return self._request("POST", "/user/whatsapp/send-freeform", data={
            "sender_id": sender_id,
            "recipient_phone": recipient_phone,
            "message": message,
        })

    def get_whatsapp_session_status(self, sender_id, recipient_phone):
        return self._request("GET", "/user/whatsapp/session-status",
                             params={"sender_id": sender_id, "recipient_phone": recipient_phone})


# ── CLI Interface ──────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 famulor_client.py <method> [args...] [key=value ...]")
        print("\nAvailable methods:")
        client_methods = [m for m in dir(FamulorClient)
                         if not m.startswith("_") and callable(getattr(FamulorClient, m))]
        for m in sorted(client_methods):
            print(f"  {m}")
        sys.exit(1)

    client = FamulorClient()
    method_name = sys.argv[1]
    method = getattr(client, method_name, None)
    if not method:
        print(f"Error: Method '{method_name}' not found.")
        sys.exit(1)

    args = sys.argv[2:]
    positional_args = []
    kwargs = {}
    for arg in args:
        if "=" in arg:
            key, value = arg.split("=", 1)
            try:
                kwargs[key] = json.loads(value)
            except (json.JSONDecodeError, ValueError):
                kwargs[key] = value
        else:
            try:
                positional_args.append(json.loads(arg))
            except (json.JSONDecodeError, ValueError):
                positional_args.append(arg)

    try:
        result = method(*positional_args, **kwargs)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except requests.exceptions.HTTPError as e:
        print(f"API Error ({e.response.status_code}): {e.response.text}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
