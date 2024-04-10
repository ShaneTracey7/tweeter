from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from api.serializers import StudentSerializer
from api.models import Student

#@api_view(['GET'])
#def getData(request):
#    students = Student.objects.all()
#    serializer = StudentSerializer(students, many=True)
#    return JsonResponse(serializer.data,safe=False)

#@api_view(['POST'])
#def addItem(request):
#   student_data = JSONParser().parse(request)
#    serializer =StudentSerializer(data=student_data)
#    if serializer.is_valid():
#       serializer.save()
#       return JsonResponse("Added Successfully",safe=False)
#    return JsonResponse("Failed to Add",safe=False)


@csrf_exempt
def studentApi(request,id=id):
    
    if request.method =='GET':
        student = Student.objects.all()
        student_serializer = StudentSerializer(student,many=True)
        return JsonResponse(student_serializer.data,safe=False)
    
    elif request.method =='POST':
        student_data = JSONParser().parse(request)
        student_serializer = StudentSerializer(data=student_data)
        if student_serializer.is_valid():
            student_serializer.save()
            return JsonResponse("Added Successfully",safe=False)
        return JsonResponse("Failed to Add",safe=False)
    
    elif request.method =='PUT':
        student_data = JSONParser().parse(request)
        student = Student.objects.get(id=id)
        student_serializer = StudentSerializer(student,data=student_data)
        if student_serializer.is_valid():
            student_serializer.save()
            return JsonResponse("Updated Successfully",safe=False)
        return JsonResponse("Failed to Update")
    
    elif request.method =='DELETE':
        student = Student.objects.get(id=id)
        student.delete()
        return JsonResponse("Deleted Successfully",safe=False)
