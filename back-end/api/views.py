#from rest_framework.response import Response
#from rest_framework.decorators import api_view
#from base.models import Item
#from .serializers import ItemSerializer

#@api_view(['GET'])
#def getData(request):
#    items = Item.objects.all()
#    serializer = ItemSerializer(items, many=True)
#    return Response(serializer.data)

#@api_view(['POST'])
#def addItem(request):
#    serializer =ItemSerializer(data=request.data)
#    if serializer.is_valid():
 #       serializer.save()
 #   return Response(serializer.data)




from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
from api.serializers import StudentSerializer
from api.models import Student

@csrf_exempt
def studentApi(request,id=0):
    if request.method=='GET':
        student = Student.objects.all()
        student_serializer=StudentSerializer(student,many=True)
        return JsonResponse(student_serializer.data,safe=False)
    elif request.method=='POST':
        student_data=JSONParser().parse(request)
        student_serializer=StudentSerializer(data=student_data)
        if student_serializer.is_valid():
            student_serializer.save()
            return JsonResponse("Added Successfully",safe=False)
        return JsonResponse("Failed to Add",safe=False)
    elif request.method=='PUT':
        student_data=JSONParser().parse(request)
        student=Student.objects.get(id=id)
        student_serializer=StudentSerializer(student,data=student_data)
        if student_serializer.is_valid():
            student_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        return JsonResponse("Failed to Update")
    elif request.method=='DELETE':
        student=Student.objects.get(id=id)
        student.delete()
        return JsonResponse("Deleted Successfully",safe=False)