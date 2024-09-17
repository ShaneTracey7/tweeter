
import { HttpClient } from "@angular/common/http";
import { Injectable} from "@angular/core";
import { Post, getImgUrl } from "./data";


@Injectable()
export class TweetService {

    DBfeed: any [] = [];

    constructor( private http: HttpClient ) { 
  
        this.createForYouFeed();  
      }

//Global variables (for test data)
elon: string = getImgUrl('elon.jpeg');

//function that creates data for the for you feed (homePage)
createForYouFeed(){
    //creating list
   var feed = new Array<Post>;
 
    this.http.get("http://127.0.0.1:8000/tweet")
    .subscribe((resultData: any)=>
    {
        console.log(resultData);
        this.DBfeed = resultData;
    });
        
    //appending instances to list
    this.DBfeed.forEach((tweet) => {
        //have to do another api call to get the user (implement later)
        /*tweet.user
        this.http.get("http://127.0.0.1:8000/user")
        .subscribe((resultData: any)=>
        {
            console.log(resultData);
            this.UserInfo = resultData;
        });*/
        feed.push(new Post(this.elon, 'username', 'accountname',tweet.date_created, tweet.text_content, this.elon, tweet.comments, tweet.retweets, tweet.likes, tweet.engagements));
    
    });
    return feed;
 }
}