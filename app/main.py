from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. IMPORTAÇÕES CORRETAS ALINHADAS COM A SUA ESTRUTURA DE PASTAS REAL
try:
    from database.base import Base
    from database.connection import engine
    
    # Executa a criação física das tabelas no PostgreSQL da Render
    Base.metadata.create_all(bind=engine)
    print("✅ Tabelas sincronizadas com sucesso no banco de dados!")
except Exception as e:
    print(f"⚠️ Erro ao importar ou sincronizar o banco de dados: {e}")

from app.routes.google_calendar import router as google_calendar_router
from app.routes.chat import router as chat_router

from app.controllers.contato_controller import (
    router as contato_router
)

from app.controllers.apartamento_controller import (
    router as apartamento_router
)

from app.controllers.usuario_controller import (
    router as usuario_router
)

from app.controllers.auth_controller import (
    router as auth_router
)

from app.controllers.dashboard_controller import (
    router as dashboard_router
)

from app.controllers.visita_controller import (
    router as visita_router
)

from app.controllers.agenda_controller import (
    router as agenda_router
)

from app.controllers.whatsapp_controller import (
    router as whatsapp_router
)

from app.routes.relatorios import (
    router as relatorio_router
)
from app.controllers.configuracao_controller import (
    router as configuracao_router
)

app = FastAPI(
    title="STAY METRICS IA API",
    version="PRÉ-RELEASE V0.0.1"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "https://stay-metrics-ia.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


app.include_router(
    chat_router
)

app.include_router(
    dashboard_router
)

app.include_router(
    contato_router
)

app.include_router(
    apartamento_router
)

app.include_router(
    usuario_router
)

app.include_router(
    auth_router
)

app.include_router(
    relatorio_router
)

app.include_router(
    visita_router
)

app.include_router(
    agenda_router
)

app.include_router(
    whatsapp_router
)
app.include_router(
    configuracao_router
)

app.include_router(
    google_calendar_router
)

@app.get("/")
def home():

    return {
        "success": True,
        "message": "CRM online"
    }
