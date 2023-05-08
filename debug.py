from app import app
from models import db, User, Favorite, Visualizer, ColorPalette, Song
# gail = User(username = "studioghobbli", _password_hash = "password")

if __name__ == '__main__':
    with app.app_context():
        import ipdb; ipdb.set_trace()