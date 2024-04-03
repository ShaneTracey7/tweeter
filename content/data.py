from dataclasses import dataclass
import decimal

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

@dataclass
class Message:
    profile: str # url
    username: str
    acc_name: str 
    date: str # cuz its a number and measurement of time (min, hr, day)
    text: str

@dataclass
class Notification:
    type: str #url
    profile: str # url
    username: str
    text: str

@dataclass
class SearchTopic:
    category: str 
    topic: str 
    postNum: int

@dataclass
class Profile:
    pic: str # url
    username: str 
    acc_name: str
    bio: str
    follow_count: str
    follower_count: str

def shortenNum(num):

    if num < 1000:
       return str(num)
    elif num < 1000000:
        return str(round(decimal.Decimal(num) / decimal.Decimal(1000),1)) + "K"
    else:
        return str(round(decimal.Decimal(num) / decimal.Decimal(1000000),1)) + "M"
    
    




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


# function that creates data for the MessagesPage 
def createMessages():
    # creating list
    messages = []
 
    # appending instances to list
    messages.append(Message('images/elon.jpeg', 'shane', 'shane17', 'Feb 21, 2023', 'Yo, long time no see'))
    messages.append(Message('images/elon.jpeg', 'hanna nurkic', 'hannaBanana4', 'Apr 2, 2022', 'Its finally springtime'))
    messages.append(Message('images/elon.jpeg', 'george', 'GLopez15', 'Apr 26, 2023', 'ba ba ba ba ba ba buh, ba da da buh buh, ba ba ba ba ba ba buh, ba da da buh buh'))
    messages.append(Message('images/elon.jpeg', 'miguel', 'oharaM', 'Dec 25, 2021', 'Merry merry, to all!'))
    messages.append(Message('images/elon.jpeg', 'bean', 'littlebean1', 'Mar 10, 2022', 'Mewo mewoi, meow'))
    messages.append(Message('images/elon.jpeg', 'shane', 'shane17', 'Feb 21, 2023', 'Yo, long time no see'))
    messages.append(Message('images/elon.jpeg', 'hanna nurkic', 'hannaBanana4', 'Apr 2, 2022', 'Its finally springtime'))
    messages.append(Message('images/elon.jpeg', 'george', 'GLopez15', 'Apr 26, 2023', 'ba ba ba ba ba ba buh, ba da da buh buh, ba ba ba ba ba ba buh, ba da da buh buh'))
    messages.append(Message('images/elon.jpeg', 'miguel', 'oharaM', 'Dec 25, 2021', 'Merry merry, to all!'))
    messages.append(Message('images/elon.jpeg', 'bean', 'littlebean1', 'Mar 10, 2022', 'Mewo mewoi, meow'))

    return messages

# function that creates data for the notification page
def createNotifications():
    # creating list
    notifications = []
 
    # appending instances to list
    notifications.append(Notification('Heart', 'url', 'shane', 'words words words'))
    notifications.append(Notification('News', 'url', 'hanna', 'sentence setenc esnetence'))
    notifications.append(Notification('Retweet', 'url', 'george', 'paragraph paragraph paragraph paragraph'))
    notifications.append(Notification('Heart', 'url', 'barry', 'more words more words more words'))
    notifications.append(Notification('News', 'url', 'windsor police', 'we caught the guy'))
    
    return notifications

# function that creates data for the search page
def createSearchTopics():
    # creating list
    topics = []
 
    # appending instances to list
    topics.append(SearchTopic('Music', 'Big Sean', 12005))
    topics.append(SearchTopic('Music', 'Lil Wayne', 100))
    topics.append(SearchTopic('Food', 'Macoroni', 60000))
    topics.append(SearchTopic('Sports', 'McJesus', 120550))
    topics.append(SearchTopic('Art', 'Banksy', 7903))
    
    return topics

# function that creates data for profiles
def createProfiles():
    # creating list
    profiles = []
 
    # appending instances to list
    profiles.append(Profile('images/elon.jpeg', 'Shane', 'sugarshay5', 'Uwin | 2022 Grad | Mallards', shortenNum(200), shortenNum(150)))
    profiles.append(Profile('images/elon.jpeg', 'Barry', 'cuddlyBar', 'always be the best bear you can be!', shortenNum(2305), shortenNum(5000)))
    profiles.append(Profile('images/elon.jpeg', 'Hanna', 'hanbanana22', 'I am the best girlfriend in the world!', shortenNum(150), shortenNum(4500)))
    
    return profiles

