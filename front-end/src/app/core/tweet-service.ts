
import { HttpClient } from "@angular/common/http";
import { Injectable} from "@angular/core";
import { Post, getImgUrl, Profile } from "./data";
import { FormBuilder, FormControl, Validators } from "@angular/forms";


@Injectable()
export class TweetService {

    DBfeed: any [] = [];
    FEfeed: Post [] = [];
    UserFeed: Profile [] = [];

    DBlikes: number [] = []; //just stores tweet/post id's
    DBretweets: number [] = []; //just stores tweet/post id's

    constructor( private http: HttpClient, private formBuilder: FormBuilder ) {
        this.createForYouFeed(); 
    }

//Global variables (for test data)
elon: string = getImgUrl('elon.jpeg');

//validates tweet
tweetValidated(text_content:string,image_content: string)
{
  if(text_content == "")
    {
      if(image_content == "empty" || image_content == "")
        {
          console.log("no content, tweet invalid!")
          return false;
        }
      else
      {
        console.log("tweet valid, only picture")
          return true;
      }
    }
    else
    {
      if(text_content.length < 180)
        {
          console.log("tweet valid")
          return true;
        }
      else
        {
          console.log("tweet too long, tweet invalid!")
          return false;
        }
    }
}


getLikeIDs(ac:string)
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.getLikeIDsDB(ac);
            resolve('we got a response');
          }, 0) // 0 secs

        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            //arr = globalObj.DBlikes
            resolve('we got a response');
          }, 500) // 0 secs

        })

        async function myAsync(){
          //console.log("inside myAsync");
          try{
            postPromise;
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
          //console.log("end of myAsync");
        }
        
        myAsync();
  }


//sets list of like id's
getLikeIDsDB(ac:string)
{
  let requestMessage =
    {
      "word": 'getLikeIDs',
      "word2": ac, 
    }
    
  this.http.put("http://127.0.0.1:8000/like",requestMessage).subscribe((resultData: any)=>
    {
        //console.log(resultData);

        if(resultData == 'Failed to Add' || resultData == 'No like ids' || resultData == 'check is else')
        {
          console.log("Did not get ID's");
          console.log(resultData);
          this.DBlikes = [];
        }
        else //Successful
        {
          this.DBlikes = resultData;
          console.log(this.DBlikes);
        }
    });
  }

  //sets list of like id's
getRetweetIDsDB(ac:string)
{
  let requestMessage =
    {
      "word": 'getRetweetIDs',
      "word2": ac, 
    }
    
  this.http.put("http://127.0.0.1:8000/retweet",requestMessage).subscribe((resultData: any)=>
    {
        //console.log(resultData);

        if(resultData == 'Failed to Add' || resultData == 'No retweet ids' || resultData == 'check is else')
        {
          console.log("Did not get ID's");
          console.log(resultData);
          this.DBretweets = [];
        }
        else //Successful
        {
          this.DBretweets = resultData;
          console.log(this.DBretweets);
        }
    });
  }



//validates tweet and adds tweet to database
postTweet(acc_name: string, text_content: string, image_content: string, reply_id: number)
{

  if (image_content == "")
    {
      image_content = "empty"
    }
  console.log(text_content);

  if(this.tweetValidated(text_content,image_content))
  {

  let requestMessage =
    {
      "word": acc_name,
      "word2": text_content,
      "word3": image_content,
      "num": reply_id,
      //"date": Date(),    //date_created
    }
    console.log(requestMessage)
  
  this.http.post("http://127.0.0.1:8000/tweet",requestMessage).subscribe((resultData: any)=>
    {
        console.log(resultData);
    });
    
  }
}

//gets all tweets(from DB) and adds them to DBfeed array
getDBForYouFeed()
{
    this.http.get("http://127.0.0.1:8000/tweet").subscribe((resultData: any)=>
    {
        //console.log(resultData);
        this.DBfeed = resultData;
    });
}

// Presets UserFeed (needed to make sure profiles are added at the proper index)
presetUserFeed()
{
  this.DBfeed.forEach(() => {
    var u = new Profile("","","", "", "", 0, 0);
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

    let requestBody =
    {
      "word": 'w',
      "num": tweet.user,
      //"word": 'w',
    };

    this.http.put("http://127.0.0.1:8000/tweet",requestBody).subscribe((resultData: any)=>
    {
        //var u = new Profile(this.elon, resultData.username, resultData.acc_name, "bio", 100, 200);
        var u = new Profile(resultData.pic, resultData.header_pic,resultData.username, resultData.acc_name, "bio", 100, 200);
        this.UserFeed.splice(index, 1, u);
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

    this.DBfeed.forEach((tweet,index) => {
      
        //console.log("tweet id: " + tweet.id)
      //need to use 'this.DBfeed[index].image_content' when i figure out how to upload images
        var p = new Post(tweet.id,this.UserFeed[index].pic, this.UserFeed[index].username, this.UserFeed[index].acc_name,this.DBfeed[index].date_created, this.DBfeed[index].text_content, '', this.DBfeed[index].comments.toString(), this.DBfeed[index].retweets.toString(), this.DBfeed[index].likes.toString(), this.DBfeed[index].engagements.toString()); 
        this.FEfeed.push(p);       
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
          }, 500) // 0 secs

        })

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
