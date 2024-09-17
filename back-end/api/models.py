from django.db import models

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

    def __str__(self):
        return f"{self.id} {self.username} {self.email} {self.acc_name} {self.password}"
    
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
    def __str__(self):
        return f"{self.user} {self.date_created} {self.text_content} {self.image_content} {self.likes}{self.comments}{self.retweets}{self.engagements}"

#class TweetReactions(models.Model):
    #may separate these and connect through keys
    #tweet = models.ForeignKey(Tweet, on_delete=models.CASCADE)
    #likes = models.IntegerField()
    #comments = models.IntegerField() # may not need this one
    #retweets = models.IntegerField()
    #engagements = models.IntegerField()

    #def __str__(self):
     #   return f"{self.tweet} {self.likes} {self.comments} {self.retweets} {self.engagements}"


    
    
