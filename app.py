import os
from flask import Flask, jsonify, make_response, request, session
from flask_migrate import Migrate
from flask_restful import Api, Resource


from config import *
from models import db, User, Favorite, Visualizer, ColorPalette, Song

import openai
openai.api_key = os.getenv('OPENAI_API_KEY')

from PIL import Image
import urllib, urllib.request

class Palettes(Resource):
    def get(self):
        palettes = [palette.to_dict() for palette in ColorPalette.query.all()]
        return make_response(jsonify(palettes), 200)

class Visualizers(Resource):
    def get(self):
        visualizers = [visualizer.to_dict() for visualizer in Visualizer.query.all()]
        return make_response(jsonify(visualizers), 200)


class Favorites(Resource):
     def get(self):
        favorites = [favorite.to_dict() for favorite in Favorite.query.all()]
        return make_response(jsonify(favorites), 200)
     
     def post(self, user_id):
        data = request.get_json()

        user = User.query.get(user_id)
        visualizer = Visualizer.query.get(data['visualizer_id'])

        if not user or not visualizer:
            return make_response({"error": "User or Visualizer not found"}, 404)
       
        new_favorite = Favorite(visualizer_id=data['visualizer_id'], user_id=user_id)
        user.favorites.append(new_favorite)
        db.session.commit()

        return make_response(user.to_dict(), 200)
        
     
     
class FavoriteByID(Resource):
    def delete(self, user_id, id):
        favorite = Favorite.query.filter_by(id=id).first()
        user = User.query.get(user_id)

        if not favorite:
            return make_response({"error": "Favorite not found"}, 404)
        
        db.session.delete(favorite)
        db.session.commit()

        return make_response(user.to_dict(), 200)


class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(jsonify(users), 200)
    

class UserByID(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            return make_response(user.to_dict())
        elif User.query.count() == 0:
            message = '<h1>Sorry, there are no registered users yet.</h1>'
            return make_response(message, 404)
        else:
            return make_response({"error": "User not found"}, 404)
    
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        
        new_password = request.json.get('password')
        favorites = request.json.get('favorites')
        new_username = request.json.get('username')
        visualizers = request.json.get('visualizers')

        if visualizers:
            user.visualizers = visualizers

        if favorites:
            user.favorites = favorites

        if new_username:
            user.username = new_username

        if new_password:
            user.password_hash = new_password

        db.session.commit()
        return make_response(user.to_dict(), 200)
    
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({"error": "User not found"}, 404)
        Favorite.query.filter_by(user_id=user.id).delete()
        db.session.delete(user)
        db.session.commit()
        return make_response({}, 200)

class Songs(Resource):

    def get(self):
        songs = [song.to_dict() for song in Song.query.all()]
        return make_response(jsonify(songs), 200)
    
class VisualizerCreation(Resource):
    def post(self, user_id):
        data = request.get_json()
        user = User.query.filter(User.id == user_id).first()
        feeling = data['name']
        sound_url = data['sound']

        new_song  = Song(url=sound_url)
        db.session.add(new_song)
        db.session.commit()

        song_id = Song.query.filter(Song.url == sound_url).first().id

        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "assistant", "content": f'Generate a 6-color color palette based on the prompt "{feeling}" in format rgb() '}
        ])

        output_colors = resp.choices[0].message.content

        colors_str = output_colors.replace("\n", "+")

        new_palette = ColorPalette(colors=colors_str)
        db.session.add(new_palette)
        db.session.commit()
        new_palette_id = ColorPalette.query.filter(ColorPalette.colors == colors_str).first().id

        new_visualizer = Visualizer(name=feeling, palette_id=new_palette_id, user_id=user_id, song_id=song_id, created_at=db.func.now())
        user.visualizers.append(new_visualizer)
        db.session.commit()
        
        return make_response(new_visualizer.to_dict(), 201)
    

class Login(Resource):
    def post(self):
        data = request.get_json()

        check_user = User.query.filter(User.username == data['username']).first()
        
        if check_user and check_user.authenticate(data['password']):
            session['user_id'] = check_user.id
            return make_response(check_user.to_dict(), 200)
        return {'error': 'Unauthorized'}, 401

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        new_user = User(
            username = username
        )

        new_user.password_hash = password

        try:
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 201)

        except Exception as e:
            print(e)
            return make_response({'error': 'Unprocessable Entity'}, 417)
        
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        
        if not user_id:
            return {'error': 'Unauthorized'}, 401
        
        current_user = User.query.filter(User.id == user_id).first()
        return current_user.to_dict(), 200
    

class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return {}, 204
        return {'error': '401 Unauthorized'}, 401

api.add_resource(UserByID, '/users/<int:id>')
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Songs, '/songs')
api.add_resource(FavoriteByID, '/users/<int:user_id>/favorites/<int:id>')
api.add_resource(Users, '/users')
api.add_resource(Favorites, '/users/<int:user_id>/favorites')
api.add_resource(Visualizers, '/visualizers')
api.add_resource(Palettes, '/palettes')
api.add_resource(VisualizerCreation, '/users/<int:user_id>/visualizers')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)