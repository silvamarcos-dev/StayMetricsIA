import os

import requests

from dotenv import load_dotenv


load_dotenv()


class WhatsAppService:

    def __init__(self):

        self.base_url = os.getenv(
            "EVOLUTION_API_URL"
        )

        self.api_key = os.getenv(
            "EVOLUTION_API_KEY"
        )

        self.instance = os.getenv(
            "EVOLUTION_INSTANCE_NAME"
        )

    def _validar_configuracao(self):

        if not self.base_url:
            raise RuntimeError(
                "EVOLUTION_API_URL não configurada."
            )

        if not self.api_key:
            raise RuntimeError(
                "EVOLUTION_API_KEY não configurada."
            )

        if not self.instance:
            raise RuntimeError(
                "EVOLUTION_INSTANCE_NAME não configurada."
            )

    def _headers(self):

        return {
            "Content-Type": "application/json",
            "apikey": self.api_key,
        }

    def enviar_mensagem(
        self,
        telefone: str,
        mensagem: str
    ) -> dict:

        self._validar_configuracao()

        url = (
            f"{self.base_url}/message/sendText/"
            f"{self.instance}"
        )

        payload = {
            "number": telefone,
            "text": mensagem,
        }

        response = requests.post(
            url,
            json=payload,
            headers=self._headers(),
            timeout=15
        )

        response.raise_for_status()

        return response.json()

    def conectar(self) -> dict:

        self._validar_configuracao()

        url = (
            f"{self.base_url}/instance/connect/"
            f"{self.instance}"
        )

        response = requests.get(
            url,
            headers=self._headers(),
            timeout=15
        )

        response.raise_for_status()

        return response.json()

    def status(self) -> dict:

        self._validar_configuracao()

        url = (
            f"{self.base_url}/instance/connectionState/"
            f"{self.instance}"
        )

        response = requests.get(
            url,
            headers=self._headers(),
            timeout=15
        )

        response.raise_for_status()

        return response.json()

    def processar_webhook(
        self,
        payload: dict
    ) -> dict:

        if payload.get("event") != "messages.upsert":
            return {
                "processado": False,
                "motivo": "Evento ignorado."
            }

        data = payload.get("data", {})
        key = data.get("key", {})
        message = data.get("message", {})

        telefone = key.get("remoteJid")
        from_me = key.get("fromMe", False)
        message_id = key.get("id")
        nome = data.get("pushName")
        texto = message.get("conversation")

        return {
            "processado": True,
            "telefone": telefone,
            "from_me": from_me,
            "message_id": message_id,
            "nome": nome,
            "texto": texto,
        }