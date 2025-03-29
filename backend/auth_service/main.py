# todo-list-app/backend/auth_service/main.py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine
from .config import settings
from .logger import logger, configure_logging
from .exceptions import UserAlreadyExistsException, IncorrectCredentialsException

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
configure_logging()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        logger.error("User already registered", username=user.username)
        raise UserAlreadyExistsException()
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token)
def login_user(user: schemas.UserBase, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.username, user.password)
    if not db_user:
        logger.error("Incorrect username or password", username=user.username)
        raise IncorrectCredentialsException()
    access_token = crud.create_access_token(data={"sub": db_user.username}, secret_key=settings.SECRET_KEY)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
