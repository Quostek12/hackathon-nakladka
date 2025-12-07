from fastapi import FastAPI, HTTPException, Depends
from database import session
from pydantic import BaseModel
from sqlmodel import SQLModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


from auth import current_user

from user import user_router
from role import role_router
from login import login_router
from qr_code_generator import qr_router, qr_service, websocket_router

from user.user import User, UserPublic, UserWithRolePublic
from role.role import RolePublic, Role, RoleWithUsersPublic

Role.model_rebuild()
RolePublic.model_rebuild()
RoleWithUsersPublic.model_rebuild()
UserPublic.model_rebuild()
UserWithRolePublic.model_rebuild()

# async def cleanup_loop():
#     while True:
#         try:
#             qr_service.cleanup_task()
#         except Exception as e:
#             print("Cleanup error:", e)
#         await asyncio.sleep(5 * 60)

@asynccontextmanager
async def lifespan(app: FastAPI):
    session.create_db_and_tables()
    # asyncio.create_task(cleanup_loop())
    yield

app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173","https://localhost:5173", "http://localhost:8081","https://localhost:8081"]

app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(user_router.router)
app.include_router(role_router.router)
app.include_router(login_router.router)
app.include_router(qr_router.router)
app.include_router(websocket_router.router)

# @app.on_event("startup")
# async def on_startup():
#     session.create_db_and_tables()


@app.get("/")
def root():
    return {"msg":"Elloss"} 

@app.get("/test")
def test():
    return [{"msg": "asd"}, {"msg": "123"}]

@app.get("/me")
def get_me(curr_user: User = Depends(current_user.get_current_user)):
    return curr_user

@app.post("/test")
def dodaj(b: User):
    return [b, {"Jaka metoda": "Post"}]



