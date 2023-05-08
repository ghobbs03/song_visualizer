from app import app
from models import db, User, Favorite, Visualizer, ColorPalette, Song

with app.app_context():

    print('Deleting existing songs...')
    Favorite.query.delete()
    Visualizer.query.delete()
    User.query.delete()
    Song.query.delete()



    """ 
    print('Creating User object...')
    user1 = User(username="gail", _password_hash ='password')

    print('Adding user to transaction...')
    db.session.add(user1)

    print('Creating Song objects...')
    song1 = Song(url="ajdklfgjaklaj")
    song2 = Song(url="heyheyhey")

    print('Adding song objects to transaction...')
    db.session.add_all([song1, song2])

    print('Creating Palette')
    tup_list = [(46656, (103, 199, 55)), (15552, (175, 197, 43)), (36288, (179, 195, 48)), (57024, (98, 201, 48)), (5184, (191, 204, 0)), (25920, (176, 197, 50))]
    color_str = '+'.join(str(tup[-1]) for tup in tup_list)

    palette1 = ColorPalette(colors=color_str)
    db.session.add(palette1)
    db.session.commit()

    new_palette_id = ColorPalette.query.filter(ColorPalette.colors == color_str).first().id



    print(new_palette_id)

    print('Adding palette to transaction...')
    #db.session.add(palette1)
    #db.session.commit()

    
    """
    print('Committing transaction...')
    db.session.commit()

    print('Complete.')
