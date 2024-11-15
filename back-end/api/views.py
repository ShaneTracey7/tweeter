from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from django.http.response import JsonResponse
from api.serializers import StudentSerializer, UserSerializer, TweetSerializer, MessageSerializer, FollowSerializer, LikeSerializer, RetweetSerializer, NotificationSerializer
from api.models import Student, User, Tweet, Message, Follow, Like, Retweet, Notification
from rest_framework.renderers import JSONRenderer
import json
import datetime

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
            if check == 'getLikes':
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
            if username_input == 'getUserSearch':  #getting users to populate search modal
                all_users = User.objects.all()
                user_arr = []
                count = 0
                for user in all_users:
                    if user.acc_name.startswith(acc_name_input) or user.username.startswith(acc_name_input):
                        user_arr.append(user)
                        count = count + 1
                        if count == 10:
                            break
                if count == 0:
                    return JsonResponse("No users",safe=False)
                else:
                    user_serializer = UserSerializer(user_arr,many=True) #NEW
                    return JsonResponse(user_serializer.data,safe=False)
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




 #       message_serializer = MessageSerializer(data=message_data)
 #       if message_serializer.is_valid():
            
 #           check = message_serializer.data['word']
 #           acc_name_input = message_serializer.data['word2']
 #           if check == 'getFollowers':
 #               return JsonResponse("inside getFollowers if") 
 #               user = User.objects.get(acc_name=acc_name_input)
 #               followers = Follow.objects.filter(follower=user)
 #               if result.exists():
 #                   follow_serializer = FollowSerializer(followers,many=True)
 #                   return JsonResponse(follow_serializer.data,safe=False)
 #               else:
 #                   JsonResponse("No followers")
 #           elif check == 'getFollowing':
 #               return JsonResponse("inside getFollowing if") 
 #               user = User.objects.get(acc_name=acc_name_input)
 #               following = Follow.objects.filter(following=user)
 #               if result.exists():
 #                   follow_serializer = FollowSerializer(following,many=True)
 #                   return JsonResponse(follow_serializer.data,safe=False)
#                else:
#                    JsonResponse("No following")
#        else:
#            return JsonResponse("Failed to Add") 
        #
        #student = Student.objects.get(id=id)
        #student_serializer = StudentSerializer(student,data=student_data)
        #if student_serializer.is_valid():
        #    student_serializer.save()
        #    return JsonResponse("Updated Successfully",safe=False)
        #return JsonResponse("Failed to Update")
    
    elif request.method =='DELETE':
        follow = Follow.objects.get(id=id)
        follow.delete()
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