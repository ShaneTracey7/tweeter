from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from api.serializers import StudentSerializer, UserSerializer
from api.models import Student, User
from rest_framework.renderers import JSONRenderer

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
def tweetApi(request,id=id):

    if request.method =='GET':
        tweet = Tweet.objects.all() #raw("SELECT * FROM api_user WHERE username = 'Shane'")
        tweet_serializer = TweetSerializer(user,many=True)
        return JsonResponse(tweet_serializer.data,safe=False)
    
    elif request.method =='POST':

        #retrieve tweet from front end
        tweet_data = JSONParser().parse(request)
        # serialize tweet
        tweet_serializer = TweetSerializer(data=tweet_data)
        # compare to all tweet in db
        if tweet_serializer.is_valid():
            tweet_serializer.save() #if user_serializer.is_valid():
            return JsonResponse("Added Successfully",safe=False)
        else: 
            return JsonResponse("Failed to Add",safe=False)

    #elif request.method =='PUT':
        
    elif request.method =='DELETE':
        tweet = Tweet.objects.get(id=id)
        tweet.delete()
        return JsonResponse("Deleted Successfully",safe=False)



@csrf_exempt
def userApi(request,id=id):

    if request.method =='GET':
        user = User.objects.all() #raw("SELECT * FROM api_user WHERE username = 'Shane'")
        user_serializer = UserSerializer(user,many=True)
        return JsonResponse(user_serializer.data,safe=False)
    
    elif request.method =='POST':

        #retrieve username from front end
        user_data = JSONParser().parse(request)
        # serialize username
        user_serializer = UserSerializer(data=user_data)
        # compare to all usernames in db
        if user_serializer.is_valid():

           #username_input = user_serializer.data['username']
           #acc_name_input = user_serializer.data['acc_name']
           #password_input = user_serializer.data['password']
           # if acc_name_input == 'getUser':
                #insert query
               # user = User.objects.raw("SELECT acc_name FROM api_user WHERE username ='" + username_input + "' AND password ='" + password_input + "'")
                #user_serializer = UserSerializer(user,many=False)
                #return JsonResponse(user_serializer.data,safe=False)
            #else:
            user_serializer.save() #if user_serializer.is_valid():
            return JsonResponse("Added Successfully",safe=False)
        else: 
            return JsonResponse("Failed to Add",safe=False)

    elif request.method =='PUT':
        user_data = JSONParser().parse(request)
        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            username_input = user_serializer.data['username']
            acc_name_input = user_serializer.data['acc_name']
            password_input = user_serializer.data['password']   
            if username_input == 'check':  #check uniqueness of acc_name
                result = User.objects.filter(acc_name=acc_name_input)
                if result.exists():
                    return JsonResponse("Not Unique",safe=False)
                else:
                    return JsonResponse("Unique",safe=False)
            elif username_input == 'credentialsCheck':
                result = User.objects.filter(acc_name=acc_name_input)
                if result.exists():
                    user = User.objects.get(acc_name=acc_name_input)
                    if user.password == password_input:
                        return JsonResponse(user.username,safe=False) # ()password and account name correct
                    else:
                        return JsonResponse("AC exists, P incorrect",safe=False)
                else:
                    return JsonResponse("AC doesn't exist",safe=False)
        else: 
            return JsonResponse("Failed to Add",safe=False)
            
    elif request.method =='DELETE':
        user = User.objects.get(id=id)
        user.delete()
        return JsonResponse("Deleted Successfully",safe=False)

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

"""
elif request.method =='POST':

        #retrieve username from front end
        user_data = JSONParser().parse(request)
        # serialize username
        user_serializer = UserSerializer(data=user_data)
        # compare to all usernames in db
        if user_serializer.is_valid():
            name_input = user_serializer.data['name']
            username_input = user_serializer.data['username']
        else: 
            return JsonResponse("Failed to Add",safe=False)

        if name_input == 'check':  #check uniqueness of username
            result = User.objects.filter(username=username_input)

            if result.exists():
                return JsonResponse("Not Unique",safe=False)
            else:
                return JsonResponse("Unique",safe=False)
        else:
            user_serializer.save() #if user_serializer.is_valid():
            return JsonResponse("Added Successfully",safe=False)
            #return JsonResponse("Failed to Add",safe=False)
    
"""