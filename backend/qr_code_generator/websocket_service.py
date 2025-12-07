from fastapi import WebSocket, WebSocketDisconnect
from sqlmodel import select
from database import session
from datetime import datetime
from . import qr, qr_service
from utils import hash
import hmac

ACTIVE_SOCKERTS: dict[str, WebSocket] = {}

async def qr_gen_websocket(websocket: WebSocket, id: str) -> None:
    await websocket.accept()
    ACTIVE_SOCKERTS[id] = websocket

    try:
        while True:
            text = await websocket.receive_text()

    except WebSocketDisconnect:
        if id in ACTIVE_SOCKERTS:
            del ACTIVE_SOCKERTS[id]

def verify_qr(qr_request: qr.QrVerifyReq, session: session.SessionDep) -> qr.QrVerifyRes:

    current_websockets = select(qr.QrCode).where(qr.QrCode.id == qr_request.id)
    row = session.exec(current_websockets).one_or_none()

    if row is None:
        return qr.QrVerifyRes(status="not_found")
    if row.used:
        return qr.QrVerifyRes(status="used")
    if datetime.utcnow() - row.created_at > qr_service._WEBSOCKET_EXPIRES_IN_SECOND:
        return qr.QrVerifyRes(status="expired")
    if not hmac.compare_digest(hash.sign_id(row.id), qr_request.signature):
        return qr.QrVerifyRes(status="invalid")
    
    row.used = True
    session.add(row)
    session.commit()

    socket = ACTIVE_SOCKERTS.get(row.id)

    if socket:
        try:
            awaitable = socket.send_json({"status": "APP_CONFIRMED"})

        except RuntimeError:
            pass

    return qr.QrVerifyRes(status="ok")

