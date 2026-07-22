import secrets
import string

def _generate_segment(length=6):
    alphabet = string.ascii_uppercase + string.digits
    alphabet = ''.join(c for c in alphabet if c not in '0O1IL')
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_public_id(prefix, db=None, model=None):
    while True:
        pid = f"PYR-{prefix}-{_generate_segment()}"
        if db is None or model is None:
            return pid
        exists = db.query(model).filter(model.public_id == pid).first()
        if not exists:
            return pid
