from fastapi import APIRouter, WebSocket

from . import qr, websocket_service

router = APIRouter(prefix="/websocket", tags=["websocket"])


@router.websocket("/qr/{id}")
async def websocket_connect(websocket: WebSocket, id: str):
    websocket_service.qr_gen_websocket()

