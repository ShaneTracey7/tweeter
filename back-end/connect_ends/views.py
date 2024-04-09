from django.shortcuts import render, HttpResponseRedirect
from django.http import HttpResponse, JsonResponse

from connect_ends.models import ExampleModel
from connect_ends.serializers import ExampleModelSerializer

from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def get_data(request):
	data = ExampleModel.objects.all()
	if request.method == 'GET':
		serializer = ExampleModelSerializer(data, many=True)
		return JsonResponse(serializer.data, safe=False)
	
