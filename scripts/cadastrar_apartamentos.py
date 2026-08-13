from app.database.session import SessionLocal
from app.models.apartamento import Apartamento


NUMEROS_APARTAMENTOS = [
    "102",
    "103",
    "105",
    "106",
    "109",
    "112",
    "201",
    "206",
    "209",
    "210",
    "211",
    "212",
    "404",
    "406",
    "407",
    "408",
    "410",
    "412",
    "504",
    "505",
    "506",
    "508",
    "509",
    "510",
    "511",
    "601",
    "602",
]


def cadastrar_apartamentos():

    db = SessionLocal()

    try:

        criados = 0
        existentes = 0

        for numero in NUMEROS_APARTAMENTOS:

            apartamento = (
                db.query(Apartamento)
                .filter(
                    Apartamento.numero == numero
                )
                .first()
            )

            if apartamento:

                print(
                    f"✓ Apartamento {numero} "
                    f"já existe."
                )

                existentes += 1

                continue

            apartamento = Apartamento(
                numero=numero
            )

            db.add(apartamento)

            print(
                f"+ Apartamento {numero} "
                f"cadastrado."
            )

            criados += 1

        db.commit()

        print()
        print("=" * 50)
        print("CADASTRO FINALIZADO")
        print("=" * 50)
        print(
            f"Novos apartamentos: {criados}"
        )
        print(
            f"Já existentes: {existentes}"
        )
        print(
            f"Total esperado: "
            f"{len(NUMEROS_APARTAMENTOS)}"
        )

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


if __name__ == "__main__":
    cadastrar_apartamentos()