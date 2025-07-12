from rest_framework import serializers
from api.models import Convo, Image, User, Tweet, Follow, Like, Retweet, Notification, UserMessage
"""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
"""

class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = '__all__'

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'

class RetweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Retweet
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class ConvoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Convo
        fields = '__all__'

# may have to alter this for optional 'tweet' field
class UserMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMessage
        fields = ['convo','text','date','sender']
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
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
    
class UserSerializer(serializers.ModelSerializer):
    pic = ImageSerializer(read_only=True)
    header_pic = ImageSerializer(read_only=True)

    class Meta:
        model = User
        fields = '__all__'
        #[
         #   'id', 'username', 'acc_name', 'bio', 'following_count', 'follower_count', 'email', 'password',
         #   'pic', 'header_pic', # include other fields as needed
        #]