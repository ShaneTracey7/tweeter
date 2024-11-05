from django.contrib import admin
from api.models import Student, User, Tweet, Follow, Like, Retweet, Notification

# Register your models here.
admin.site.register(Student)


class UserAdmin(admin.ModelAdmin):
  list_display = ("id","username", "email", "acc_name", "password","pic")

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

#class TweetReactionAdmin(admin.ModelAdmin):
 # list_display = ("tweet", "likes", "comments", "retweets", "engagements")

#admin.site.register(TweetReactions, TweetReactionsAdmin)