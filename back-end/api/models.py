from django.db import models
from typing import List, Optional
import datetime
import cloudinary


from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
    
class Image(models.Model):
    # naming scheme: ex: 'hanna_banna-profile.png' <acc_name>-<profile>/<header>/<post_id>
    #image_name = models.CharField(max_length=200) i dont think i need name anymore
    image_url = models.URLField(blank=True, null=True)
    image_public_id = models.CharField(max_length=200) #needed to delete image from cloudinary

    @classmethod
    def create(cls,image_url,image_public_id):
       image = cls(image_url=image_url,image_public_id=image_public_id)
       return image

    def __str__(self):
       return f"{self.id} {self.image_url} {self.image_public_id}"
    
    def delete(self, *args, **kwargs):
        # Delete from Cloudinary first
        if self.image_public_id:
            cloudinary.uploader.destroy(self.image_public_id)

        # Then delete from DB
        super().delete(*args, **kwargs)



class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)  # hashes password
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=35, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    acc_name = models.CharField(max_length=35)
    #may need to remove quotes around 'Image'
    pic = models.ForeignKey('Image', on_delete=models.SET_NULL, null=True, blank=True, related_name='profile_pics')
    #may need to remove quotes around 'Image'
    header_pic = models.ForeignKey('Image', on_delete=models.SET_NULL, null=True, blank=True, related_name='header_pics')
    bio = models.CharField(max_length=100, blank=True, default="")
    follower_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username



"""
class User(models.Model):
    #name = models.CharField(max_length = 35)
    username = models.CharField(max_length = 35)
    email= models.CharField(max_length = 35)
    acc_name = models.CharField(max_length = 35)
    password = models.CharField(max_length = 128) #was 35 but when hash_password, it needs to be longer
    #pic = models.CharField(max_length = 100)
    pic = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True, blank=True, related_name='profile_pics')
    #header_pic = models.CharField(max_length = 100, default="default-header-pic.png") #default is default-header.jpg
    header_pic = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True, blank=True, related_name='header_pics')
    bio = models.CharField(max_length = 100, default="") #increase max-length
    follower_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)

    @classmethod
    def create(cls,username,email,acc_name,password,pic,header_pic,bio,follower_count,following_count):
        user = cls(username=username,email=email,acc_name=acc_name,password=password,pic=pic,header_pic=header_pic,bio=bio,follower_count=follower_count,following_count=following_count)
        return user
    
    def __str__(self):
        return f"{self.id} {self.username} {self.email} {self.acc_name} {self.password} {self.pic}"
"""
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
    #image_content = models.CharField(max_length = 35) #url to image (can alos look into ImageField)
    image_content = models.ForeignKey(Image, on_delete=models.SET_NULL, null=True, blank=True)
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
class Convo(models.Model):
   user1 = models.ForeignKey(User, related_name='user1_convo_set', on_delete=models.CASCADE)
   user2 = models.ForeignKey(User, related_name='user2_convo_set', on_delete=models.CASCADE)
    
   @classmethod
   def create(cls,user1,user2):
       convo = cls(user1=user1,user2=user2)
       return convo
   
   def __str__(self):
       return f"{self.id} {self.user1} {self.user2}"

# can i get UserMessage if i have instance of convo (opposed to convo id)
class UserMessage(models.Model):
    convo = models.ForeignKey(Convo, on_delete=models.CASCADE)
    text = models.CharField(max_length = 100)
    tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE, null=True, blank=True, default=None) #optional
    date = models.DateTimeField()
    sender = models.CharField(max_length = 40, default="")

    @classmethod
    def create(cls,convo,text,tweet, date,sender):
       if text == '':
           usermessage = cls(convo=convo,text=text,tweet=tweet,date=date,sender=sender)
       else:
        usermessage = cls(convo=convo,text=text,date=date,sender=sender)
       return usermessage

    def __str__(self):
       if self.text == '':
           return f"{self.id} {self.convo} {self.text} {self.tweet} {self.date} {self.sender}"
       else:
           return f"{self.id} {self.convo} {self.text} {self.date} {self.sender}"
    
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
        
#class UserMessageArr():
 #   arr: List[UserMessage]

    
    
