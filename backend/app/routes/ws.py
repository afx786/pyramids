from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.core.auth import get_current_user_ws
from app.services.ws_manager import manager
from app.database.session import SessionLocal

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    db = SessionLocal()
    try:
        user = await get_current_user_ws(ws, db)
        if not user:
            return
        await manager.connect(user.id, ws)
        try:
            while True:
                await ws.receive_text()
        except WebSocketDisconnect:
            manager.disconnect(user.id, ws)
    finally:
        db.close()
