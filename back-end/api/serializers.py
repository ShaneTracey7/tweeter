from rest_framework import serializers
from api.models import Convo, Image, User, Tweet, Follow, Like, Retweet, Notification, UserMessage

"""
Serializers that have foreign keys to other models, need to be accessed differently in front-end.
For example, obj.user wont default to return id, but obj.user.id will.
"""
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
    
class UserSerializer(serializers.ModelSerializer):
    pic = ImageSerializer(read_only=True,allow_null=True)    #has caused some issues im pretty sure
    header_pic = ImageSerializer(read_only=True,allow_null=True)

    class Meta:
        model = User
        fields = '__all__'

class TweetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image_content = ImageSerializer(read_only=True,allow_null=True) 
    class Meta:
        model = Tweet
        fields = '__all__'

class FollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)
    class Meta:
        model = Follow
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    #tweet = TweetSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Like
        fields = '__all__'

class RetweetSerializer(serializers.ModelSerializer):
    #tweet = TweetSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Retweet
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    user_to = UserSerializer(read_only=True)
    user_from = UserSerializer(read_only=True)
    class Meta:
        model = Notification
        fields = '__all__'

class ConvoSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    class Meta:
        model = Convo
        fields = '__all__'

# may have to alter this for optional 'tweet' field
class UserMessageSerializer(serializers.ModelSerializer):
   #convo = ConvoSerializer(read_only=True)
    class Meta:
        model = UserMessage
        fields = ['id','convo','text','date','sender']
        #fields = '__all__'

class MessageSerializer(serializers.Serializer):
    word = serializers.CharField(max_length=30)
    #optional
    word2 = serializers.CharField(max_length=180,required=False, allow_null=True)
    word3 = serializers.CharField(max_length=180,required=False, allow_null=True)
    date = serializers.DateTimeField(required=False, allow_null=True)
    num = serializers.IntegerField(required=False, allow_null=True)
#class TweetReactionsSerializer(serializers.ModelSerializer):
 #   class Meta:
  #      model = TweetReactions
   #     fields = '__all__'