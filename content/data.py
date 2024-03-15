from dataclasses import dataclass

@dataclass
class Post:
    profile: str # url
    username: str
    acc_name: str 
    e_time: str # cuz its a number and measurement of time (min, hr, day)
    text: str
    image: str # url
    comments: int
    retweets: int
    likes: int
    views: int

"""
class Post():
    def __init__(self, profile, username, acc_name, e_time, text, image, comments, retweets, likes, views):
        self.profile = profile
        self.username = username
        self.acc_name = acc_name
        self.e_time = e_time
        self.text = text
        self.image = image
        self.comments = comments
        self.retweets= retweets
        self.likes = likes
        self.views = views
"""

# function that creates data for the feed (homePage)
def createFeed():
    # creating list
    feed = []
 
    # appending instances to list
    feed.append(Post('url', 'shane', 'shane17', '4h', 'Yo, this is my first tweet', 'image_url', 3, 7, 35, 201))
    feed.append(Post('url', 'barry', 'sanders22', '20m', "I'm the best to ever do it", 'image_url', 15, 50, 120, 1034))
    feed.append(Post('url', 'jon', 'therealbonjovi', '2d', "Livin' on a prayer", 'image_url', 120, 1000, 12000, 300000))
    feed.append(Post('url', 'emmy', 'thedogemmy', '2h', 'Ruff ruff ruff', 'image_url', 1, 2, 7, 51))

    return feed