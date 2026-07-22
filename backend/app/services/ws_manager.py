from fastapi import WebSocket
from typing import Dict, Set
import json

class ConnectionManager:
    def __init__(self):
        self.active: Dict[int, Set[WebSocket]] = {}

    async def connect(self, user_id: int, ws: WebSocket):
        await ws.accept()
        if user_id not in self.active:
            self.active[user_id] = set()
        self.active[user_id].add(ws)

    def disconnect(self, user_id: int, ws: WebSocket):
        if user_id in self.active:
            self.active[user_id].discard(ws)
            if not self.active[user_id]:
                del self.active[user_id]

    async def send_personal(self, user_id: int, message: dict):
        if user_id not in self.active:
            return
        dead = set()
        for ws in self.active[user_id]:
            try:
                await ws.send_json(message)
            except Exception:
                dead.add(ws)
        for ws in dead:
            self.active[user_id].discard(ws)

    async def broadcast(self, message: dict):
        for user_id in list(self.active.keys()):
            await self.send_personal(user_id, message)

manager = ConnectionManager()
