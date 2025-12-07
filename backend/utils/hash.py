
from hashlib import sha256

import hmac

def hash_password(password: str) -> str:
    return sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed_password: str) -> bool:
    return hashed_password == sha256(password.encode()).hexdigest()\

def sign_id(id: str) -> str:
    return hmac.new("DUPATEST".encode("utf-8"), id.encode("utf-8"), sha256).hexdigest()