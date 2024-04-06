from rest_framework import serializers
from connect_ends.models import ExampleModel

#dummy serializers

class ExampleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleModel
        fields = ('firstname', 'lastname')