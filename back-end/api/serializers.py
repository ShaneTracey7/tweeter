from rest_framework import serializers
from api.models import Student, User, Tweet, Follow, Like, Retweet

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

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

