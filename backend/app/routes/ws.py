from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.deps import get_db
from app.core.auth import get_current_user_ws
from app.services.ws_manager import manager
from sqlalchemy.orm import Session

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(
    ws: WebSocket,
    db: Session = Depends(get_db)
):
    user = await get_current_user_ws(ws, db)
    if not user:
        return
    await manager.connect(user.id, ws)
    try:
        while True:
            data = await ws.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user.id, ws)
