from qr_code_generator import qr
from database import session
from datetime import timedelta, datetime
from utils import hash
import secrets

_WEBSOCKET_EXPIRES_IN_SECOND = timedelta(seconds=30)

def gen_qr(session: session.SessionDep) -> qr.QrPost:
    id: str = secrets.token_urlsafe(32)
    created_at: datetime = datetime.utcnow()

    instance = qr.QrCode(id=id, created_at=created_at, used=False)
    session.add(instance)
    session.commit()
    signature = hash.sign_id(id)

    response = qr.QrPost(id = id, signature = signature, expires_in_seconds = int(_WEBSOCKET_EXPIRES_IN_SECOND.total_seconds()))
    return response