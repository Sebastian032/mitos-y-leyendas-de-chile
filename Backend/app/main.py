from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mitos y Leyendas de Chile API")

# IMPORTANTE: Permitir que React (puerto 5173) se conecte sin problemas de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Backend corriendo exitosamente", "proyecto": "Leyendas Chilenas"}