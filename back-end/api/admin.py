from django.contrib import admin
from api.models import Convo, Image, Student, User, Tweet, Follow, Like, Retweet, Notification, UserMessage

# Register your models here.
admin.site.register(Student)


class UserAdmin(admin.ModelAdmin):
  list_display = ("id","username", "email", "acc_name", "password","bio","follower_count", "following_count", "pic", "header_pic")

admin.site.register(User, UserAdmin)

class TweetAdmin(admin.ModelAdmin):
  list_display = ("id", "user", "date_created", "text_content", "image_content", "likes", "comments", "retweets", "engagements", "reply_id")

admin.site.register(Tweet, TweetAdmin)

class FollowAdmin(admin.ModelAdmin):
  list_display = ("id", "follower", "following")

admin.site.register(Follow, FollowAdmin)

class LikeAdmin(admin.ModelAdmin):
  list_display = ("id", "user", "tweet")

admin.site.register(Like, LikeAdmin)

class RetweetAdmin(admin.ModelAdmin):
  list_display = ("id", "user", "tweet")

admin.site.register(Retweet, RetweetAdmin)

class NotificationAdmin(admin.ModelAdmin):
  list_display = ("id","post_id","type","user_to","user_from")

admin.site.register(Notification, NotificationAdmin)

class ConvoAdmin(admin.ModelAdmin):
  list_display = ("id","user1","user2")

admin.site.register(Convo, ConvoAdmin)

class UserMessageAdmin(admin.ModelAdmin):
  list_display = ("id","convo","text","tweet", "date","sender")

admin.site.register(UserMessage, UserMessageAdmin)



#---NEW---
class ImageAdmin(admin.ModelAdmin):
  list_display = ("id","image_name","image_file")

admin.site.register(Image, ImageAdmin)

#class TweetReactionAdmin(admin.ModelAdmin):
 # list_display = ("tweet", "likes", "comments", "retweets", "engagements")

#admin.site.register(TweetReactions, TweetReactionsAdmin)