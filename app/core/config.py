
import os

from dotenv import load_dotenv


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

JWT_SECRET_KEY = os.getenv(
    "JWT_SECRET_KEY"
)

JWT_ALGORITHM = os.getenv(
    "JWT_ALGORITHM",
    "HS256"
)

JWT_EXPIRE_MINUTES = int(
    os.getenv(
        "JWT_EXPIRE_MINUTES",
        "60"
    )
)

EVOLUTION_API_URL = os.getenv(
    "EVOLUTION_API_URL"
)

EVOLUTION_API_KEY = os.getenv(
    "EVOLUTION_API_KEY"
)

EVOLUTION_INSTANCE_NAME = os.getenv(
    "EVOLUTION_INSTANCE_NAME"
)