from rest_framework import serializers
from api.models import Student, User, Tweet

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

#class TweetReactionsSerializer(serializers.ModelSerializer):
 #   class Meta:
  #      model = TweetReactions
   #     fields = '__all__'

