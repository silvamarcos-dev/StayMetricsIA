
import jwt

from jwt.exceptions import (
    ExpiredSignatureError,
    InvalidTokenError
)

from app.core.config import (
    JWT_ALGORITHM,
    JWT_SECRET_KEY
)


def decodificar_token(
    token: str
) -> dict:

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        return payload

    except (
        ExpiredSignatureError,
        InvalidTokenError
    ) as e:

        raise ValueError(
            "Token inválido ou expirado."
        ) from e

