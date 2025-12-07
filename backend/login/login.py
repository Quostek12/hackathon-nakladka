from sqlmodel import SQLModel

class LoginRequest(SQLModel):
    login: str
    password: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"