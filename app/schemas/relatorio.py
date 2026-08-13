from pydantic import BaseModel


class ApartamentoRelatorio(BaseModel):
    apartamento: str
    numero_apartamento: str
    mes: str
    ano: str

    receita_bruta: float

    internet: float
    copel: float
    condominio: float
    limpeza: float
    reparos: float
    administracao: float

    custos: float
    receita_liquida: float


class RelatorioResponse(BaseModel):
    apartamentos: list[ApartamentoRelatorio]
    total_apartamentos: int