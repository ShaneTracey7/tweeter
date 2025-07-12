import os
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from api.serializers import ImageSerializer, UserSerializer, TweetSerializer, MessageSerializer, FollowSerializer, LikeSerializer, RetweetSerializer, NotificationSerializer, UserMessageSerializer, ConvoSerializer
from api.models import Image, Student, User, Tweet, Message, Follow, Like, Retweet, Notification, Convo, UserMessage
from rest_framework.renderers import JSONRenderer
import json
import datetime
from django.db.models import Q
import cloudinary.uploader
from django.db import models


#from django.core.files.base import File
from django.core.files import File

@csrf_exempt
def imageApi(request,id=id):

    print('in image api')
    

    #this is mainly for testing
    if request.method =='GET':
        """
        #images = Image.objects.filter(image_name='testfromfrontend')

            #image = Image.objects.get(image_name='test_image2')
            #newimage = images[0].image_file
            #image.image_file = newimage
            #image.save()



        #images = Image.objects.all()
        image = Image.objects.get(image_name='test_image2')
        #images = Image.objects.filter(image_name='testfromfrontend')
       # for image in images:

            #print(image.image_file.storage.get_valid_name(image.image_file.name))
            #print(image.image_file.storage.listdir(image.image_file.name))
            #print(image.image_file.storage.size(image.image_file.name))
           #image.delete()
           # print(image.image_file.storage.get_valid_name('tester11.png'))
           # print(image.image_file.storage.listdir('tester11.png'))
           # print(image.image_file.storage.size('tester11.png'))
            #print(image.image_file.storage.location(image.image_file.name))
        print(image.image_file.storage.exists('test_51.png'))
        print(image.image_file.storage.delete('test_51.png'))
        print(image.image_file.storage.exists('test_51.png'))
            #print(image.image_file.storage.url(image.image_file.name))
            #print(image.image_file.storage.delete(image.image_file.name))
            #print(image.image_file.storage.exists(image.image_file.name))

           #imf = models.ImageField(image.image_file)
         #  print(image.image_file.url)
           #print(image.image_file.url)
         #  print(image.image_file.storage.url('back-arrow.svg'))
           #print(image.image_file.storage.exists('test_image_QEZCUMQ.png'))
           #print(image.image_file.storage.delete('test_image_QEZCUMQ.png'))
           #print(image.image_file.storage.exists('test_image_QEZCUMQ.png'))
           #print(image.image_file.storage.get_valid_name())
          # print(image.image_file.name)

   #     try:
        # only need to delete google drive instance and save new instance to Django
   #         print('in try')
            
   #         images = Image.objects.filter(image_name='testfromfrontend')

  #          image = Image.objects.get(image_name='test_image2')
   #         newimage = images[0].image_file
   #         print(newimage.storage.exists('back-arrow.svg'))
            #print(newimage.storage.delete('back-arrow.svg'))
   #         print(newimage.storage.exists('back-arrow.svg'))
            
            #print(image.delete())
            #print(image.image_file.storage.exists('test_image.png'))
            #print(image.image_file.storage.delete('test_image.png'))
            #print(image.image_file.storage.exists('test_image.png'))
            #dbImage.image_file.storage.delete(dbImage.image_file.name)
            #dbImage.image_file = myFile2
    #        print('end try')
            #dbImage.save()
 #       except Image.DoesNotExist:
    #        print('in except')
            # create new image instance and save to Django
            #image2 = Image.create(image_db_name2,myFile2)
            #image2.save()
            #print('end except')

        """
        return JsonResponse('saved to google drive',safe=False)
    

    elif request.method =='POST':

        type_input = request.POST.get('type') # header, profile, tweet, bio, both, header bio, profile bio, both bio
        acc_name_input = request.POST.get('acc_name') # account name of user
        user = User.objects.get(acc_name = acc_name_input)

        print('type_input: ' + type_input)
        tweet_id_input = ''

        if type_input == 'bio':
            print('in bio case')
            bio_input = request.POST.get('bio')
            user.bio = bio_input
            user.save()
            return JsonResponse('Saved Bio',safe=False)
        
        #might not need this because this should go through tweet api probs
        elif type_input == 'tweet':
              print('include tweet')
              tweet_id_input = request.POST.get('tweet_id') # 0 if profile/header
              t = Tweet.objects.get(id=tweet_id_input)

              img = request.FILES.get('image_file')
              upload_result = cloudinary.uploader.upload(img)
              i1 = Image.create(upload_result["secure_url"],upload_result["public_id"])
              
              t.image_content = i1
              t.save()
              image_serializer = TweetSerializer(i1,many=False)
              return JsonResponse(image_serializer.data,safe=False)

        else:
            #user.pic
            #user.save()
            #upload first image (either profile or header or both)
            img1 = request.FILES.get('image_file')
            
            upload_result = cloudinary.uploader.upload(img1)
            
            i1 = Image.create(upload_result["secure_url"],upload_result["public_id"])
            return JsonResponse("image file is good",safe=False)
            image_serializer = ImageSerializer(i1,many=False)
            #return JsonResponse(image_serializer.data,safe=False)
            
            #looks like i dont need to ensure the picture is different (checks in front-end for that)
            #check if i need to add a bio
            bio_input = ''
            #bio_check = type_input.find('bio')
            if type_input == 'header bio' or type_input == 'profile bio' or type_input == 'both bio':
                print('include bio')
                bio_input = request.POST.get('bio')
                user.bio = bio_input
            
            #create and save image model
            if type_input.find('header') != -1:
                print('include header')
                if user.header_pic: #if user already has a header pic on cloudinary (delete it)
                    #old_public_id = user.header_pic.image_public_id
                    #result = cloudinary.uploader.destroy(old_public_id)
                    #print('deletion status:' + result)
                    old_header_pic = user.header_pic
                    old_header_pic.delete() #delete old header pic from django database
                    user.header_pic = i1
                else:
                    user.header_pic = i1
                
                user.save() #save user with new image(s) and bio if applicable
                return JsonResponse(image_serializer.data,safe=False)

            elif type_input.find('profile') != -1:
                print('include profile')
                if user.pic: #if user already has a profile pic on cloudinary(delete it)
                    #old_public_id = user.pic.image_public_id
                    #result = cloudinary.uploader.destroy(old_public_id)
                    #print('deletion status:' + result)
                    old_pic = user.pic
                    old_pic.delete() #delete old header pic from django database
                    user.pic = i1
                else:
                    user.header_pic = i1
                
                user.save() #save user with new image(s) and bio if applicable
                return JsonResponse(image_serializer.data,safe=False)
            
            elif type_input.find('both') != -1:
                print('include both')
                img2 = request.FILES.get('image_file2') # header is always file2 if both are present
               
                upload_result = cloudinary.uploader.upload(img2)
                i2 = Image.create(upload_result["secure_url"],upload_result["public_id"])
                image_serializer = ImageSerializer(i2,many=False)
                
                if user.pic: #if user already has a profile pic on cloudinary(delete it)
                    #old_public_id = user.pic.image_public_id
                    #result = cloudinary.uploader.destroy(old_public_id)
                    #print('deletion status:' + result)
                    old_pic = user.pic
                    old_pic.delete() #delete old header pic from django database
                    user.pic = i1
                else:
                    user.header_pic = i1
                if user.header_pic: #if user already has a header pic on cloudinary (delete it)
                    #old_public_id = user.header_pic.image_public_id
                    #result = cloudinary.uploader.destroy(old_public_id)
                    #print('deletion status:' + result)
                    old_header_pic = user.header_pic
                    old_header_pic.delete() #delete old header pic from django database
                    user.header_pic = i2
                else:
                    user.header_pic = i2
                
                user.save() #save user with new image(s) and bio if applicable
                return JsonResponse("Both images saved",safe=False)
            
            else:    
                return JsonResponse('Image Api POST Error',safe=False)
            



            # figure out what put is for, maybe delete
            # i dont think there is ever a time when I would have to delete just an image (because images get deleted through account deletions and tweet deletions)
    elif request.method =='PUT': 
        #retrieve message from front end
        message_data = JSONParser().parse(request)
        # serialize message
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            check = message_serializer.data['word']
            image_name_input = message_serializer.data['word2']
            if check == 'deleteImage':
                #image_name_input includes file type
                x = image_name_input.split(".") 
                image_name_short = x[0]
                image = Image.objects.get(image_name=image_name_short)
                print(image.image_file)#.encoding
                
                image.image_file.storage.delete(image_name_input)
                image.delete()
                return JsonResponse("Image successfully deleted",safe=False)
            elif check == 'deleteAllImages':
                images = Image.objects.all()
                images.delete()
                return JsonResponse("All Images successfully deleted",safe=False)
            if check == 'getImage':
                image = Image.objects.get(image_name=image_name_input)
                print(image)
                url = image.image_file.url
                print(url)
                return JsonResponse(url,safe=False)
            else:
                return JsonResponse("Check is false",safe=False)
            
        return JsonResponse("Failed to Add",safe=False)
        
    elif request.method =='DELETE':
        return JsonResponse("Deleted Successfully",safe=False)



@csrf_exempt
def messageApi(request,id=id):

    if request.method =='GET':
        tweet = Tweet.objects.all()
        tweet_serializer = TweetSerializer(tweet,many=True)
        return JsonResponse(tweet_serializer.data,safe=False)
     
    elif request.method =='POST':

        #retrieve message from front end
        message_data = JSONParser().parse(request)
        # serialize message
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():

            acc_name_input1 = message_serializer.data['word']
            acc_name_input2 = message_serializer.data['word2']
            #text_input = message_serializer.data['word3']
            user1 = User.objects.get(acc_name=acc_name_input1)
            user2 = User.objects.get(acc_name=acc_name_input2)

            #get anothet input from message serializer
            convo = Convo.create(user1,user2)

            DBconvo1 = Convo.objects.filter(user1=user1, user2=user2)
            DBconvo2 = Convo.objects.filter(user1=user2, user2=user1)
            
           
            if DBconvo1.exists() or DBconvo2.exists():
                return JsonResponse("Convo already exists",safe=False)
            else:
                print(convo)
                convo.save()

            return JsonResponse("Added Successfully",safe=False)
        else: 
            return JsonResponse("Failed to Add",safe=False)

    elif request.method =='PUT': 
        message_data = JSONParser().parse(request)

        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            check = message_serializer.data['word']
            acc_name_input = message_serializer.data['word2']
            text_input = message_serializer.data['word3']
            convo_id = message_serializer.data['num']            
            if check == 'getConvos':
                #get all tweets that user tweeted
                user = User.objects.get(acc_name =acc_name_input)
                #convos = Convo.objects.filter(user1=user)
                convos = Convo.objects.filter(Q(user1=user) | Q(user2=user),)
                
                if convos.exists():
                    messages = []
                    tweets = [] # array of array
                    tweetUsers = [] # array of array
                    
                    users = []
                    ids = []
                    for convo in convos:
                        ids.append(convo.id)
                        if convo.user1.acc_name == acc_name_input:
                            users.append(convo.user2)
                        else:
                            users.append(convo.user1)
                        #this part involvong messages doesn't work
                        m = UserMessage.objects.filter(convo_id=convo.id)
                        if m.exists():
                            tweet_messages = [] # array
                            tweet_messages_users = [] # array
                            tweetFlag = False
                            for mes in m:
                                if mes.text == '':
                                    tweet_serializer = TweetSerializer(mes.tweet,many=False)
                                    tweet_messages.append(tweet_serializer.data)
                                    tweetFlag = True
                                    #new
                                    user2_serializer = UserSerializer(mes.tweet.user,many=False)
                                    tweet_messages_users.append(user2_serializer.data)

                                else:
                                    tweet_messages.append(0)
                                    tweet_messages_users.append(0) #new
                            if tweetFlag:
                                tweets.append(tweet_messages) #array of tweets
                                #new
                                tweetUsers.append(tweet_messages_users) #array of users
                            else:
                                tweets.append([0])
                                tweetUsers.append([0])#new
                            message_serializer1 = UserMessageSerializer(m,many=True)
                            messages.append(message_serializer1.data) #array of messages


                        else:
                            messages.append([0])
                    #message_serializer = UserMessageSerializer(messages,many=True)
                    #convo_serializer = ConvoSerializer(convos,many=True)
                    user_serializer = UserSerializer(users,many=True)
                    #messages might not work when tweet is inside 
                    #might have to exclude tweet field from serializer
                    return JsonResponse([ids,user_serializer.data,messages,tweets,tweetUsers],safe=False)
                else:
                    return JsonResponse("No convos",safe=False)
            elif check == 'addMessage':
                convo = Convo.objects.get(id=convo_id)
                
                message = UserMessage.create(convo,text_input,'',datetime.datetime.now(),acc_name_input)
                message.save() 

                return JsonResponse("Added Successfully",safe=False)
            elif check == 'addTweetMessage':

                print('in add tweet message')
                convo = Convo.objects.get(id=convo_id)
                tweet_id = int(text_input)
                print('text_input: ' + text_input)
                print('after it got convo')
                tweet = Tweet.objects.get(id=tweet_id) #text_input is tweet id in string form
                print('after it got tweet')
                tweet_serializer = TweetSerializer(tweet,many=False)
                user_serializer = UserSerializer(tweet.user,many=False)
                print('after both serializers')
                message = UserMessage.create(convo,'',tweet,datetime.datetime.now(),acc_name_input)
                print('after message create')
                message.save()   
                print('after message save')
                return JsonResponse([user_serializer.data,tweet_serializer.data],safe=False)
            elif check == 'deleteConvo':

                convo = Convo.objects.get(id=convo_id)
                messages = UserMessage.objects.filter(convo_id=convo)

                for message in messages:
                    message.delete()

                convo.delete()
                return JsonResponse("Deleted Successfully",safe=False)
            else:
                user = User.objects.get(id=convo_id)
                #tweet = Tweet.objects.get(id=user_id)
                #tweet_user = tweet.user
                user_serializer = UserSerializer(user,many=False)
                return JsonResponse(user_serializer.data,safe=False)
        else:
            return JsonResponse("Failed to Add",safe=False)
    elif request.method =='DELETE':
        tweet = Tweet.objects.get(id=id)
        tweet.delete()
        return JsonResponse("Deleted Successfully",safe=False)


@csrf_exempt
def tweetApi(request,id=id):

    if request.method =='GET':
        tweet = Tweet.objects.all()

       # tweet = Tweet.objects.get(id=1)
        #tweet_user = tweet.user


        #tweet = Tweet.objects.get(id=1) #raw("SELECT * FROM api_user WHERE username = 'Shane'")
        #user = User.objects.get(acc_name=acc_name_input)
        #tweet_user = tweet.user_set.all()
        #user_serializer = UserSerializer(tweet_user,many=False)
        tweet_serializer = TweetSerializer(tweet,many=True)
        return JsonResponse(tweet_serializer.data,safe=False)

    elif request.method =='POST':

        #retrieve message from front end
        message_data = JSONParser().parse(request)
        # serialize message
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            acc_name_input = message_serializer.data['word']
            user = User.objects.get(acc_name=acc_name_input)

            text_content = message_serializer.data['word2']
            image_content = message_serializer.data['word3']
            reply_id = message_serializer.data['num']
            date = datetime.datetime.now() #message_serializer.data['date']

            #get anothet input from message serializer
            tweet = Tweet.create(user,date,text_content,image_content,0,0,0,0,reply_id)
            
            print(tweet)
            
            #tweet.create()
            #tweet_serializer = TweetSerializer(data=tweet)
            #print(tweet_serializer)
            tweet.save()

            if reply_id != 0:
                #get other tweet being replied upon
                tweet2 = Tweet.objects.get(id=reply_id)
                #update comment/reply count
                tweet2.comments = (tweet2.comments + 1)
                tweet2.save()

            #tweet_serializer.save() #if user_serializer.is_valid():
            return JsonResponse("Added Successfully",safe=False)
        else: 
            return JsonResponse("Failed to Add",safe=False)

    elif request.method =='PUT': 
        message_data = JSONParser().parse(request)

        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            check = message_serializer.data['word']
            acc_name_input = message_serializer.data['word2']
            #return JsonResponse("ok",safe=False)
            user_id = message_serializer.data['num']
            if check == 'incrementPostView':
                #increment post views
                tweet = Tweet.objects.get(id=user_id) # is post_id in this scenario
                tweet.engagements = tweet.engagements + 1
                tweet.save()
                return JsonResponse("Successful increment!",safe=False)        
            elif check == 'getLikes':
                #get all tweets that user tweeted
                user = User.objects.get(acc_name=acc_name_input)
                likes = Like.objects.filter(user=user)
                if likes.exists():
                    tweets = []
                    for like in likes:
                        tweets.append(like.tweet)
                    tweet_serializer = TweetSerializer(tweets,many=True)
                    users = []
                    for like in likes:
                        users.append(like.tweet.user)
                    user_serializer = UserSerializer(users,many=True)
                    return JsonResponse([tweet_serializer.data,user_serializer.data],safe=False)
                else:
                    return JsonResponse("No likes",safe=False)
            elif check == 'getRetweets':
                #get all tweets that user tweeted
                user = User.objects.get(acc_name=acc_name_input)
                retweets = Retweet.objects.filter(user=user)
                if retweets.exists():
                    tweets = []
                    for retweet in retweets:
                        tweets.append(retweet.tweet)
                    tweet_serializer = TweetSerializer(tweets,many=True)
                    users = []
                    for retweet in retweets:
                        users.append(retweet.tweet.user)
                    user_serializer = UserSerializer(users,many=True)
                    return JsonResponse([tweet_serializer.data,user_serializer.data],safe=False)
                else:
                    return JsonResponse("No retweets",safe=False)
                
            elif check == 'getFollowFeed':
                #get all tweets from users that are followed 

                user = User.objects.get(acc_name=acc_name_input)
                #print('user: ' + user)
                fs = Follow.objects.filter(following=user)
                follow_list = []
                if fs.exists():
                    #get list of following user acc_names
                    print('fs exists')
                    for f in fs:
                        follow_list.append(f.follower)
                    print('after loop')
                    feed = Tweet.objects.filter(user__in=follow_list)
                    if feed.exists():
                        print('feed exists')
                        tweet_serializer = TweetSerializer(feed,many=True) #this line may not work
                        return JsonResponse(tweet_serializer.data,safe=False)
                    else:
                        print('1')
                        return JsonResponse("No tweets",safe=False)
                    
                else:
                    print('2')
                    return JsonResponse("No tweets",safe=False)
                
            elif check == 'getPosts':
                #get all tweets that user tweeted
                user = User.objects.get(acc_name=acc_name_input)
                tweets = Tweet.objects.filter(user=user)
                if tweets.exists():
                    users = []
                    for tweet in tweets:
                        users.append(tweet.user)
                    user_serializer = UserSerializer(users,many=True)
                    tweet_serializer = TweetSerializer(tweets,many=True)
                    return JsonResponse([tweet_serializer.data,user_serializer.data],safe=False)
                else:
                    return JsonResponse("No posts",safe=False)
            elif check == 'getPost':
                #get all tweets that user tweeted    
                try:               
                    tweet = Tweet.objects.get(id=user_id) # user_id is actually tweet id here
                    tweet_serializer = TweetSerializer(tweet,many=False)
                    print(tweet.user)
                    #user = User.objects.get(id=tweet.user)
                    user_serializer = UserSerializer(tweet.user,many=False)
                    return JsonResponse([tweet_serializer.data,user_serializer.data],safe=False)
                except Tweet.DoesNotExist:
                    return JsonResponse("No post",safe=False)
            elif check == 'getReplies':
                #get all replies to tweet  
                tweets = Tweet.objects.filter(reply_id=user_id) # user_id is actually tweet id here
                if tweets.exists():
                    user_arr = []
                    for tweet in tweets:
                        user_arr.append(tweet.user)

                    tweet_serializer = TweetSerializer(tweets,many=True)
                    user_serializer = UserSerializer(user_arr,many=True)
                    return JsonResponse([tweet_serializer.data,user_serializer.data],safe=False)
                else:
                    return JsonResponse("No replies",safe=False)
            else:
                user = User.objects.get(id=user_id)
                #tweet = Tweet.objects.get(id=user_id)
                #tweet_user = tweet.user
                user_serializer = UserSerializer(user,many=False)
                return JsonResponse(user_serializer.data,safe=False)
        else:
            return JsonResponse("Failed to Add",safe=False)

    #elif request.method =='PUT': 
        #tweet_data = JSONParser().parse(request)
        
        #tweet_serializer = TweetSerializer(data=tweet_data)
        #if tweet_serializer.is_valid():
            #return JsonResponse("ok",safe=False)
            #likes_input = tweet_serializer.data['likes']
            #tweet = Tweet.objects.get(id=likes_input)
            #tweet_user = tweet.user
            #user_serializer = UserSerializer(tweet_user,many=False)
            #return JsonResponse(user_serializer.data,safe=False)
        #else:
            #return JsonResponse("Failed to Add",safe=False)

    elif request.method =='DELETE':
        tweet = Tweet.objects.get(id=id)
        tweet.delete()
        return JsonResponse("Deleted Successfully",safe=False)
    
@csrf_exempt
def notificationApi(request,id=id):

    if request.method =='GET':
        notification = Notification.objects.all()
        notification_serializer = NotificationSerializer(notification,many=True)
        return JsonResponse(notification_serializer.data,safe=False)

    elif request.method =='POST':

        #NOT IN USE
                
        #retrieve message from front end
        message_data = JSONParser().parse(request)
        # serialize message
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            type = message_serializer.data['word']
            acc_name_input_to = message_serializer.data['word2']
            acc_name_input_from = message_serializer.data['word3']

            user_to = User.objects.get(acc_name=acc_name_input_to)
            user_from = User.objects.get(acc_name=acc_name_input_from)
            
            notification = Notification.create(type, user_to, user_from)
            print(notification)
            notification.save()
            return JsonResponse("Added Successfully",safe=False)
        else: 
            return JsonResponse("Failed to Add",safe=False)

    elif request.method =='PUT': 
        message_data = JSONParser().parse(request)

        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            check = message_serializer.data['word']
            acc_name_input = message_serializer.data['word2']
            #return JsonResponse("ok",safe=False)
            notification_id = message_serializer.data['num']            
            if check == 'getNotifications':
                #get all tweets that user tweeted
                user_to = User.objects.get(acc_name=acc_name_input)
                notifications = Notification.objects.filter(user_to=user_to)
                if notifications.exists():
                    users = []
                    types = []
                    tweets = []
                    for notification in notifications:
                        users.append(notification.user_from)
                        types.append(notification.type)
                        if notification.post_id == 0: # if notification is a follow
                            tweets.append(Tweet.create(notification.user_from,datetime.datetime.now(),'','',0,0,0,0,0))
                        else:
                            tweet = Tweet.objects.get(id=notification.post_id)
                            tweets.append(tweet)
                    user_serializer = UserSerializer(users,many=True)
                    tweet_serializer = TweetSerializer(tweets,many=True)
                    return JsonResponse([types,user_serializer.data,tweet_serializer.data],safe=False)
                    #return JsonResponse("No notifications",safe=False)
                else:
                    return JsonResponse("No notifications",safe=False)
            elif check == 'delete':
                notification = Notification.objects.get(id=notification_id)
                notification.delete()
                return JsonResponse("Deleted Successfully",safe=False)
            else:
                return JsonResponse("check is else",safe=False)
        else:
            return JsonResponse("Failed to Add",safe=False)
        
    elif request.method =='DELETE':
        tweet = Tweet.objects.get(id=id)
        tweet.delete()
        return JsonResponse("Deleted Successfully",safe=False)


@csrf_exempt
def retweetApi(request,id=id):

    if request.method =='GET':
        retweet = Retweet.objects.all()
        retweet_serializer = RetweetSerializer(like,many=True)
        return JsonResponse(retweet_serializer.data,safe=False)

    elif request.method =='POST':

        #retrieve message from front end
        message_data = JSONParser().parse(request)
        # serialize message
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():

            #have to get user from front-end
            acc_name_from_input = message_serializer.data['word'] #from
            acc_name_to_input = message_serializer.data['word2'] #to
            user_from = User.objects.get(acc_name=acc_name_from_input)
            user_to = User.objects.get(acc_name=acc_name_to_input)

            #have to get tweet id from front-end
            tweet_id = message_serializer.data['num']
            tweet = Tweet.objects.get(id=tweet_id)
            tweet.retweets = tweet.retweets + 1 #incrementing retweet count of tweet
            tweet.save()

            #add notification to DB
            notification = Notification.create(tweet_id,'Retweet',user_to,user_from)
            notification.save()

            #add retweet to DB
            retweet = Retweet.create(tweet,user_from)
            print(retweet)
            retweet.save()

            db_retweet = Retweet.objects.get(tweet=tweet, user=user_from) #NEW
            retweet_serializer = RetweetSerializer(db_retweet,many=False) #NEW
            return JsonResponse(retweet_serializer.data,safe=False) #NEW
            #return JsonResponse("Added Successfully",safe=False) #NEW
        else: 
            return JsonResponse("Failed to Add",safe=False)

    elif request.method =='PUT': 
        message_data = JSONParser().parse(request)
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            check = message_serializer.data['word']
            acc_name_from_input = message_serializer.data['word2'] #from
            acc_name_to_input = message_serializer.data['word3'] #to
            post_id = message_serializer.data['num']
            if check == 'getRetweets':
                #get all tweets that user tweeted
                user = User.objects.get(acc_name=acc_name_from_input)
                retweets = Retweet.objects.filter(user=user)
                tweets = []
                for retweet in retweets:
                    tweets.append(retweet.tweet)
                if retweets.exists():
                    #return only an array of tweets
                    tweet_serializer = TweetSerializer(tweets,many=True)
                    return JsonResponse(tweet_serializer.data,safe=False)
                else:
                    return JsonResponse("No likes",safe=False)
            elif check == 'getRetweetIDs':
                user = User.objects.get(acc_name=acc_name_from_input)
                retweets = Retweet.objects.filter(user=user)
                tweet_ids = []
                for retweet in retweets:
                    tweet_ids.append(retweet.tweet.id)
                if retweets.exists():
                    #return only an array of tweets
                    #tweet_serializer = TweetSerializer(tweets,many=True)
                    return JsonResponse(tweet_ids,safe=False)
                else:
                    return JsonResponse("No like ids",safe=False)
            elif check == 'delete':
                user_from = User.objects.get(acc_name=acc_name_from_input)
                user_to = User.objects.get(acc_name=acc_name_to_input)
                tweet = Tweet.objects.get(id=post_id)
                tweet.retweets = tweet.retweets - 1 #decrementing retweet count of tweet
                tweet.save()

                #delete notification
                notification = Notification.objects.get(post_id=post_id, user_from=user_from, user_to=user_to, type='Retweet')
                notification.delete()

                #delete retweet
                retweet = Retweet.objects.get(user=user_from, tweet=tweet)
                retweet.delete()
                return JsonResponse("Deleted Successfully",safe=False)
            else:
                return JsonResponse('check is else',safe=False)
        else:
            return JsonResponse("Failed to Add",safe=False)

    elif request.method =='DELETE':
       #message_data = JSONParser().parse(request)
       # message_serializer = MessageSerializer(data=message_data)
        #if message_serializer.is_valid():
           # check = message_serializer.data['word']
            #like_id = message_serializer.data['num']
            #if check == 'delete':
        like = Like.objects.get(id=id)
        like.delete()
        return JsonResponse("Deleted Successfully",safe=False)
        
        


@csrf_exempt
def likeApi(request,id=id):

    if request.method =='GET':
        like = Like.objects.all()
        like_serializer = LikeSerializer(like,many=True)
        return JsonResponse(like_serializer.data,safe=False)

    elif request.method =='POST':

        #retrieve message from front end
        message_data = JSONParser().parse(request)
        # serialize message
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():

            #have to get user from front-end
            acc_name_from_input = message_serializer.data['word']
            acc_name_to_input = message_serializer.data['word2']
            user_from = User.objects.get(acc_name=acc_name_from_input)
            user_to = User.objects.get(acc_name=acc_name_to_input)

            #have to get tweet id from front-end
            tweet_id = message_serializer.data['num']
            tweet = Tweet.objects.get(id=tweet_id)
            tweet.likes = tweet.likes + 1 #incrementing like count of tweet
            tweet.save()

            #add notification to DB
            notification = Notification.create(tweet_id,'Like',user_to,user_from)
            notification.save()

            like = Like.create(tweet,user_from)
            print(like)
            like.save()
            db_like = Like.objects.get(tweet=tweet, user=user_from) #NEW
            like_serializer = LikeSerializer(db_like,many=False) #NEW
            return JsonResponse(like_serializer.data,safe=False) #NEW
            #return JsonResponse("Added Successfully",safe=False) #NEW
        else: 
            return JsonResponse("Failed to Add",safe=False)

    elif request.method =='PUT': 
        message_data = JSONParser().parse(request)
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            check = message_serializer.data['word']
            acc_name_input = message_serializer.data['word2']
            acc_name_to_input = message_serializer.data['word3']
            post_id = message_serializer.data['num']
            if check == 'getLikes':
                #get all tweets that user tweeted
                user = User.objects.get(acc_name=acc_name_input)
                likes = Like.objects.filter(user=user)
                tweets = []
                for like in likes:
                    tweets.append(like.tweet)
                if likes.exists():
                    #return only an array of tweets
                    tweet_serializer = TweetSerializer(tweets,many=True)
                    return JsonResponse(tweet_serializer.data,safe=False)
                else:
                    return JsonResponse("No likes",safe=False)
            elif check == 'getLikeIDs':
                user = User.objects.get(acc_name=acc_name_input)
                likes = Like.objects.filter(user=user)
                tweet_ids = []
                for like in likes:
                    tweet_ids.append(like.tweet.id)
                if likes.exists():
                    #return only an array of tweets
                    #tweet_serializer = TweetSerializer(tweets,many=True)
                    return JsonResponse(tweet_ids,safe=False)
                else:
                    return JsonResponse("No like ids",safe=False)
            elif check == 'delete':
                user_from = User.objects.get(acc_name=acc_name_input)
                user_to = User.objects.get(acc_name=acc_name_to_input)
                tweet = Tweet.objects.get(id=post_id)
                tweet.likes = tweet.likes - 1 #decrementing like count of tweet
                tweet.save()

                #delete notification
                notification = Notification.objects.get(post_id=post_id, user_from=user_from, user_to=user_to, type='Like')
                notification.delete()

                like = Like.objects.get(user=user_from, tweet=tweet)
                like.delete()
                return JsonResponse("Deleted Successfully",safe=False)
            else:
                return JsonResponse('check is else',safe=False)
        else:
            return JsonResponse("Failed to Add",safe=False)

    elif request.method =='DELETE':
       #message_data = JSONParser().parse(request)
       # message_serializer = MessageSerializer(data=message_data)
        #if message_serializer.is_valid():
           # check = message_serializer.data['word']
            #like_id = message_serializer.data['num']
            #if check == 'delete':
        like = Like.objects.get(id=id)
        like.delete()
        return JsonResponse("Deleted Successfully",safe=False)
        #else:
        #    return JsonResponse("Failed to Add",safe=False)


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
            us = user_serializer.data
            #acc_name = message_serializer.data['']
            #user = User.create(us['username'],us['email'],us['acc_name'],us['password'],us['pic'],us['header_pic'],'',us['follower_count'],us['following_count'])
            user = User.create(us['username'],us['email'],us['acc_name'],us['password'],None,None,'',us['follower_count'],us['following_count'])
            user.save()
            #user_serializer.save() #if user_serializer.is_valid():
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
            if username_input == 'getUserSearch':  #getting users to populate search modal
                str_input = password_input # text input from search bar
                #get all users excluding logged in user
                all_users = User.objects.exclude(acc_name=acc_name_input)
                #print('all users: ' + all_users) # new
                user_arr = []
                count = 0
                for user in all_users:
                    print('in loop ') # new
                    print('count: ' + str(count)) # new
                    print('str_input: ' + str_input)
                    lowerAccname = user.acc_name.lower()
                    lowerUsername = user.username.lower()
                    if lowerAccname.startswith(str_input) or lowerUsername.startswith(str_input):
                        user_arr.append(user)
                        count = count + 1
                        
                        if count == 10:
                            break
                if count == 0:
                    return JsonResponse("No users",safe=False)
                else:
                    user_serializer = UserSerializer(user_arr,many=True) #NEW
                    return JsonResponse(user_serializer.data,safe=False)
            elif username_input == 'getPostSearch':  #getting post data as a search result
                str_input = password_input # text input from search bar
                #get all users excluding logged in user
                posts = Tweet.objects.filter(text_content__contains=str_input).order_by('-date_created')
                if posts.exists():

                    users = []
                    for post in posts:
                        users.append(post.user)

                    tweet_serializer = TweetSerializer(posts,many=True) 
                    user_serializer = UserSerializer(users,many=True) 
                    return JsonResponse([tweet_serializer.data,user_serializer.data],safe=False)
                else:
                    return JsonResponse("No posts",safe=False)
            elif username_input == 'check':  #check uniqueness of acc_name
                result = User.objects.filter(acc_name=acc_name_input)
                if result.exists():
                    return JsonResponse("Not Unique",safe=False)
                else:
                    return JsonResponse("Unique",safe=False)
            elif username_input == 'credentialsCheck': # check if password and account name correct
                result = User.objects.filter(acc_name=acc_name_input)
                if result.exists():
                    user = User.objects.get(acc_name=acc_name_input)
                    if user.password == password_input:
                        user_serializer = UserSerializer(user,many=False) #NEW
                        return JsonResponse(user_serializer.data,safe=False) #NEW
                        #return JsonResponse(user.username,safe=False) # ()password and account name correct
                    else:
                        return JsonResponse("AC exists, P incorrect",safe=False)
                else:
                    return JsonResponse("AC doesn't exist",safe=False)
            elif username_input == 'getUser': # check if password and account name correct
                result = User.objects.filter(acc_name=acc_name_input)
                if result.exists():
                    user = User.objects.get(acc_name=acc_name_input)
                    user_serializer = UserSerializer(user,many=False)
                #id_input = user_serializer.data['id']  
                #result = User.objects.filter(id=id_input)
                #if result.exists():
                    #user = User.objects.get(id=id_input)
                    return JsonResponse(user_serializer.data,safe=False)
                else:
                    return JsonResponse("User doesn't exist",safe=False)
            elif username_input == 'updateProfile':
                user = User.objects.get(acc_name=acc_name_input)
                user.bio = password_input
                user.save()
                return JsonResponse("Successful Update",safe=False)

        else: 
            return JsonResponse("Failed to Add",safe=False)
            
    elif request.method =='DELETE':
        user = User.objects.get(id=id)
        user.delete()
        return JsonResponse("Deleted Successfully",safe=False)

@csrf_exempt
def followApi(request,id=id):
    
    if request.method =='GET':
        follow = Follow.objects.all()
        follow_serializer = FollowSerializer(follow,many=True)
        return JsonResponse(follow_serializer.data,safe=False)

    elif request.method =='POST':
        message_data = JSONParser().parse(request)
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            acc_name1 = message_serializer.data['word']
            acc_name2 = message_serializer.data['word2']
            user1 = User.objects.get(acc_name=acc_name1)
            user2 = User.objects.get(acc_name=acc_name2)

            #add notification to DB
            notification = Notification.create(0,'Follow',user1,user2)
            notification.save()

            #add follow to DB
            follow_object = Follow.create(user1,user2)
            follow_object.save()


            #******** NEW ********
            #increment follower_count and following_count of user1 and user2
            user1.follower_count = (user1.follower_count + 1)
            user1.save()
            user2.following_count = (user2.following_count + 1)
            user2.save()


            return JsonResponse("Added Successfully",safe=False)
        #follow_data = JSONParser().parse(request)
        #follow_serializer = FollowSerializer(data=follow_data)
        #if follow_serializer.is_valid():
        #    follow_serializer.save()
        #    return JsonResponse("Added Successfully",safe=False)
        #return JsonResponse("Failed to Add",safe=False)
        else:
            return JsonResponse("Failed to Add",safe=False)
    
    elif request.method =='PUT':
        message_data = JSONParser().parse(request)
        message_serializer = MessageSerializer(data=message_data)
        if message_serializer.is_valid():
            check = message_serializer.data['word']
            acc_name_input = message_serializer.data['word2']
            acc_name_input2 = message_serializer.data['word3']
            if check == 'getFollowers':
                #return JsonResponse("inside getFollowers if",safe=False)
                user = User.objects.get(acc_name=acc_name_input)
                followers = Follow.objects.filter(follower=user)
                following = []
                for follow in followers:
                    following.append(follow.following)
                    
                if followers.exists():
                    user_serializer = UserSerializer(following,many=True)
                    return JsonResponse(user_serializer.data,safe=False)
                    #follow_serializer = FollowSerializer(followers,many=True)
                    #return JsonResponse(follow_serializer.data,safe=False)
                else:
                    return JsonResponse("No followers",safe=False)
            elif check == 'getFollowing':
                #return JsonResponse("inside getFollowing if",safe=False)
                user = User.objects.get(acc_name=acc_name_input)
                following = Follow.objects.filter(following=user)
                followers = []
                for follow in following:
                    followers.append(follow.follower)

                if following.exists():
                    user_serializer = UserSerializer(followers,many=True)
                    return JsonResponse(user_serializer.data,safe=False)
                    #follow_serializer = FollowSerializer(following,many=True)
                    #return JsonResponse(follow_serializer.data,safe=False)
                else:
                    return JsonResponse("No following",safe=False)
            elif check == 'getDefaultList':
                #return JsonResponse("inside getFollowing if",safe=False)
                user = User.objects.get(acc_name=acc_name_input)
                following = Follow.objects.filter(following=user)
                if following.exists():
                    followers = []
                    count = 0
                    for follow in following:
                        followers.append(follow.follower)
                        count = count + 1
                        if count == 10:
                            break
                    user_serializer = UserSerializer(followers,many=True)
                    return JsonResponse(user_serializer.data,safe=False)
                else:
                    return JsonResponse("No following",safe=False)
            elif check == 'delete':

                user1 = User.objects.get(acc_name=acc_name_input)
                user2 = User.objects.get(acc_name=acc_name_input2)

                #delete follow from DB
                follow = Follow.objects.filter(following=user1, follower=user2)
                follow.delete()

                            #******** NEW ********
                #increment follower_count and following_count of user1 and user2
                user1.follower_count = (user1.follower_count - 1)
                user1.save()
                user2.following_count = (user2.following_count - 1)
                user2.save()

                #Do i want to delete notification for follow? (add it here if so)
                return JsonResponse("Deleted Successfully",safe=False)

        else:
            return JsonResponse("Failed to Add",safe=False)



"""
        message_serializer = MessageSerializer(data=message_data)
       if message_serializer.is_valid():
            
            check = message_serializer.data['word']
            acc_name_input = message_serializer.data['word2']
            if check == 'getFollowers':
                return JsonResponse("inside getFollowers if") 
                user = User.objects.get(acc_name=acc_name_input)
                followers = Follow.objects.filter(follower=user)
                if result.exists():
                    follow_serializer = FollowSerializer(followers,many=True)
                    return JsonResponse(follow_serializer.data,safe=False)
                else:
                    JsonResponse("No followers")
            elif check == 'getFollowing':
                return JsonResponse("inside getFollowing if") 
                user = User.objects.get(acc_name=acc_name_input)
                following = Follow.objects.filter(following=user)
                if result.exists():
                    follow_serializer = FollowSerializer(following,many=True)
                    return JsonResponse(follow_serializer.data,safe=False)
                else:
                    JsonResponse("No following")
        else:
            return JsonResponse("Failed to Add") 
 
    elif request.method =='DELETE':
        follow = Follow.objects.get(id=id)
        follow.delete()
        return JsonResponse("Deleted Successfully",safe=False)

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