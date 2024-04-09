from rest_framework import serializers
#from base.models import Item

#class ItemSerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Item
#        fields = '__all__'


from api.models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'