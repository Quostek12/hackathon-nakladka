from sqlmodel import SQLModel, Field
from datetime import datetime, timedelta

class QrCode(SQLModel, table=True):
    id: str = Field(primary_key=True, index=True)
    created_at: datetime
    used: bool = Field(default=False)

class QrPost(SQLModel):
    id: str
    signature: str
    expires_in_seconds: int

class QrVerifyReq(SQLModel):
    id: str
    signature: str

class QrVerifyRes(SQLModel):
    status: str

class Nonce(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    nonce: str = Field(index=True, unique=True)
    session_id: str = Field(index=True)

    created_at: datetime
    expires_at: datetime
    used: bool = Field(default=False)

class QrStartRequest(SQLModel):
    session_id: str


class QrStartResponse(SQLModel):
    qr_payload: str


class QrConfirmRequest(SQLModel):
    nonce: str
    device_id: str | None = None


class QrConfirmResponse(SQLModel):
    ok: bool
    session_id: str
