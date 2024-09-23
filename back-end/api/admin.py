from django.contrib import admin
from api.models import Student, User, Tweet

# Register your models here.
admin.site.register(Student)


class UserAdmin(admin.ModelAdmin):
  list_display = ("id","username", "email", "acc_name", "password","pic")

admin.site.register(User, UserAdmin)

class TweetAdmin(admin.ModelAdmin):
  list_display = ("id", "user", "date_created", "text_content", "image_content", "likes", "comments", "retweets", "engagements")

admin.site.register(Tweet, TweetAdmin)

#class TweetReactionAdmin(admin.ModelAdmin):
 # list_display = ("tweet", "likes", "comments", "retweets", "engagements")

#admin.site.register(TweetReactions, TweetReactionsAdmin)