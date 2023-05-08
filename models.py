
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy


from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-visualizers.user',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True) 
    _password_hash = db.Column(db.String, nullable=False)

    favorites = db.relationship('Favorite', backref='user')
    visualizers = db.relationship('Visualizer', backref='user')

    @validates('username')
    def validate_username(self, key, username):
        if not isinstance(username, str):
            raise ValueError("Username must be a string")
        return username
    
    @validates('_password_hash')
    def validate_password_len(self, key, _password_hash):
        if len(_password_hash) < 5:
            raise ValueError("Password must be at least 5 characters")
        return _password_hash

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    serialize_rules = ('-user',)

    id = db.Column(db.Integer, primary_key=True)
    visualizer_id = db.Column(db.Integer, db.ForeignKey('visualizers.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))


class Visualizer(db.Model, SerializerMixin):
    __tablename__ = 'visualizers'
    
    serialize_rules = ('-palette.id','-user.visualizers','-song.visualizers')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    palette_id = db.Column(db.Integer, db.ForeignKey('palettes.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    palette = db.relationship('ColorPalette', backref='palette')
    song = db.relationship('Song', backref="song")


class ColorPalette(db.Model, SerializerMixin):
    __tablename__ = 'palettes'

    serialize_rules = ('-visualizers','-palette',)

    id = db.Column(db.Integer, primary_key=True)
    colors = db.Column(db.String)

    def __repr__(self):
        return f'<ColorPalette {self.colors} | id: {self.id}>'

class Song(db.Model, SerializerMixin):
    __tablename__ = 'songs'

    serialize_rules = ('-visualizers','-song')

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String)

    def __repr__(self):
        return f'<Song {self.url} | id: {self.id}>'