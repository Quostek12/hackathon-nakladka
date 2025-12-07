from fastapi import APIRouter
from database import session
from qr_code_generator import qr, qr_service,websocket_service
router = APIRouter(prefix="/qr", tags=["qr"])


@router.post("/webcreate", response_model=qr.QrPost)
def create_qr(session: session.SessionDep):
    qr_created = qr_service.gen_qr(session)
    return qr_created

@router.post("/verify", response_model=qr.QrVerifyRes)
def verify_socket(request: qr.QrVerifyReq, session: session.SessionDep):
    response = websocket_service.verify_qr(request, session)
    return response