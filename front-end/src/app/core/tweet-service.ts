
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

//gets all tweets(from DB) and adds them to DBfeed array
getDBForYouFeed()
{
    this.http.get("http://127.0.0.1:8000/tweet").subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.DBfeed = resultData;
    });
}

// Presets UserFeed (needed to make sure profiles are added at the proper index)
presetUserFeed()
{
  this.DBfeed.forEach(() => {
    var u = new Profile("", "", "", "", 0, 0);
    this.UserFeed.push(u)
  });
}

//gets all users from tweets(from DB) and creates a Profile object with them and adds them to UserFeed array
getDBForYouFeedUsers()
{
  //let arr: Profile []= Array<Profile>(this.DBfeed.length);
  //this.UserFeed = arr;
  this.presetUserFeed();
  //this goes in any order
  this.DBfeed.forEach((tweet,index) => {

    console.log(tweet.user)
    
    let requestBody =
    {
      "num": tweet.user,
      "word": 'w',
    };
    console.log("BEFORE tweet-id:" + tweet.id);
    this.http.put("http://127.0.0.1:8000/tweet",requestBody).subscribe((resultData: any)=>
    {
        var u = new Profile(this.elon, resultData.username, resultData.acc_name, "bio", 100, 200);
        this.UserFeed.splice(index, 1, u);
        console.log("AFTER tweet-id:" + tweet.id + " recieved user data: " + resultData.username + "index: " + (index+ 1));
        //this.UserFeed.push(u) //this is the issue, being added to array out of order(because loop completed b4 http requests are processed)

    });
    //req.unsubscribe();
    
});
}
/*
getDBForYouFeedUsers1(tweet:any)
{
  //this goes in any order
  

    console.log(tweet.user)
    
    let requestBody =
    {
      "num": tweet.user,
      "word": 'w',
    };
    this.http.put("http://127.0.0.1:8000/tweet",requestBody).subscribe((resultData: any)=>
    {
        console.log("AFTER tweet-id:" + tweet.id + " recieved user data: " + resultData.username );
        var u = new Profile(this.elon, resultData.username, resultData.acc_name, "bio", 100, 200);
        this.UserFeed.push(u)
    });        
});
}
*/
//creates Post objects using data from DBFeed and UserFeed arrays and adds them to FEfeed array
convertForYouFeed()
{   
    //UserFeed is all out of whack 
    console.log("Userfeed: " +this.UserFeed[0].username)
    this.DBfeed.forEach((tweet,index) => {
            
        var p = new Post(this.UserFeed[index].pic, this.UserFeed[index].username, this.UserFeed[index].acc_name,this.DBfeed[index].date_created, this.DBfeed[index].text_content, this.elon, this.DBfeed[index].comments.toString(), this.DBfeed[index].retweets.toString(), this.DBfeed[index].likes.toString(), this.DBfeed[index].engagements.toString()); 
        this.FEfeed.push(p);
        console.log(p.toString())        
    });
}


//gets data for 'ForYou'feed, calls the 3 above functions using delays to ensure all the data is available, when accessed
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

        const postPromise2 = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.getDBForYouFeedUsers();
            resolve('we got a response');
          }, 2000) // 0 secs

        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't check")
          }, 10000) //8 secs

          setTimeout(() => {
            globalObj.convertForYouFeed();
            resolve('we checked');
          }, 3000) // 1 sec

        })
        
        async function myAsync(){
          //console.log("inside myAsync");
          try{
            postPromise;
            postPromise2;
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
