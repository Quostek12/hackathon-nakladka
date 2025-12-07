from qr_code_generator import qr
from database import session
from sqlmodel import select
from datetime import timedelta, datetime
from utils import hash
import secrets
from fastapi import HTTPException

from .qr import QrStartRequest, QrStartResponse, Nonce, QrConfirmResponse, QrConfirmRequest

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

def gen_nonce() -> str:
    return secrets.token_urlsafe(24)


def gen_code(request: QrStartRequest, session: session.SessionDep) -> QrStartResponse:
    nonce = gen_nonce()
    now = datetime.utcnow()
    expires_at = now + _WEBSOCKET_EXPIRES_IN_SECOND

    code_obj = Nonce(nonce = nonce, session_id = request.session_id, created_at = now, expires_at = expires_at, used=False)
    session.add(code_obj)
    session.commit()

    return QrStartResponse(qr_payload = nonce)

def qr_confirm(request: QrConfirmRequest,session: session.SessionDep):
    statement = select(Nonce).where(Nonce.nonce == request.nonce)
    nonce_obj = session.exec(statement).one_or_none()

    if not nonce_obj:
        raise HTTPException(status_code=400, detail="invalid_nonce")

    now = datetime.utcnow()

    if nonce_obj.used:
        raise HTTPException(status_code=400, detail="nonce_already_used")

    if now > nonce_obj.expires_at:
        raise HTTPException(status_code=400, detail="nonce_expired")

    nonce_obj.used = True
    session.add(nonce_obj)
    session.commit()

    return QrConfirmResponse(
        ok=True,
        session_id=nonce_obj.session_id,
    )