
import { HttpClient } from "@angular/common/http";
import { Injectable} from "@angular/core";
import { Post, getImgUrl, Profile } from "./data";


@Injectable()
export class TweetService {

    DBfeed: any [] = [];
    FEfeed: Post [] = [];
    UserFeed: Profile [] = [];

    constructor( private http: HttpClient ) {
        this.createForYouFeed(); 
    }

//Global variables (for test data)
elon: string = getImgUrl('elon.jpeg');

//function that creates data for the for you feed (homePage)
getDBForYouFeed()
{
    this.http.get("http://127.0.0.1:8000/tweet").subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.DBfeed = resultData;
    });
    
}


//this creates a 500 internal service error, and i dont know why
getDBForYouFeedUsers()
{
  //this.DBfeed.forEach((tweet) => {
    //have to do another api call to get the user (implement later)
    console.log(this.DBfeed[0].user)
    let requestBody =
    {
      
      //"name" : 'credentialsCheck',
      "id" : this.DBfeed[0].user,
      "username" : 'getUser',
      "email" : 'e',
      "acc_name" : 'ac',
      "password" : 'p',
    };

    this.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
    {
        console.log("this is recieved user data: " + resultData);
        //var u = new Profile(this.elon, resultData.username, resultData.acc_name, "bio", 100, 200);
        //this.UserFeed.push(u)
    });        
//});
}

convertForYouFeed()
{
  
    //creating list
    //var feed = new Array<Post>;

    this.DBfeed.forEach((tweet,index) => {
            //have to do another api call to get the user (implement later)

            /*var User: any = [];

            let requestBody =
            {
              //"name" : 'credentialsCheck',
              "id" : tweet.user,
              "username" : 'getUser',
              "email" : 'e',
              "acc_name" : 'ac',
              "password" : 'p',
            };
        
            this.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
            {
                console.log(resultData);
                User = resultData
                //var u = new Profile(this.elon, resultData.username, resultData.acc_name, "bio", 100, 200);
                //this.UserFeed.push(u)
            });*/




        //var p = new Post(this.UserFeed[0].pic, this.UserFeed[0].username, this.UserFeed[0].acc_name,tweet.date_created, tweet.text_content, this.elon, tweet.comments.toString(), tweet.retweets.toString(), tweet.likes.toString(), tweet.engagements.toString());
       var p = new Post(this.elon, 'username', 'acc_name',tweet.date_created, tweet.text_content, this.elon, tweet.comments.toString(), tweet.retweets.toString(), tweet.likes.toString(), tweet.engagements.toString());
        //var p = new Post(this.elon, User[0], User[1],tweet.date_created, tweet.text_content, this.elon, tweet.comments.toString(), tweet.retweets.toString(), tweet.likes.toString(), tweet.engagements.toString());
        
        this.FEfeed.push(p);
        console.log(p.toString())        
    });

    //return feed;
}

createForYouFeed()
{
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.getDBForYouFeed();
            resolve('we got a response');
          }, 0) // 0 secs

        })
/*
        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getDBForYouFeedUsers();
            resolve('we got a response');
          }, 2000) // 0 secs

        })
*/
        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't check")
          }, 10000) //8 secs

          setTimeout(() => {
            globalObj.convertForYouFeed();
            resolve('we checked');
          }, 1000) // 1 sec

        })
        
        async function myAsync(){
          //console.log("inside myAsync");
          try{
            await postPromise;
            //await postPromise2;
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
          //console.log("end of myAsync");
        }
        myAsync();

}


    
 }
