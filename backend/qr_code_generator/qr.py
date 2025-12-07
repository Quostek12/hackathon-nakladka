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
