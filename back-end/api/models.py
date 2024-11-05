from django.db import models
from typing import Optional
import datetime

class Student(models.Model):
    name = models.CharField(max_length = 255)
    address = models.CharField(max_length = 255)
    fee = models.IntegerField()

    def __str__(self):
        return f"{self.name} {self.address} {self.fee}"
    
class User(models.Model):
    #name = models.CharField(max_length = 35)
    username = models.CharField(max_length = 35)
    email= models.CharField(max_length = 35)
    acc_name = models.CharField(max_length = 35)
    password = models.CharField(max_length = 35)
    pic = models.CharField(max_length = 100)
    #header-pic  -default is default-header.jpg
    #bio -default is ""

    def __str__(self):
        return f"{self.id} {self.username} {self.email} {self.acc_name} {self.password} {self.pic}"
    
#keeps track of followers/following for entire web app
class Follow(models.Model):
    follower = models.ForeignKey(User, related_name='follower_follow_set', on_delete=models.CASCADE)
    following = models.ForeignKey(User, related_name='following_follow_set', on_delete=models.CASCADE)
    
    @classmethod
    def create(cls,follower,following):
        follow = cls(follower=follower,following=following)
        return follow
        
    def __str__(self):
        return f"{self.id} {self.follower} {self.following}"
    
class Tweet(models.Model):
    #username = models.CharField(max_length = 35)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #acc_name = models.CharField(max_length = 35) #probs only need to store this, and use a function to display user info
    date_created = models.DateTimeField()
    text_content = models.CharField(max_length = 280)
    image_content = models.CharField(max_length = 35) #url to image (can alos look into ImageField)
    likes = models.IntegerField()
    comments = models.IntegerField() # may not need this one
    retweets = models.IntegerField()
    engagements = models.IntegerField()
    reply_id = models.IntegerField(default=0) #will be id of tweet being commented upon or 0 if original tweet(needed to have lists of comments)

    @classmethod
    def create(cls, user,date_created,text_content,image_content,likes,comments,retweets,engagements,reply_id):
        tweet = cls(user=user,date_created=date_created,text_content=text_content,image_content=image_content,likes=likes,comments=comments,retweets=retweets,engagements=engagements, reply_id=reply_id)
        return tweet
    
    def __str__(self):
        return f"{self.user} {self.date_created} {self.text_content} {self.image_content} {self.likes} {self.comments} {self.retweets} {self.engagements} {self.reply_id}"

#keeps track of likes for entire web app
class Like(models.Model):
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    @classmethod
    def create(cls,tweet,user):
        like = cls(tweet=tweet,user=user)
        return like
        
    def __str__(self):
        return f"{self.id} {self.tweet} {self.user}"

#keeps track of retweets for entire web app
class Retweet(models.Model):
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    @classmethod
    def create(cls,tweet,user):
        retweet = cls(tweet=tweet,user=user)
        return retweet
        
    def __str__(self):
        return f"{self.id} {self.tweet} {self.user}"

#keeps track of followers/following for entire web app
class Notification(models.Model):
    post_id = models.IntegerField()
    type = models.CharField(max_length = 35) # 'retweet', 'like', or 'follow'
    user_to = models.ForeignKey(User, related_name='user_to_notification_set', on_delete=models.CASCADE)
    user_from = models.ForeignKey(User, related_name='user_from_notification_set', on_delete=models.CASCADE)
    

    @classmethod
    def create(cls,post_id,type,user_to,user_from):
        notification = cls(post_id=post_id,type=type,user_to=user_to,user_from=user_from)
        return notification
        
    def __str__(self):
        return f"{self.id} {self.post_id} {self.type} {self.user_to} {self.user_from}"


#was able to get user from tweet, aka convo from message
#class Convo(models.Model):
#    user1 = models.ForeignKey(User, on_delete=models.CASCADE)
#    user2 = models.ForeignKey(User, on_delete=models.CASCADE)

#    def __str__(self):
 #       return f"{self.id} {self.user1} {self.user2}"

# can i get UserMessage if i have instance of convo (opposed to convo id)
#class UserMessage(models.Model):
 #   user1_sent = models.BooleanField()
    #from_user = models.ForeignKey(User, on_delete=models.CASCADE)
 #   text = models.CharField(max_length = 100)
 #   date = models.DateTimeField()
 #   convo = models.ForeignKey(Convo, on_delete=models.CASCADE)

 #   def __str__(self):
  #      return f"{self.id} {self.convo} {self.user1_sent} {self.} {self.text} {self.date}"
    
    #display get all convos -> arr of messages[date, who sent, text] should be able to get message from convo id



class Message():
    word: str
    #optional
    num: Optional[int] = None
    word2: Optional[str] = None
    word3: Optional[str] = None
    date: Optional[datetime] = None
    
    #def __init__(self, num, word):
     #   self.num = num
     #   self.word = word
        

        
       



#class TweetReactions(models.Model):
    #may separate these and connect through keys
    #tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    #likes = models.IntegerField()
    #comments = models.IntegerField() # may not need this one
    #retweets = models.IntegerField()
    #engagements = models.IntegerField()

    #def __str__(self):
     #   return f"{self.tweet} {self.likes} {self.comments} {self.retweets} {self.engagements}"


    
    
