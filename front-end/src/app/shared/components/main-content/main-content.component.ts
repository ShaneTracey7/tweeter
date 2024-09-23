import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { createAllNotifications, createEntertainmentSearchTopics, createFollowingFeed, createForYouSearchTopics, createMentionsNotifications, createMessages, createNewsSearchTopics, createSportsSearchTopics, createTrendingSearchTopics, createVerifiedNotifications } from '../../../core/data';
import { TweetService } from '../../../core/tweet-service';
@Component({
  /*standalone: true,*/
  selector: 'main-content',
  templateUrl: './main-content.component.html',
})
export class MainContentComponent {

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed

  forYouFeed: any [] = []

  constructor(private tweetService: TweetService){
    console.log('myService', tweetService);

    this.forYouFeed = this.tweetService.FEfeed
    //console.log(this.forYouFeed)
  }

  //home page data
  followingFeed = createFollowingFeed(); //only posts from following
  //forYouFeed = this.createForYouFeed(); //any posts

  //message page data
  messages = createMessages();

  //notification page data
  allNotifications = createAllNotifications();
  verifiedNotifications = createVerifiedNotifications();
  mentionsNotifications = createMentionsNotifications();

  //explore page data
  forYouSearchTopics = createForYouSearchTopics();
  trendingSearchTopics = createTrendingSearchTopics();
  newsSearchTopics = createNewsSearchTopics();
  sportsSearchTopics = createSportsSearchTopics();
  entertainmentSearchTopics = createEntertainmentSearchTopics();

  // global page data


  //to ensure only one modal is visible at a time
  openmodal: boolean = false;

  mcc = this;

  changeOpenModal(newValue: boolean){
    this.openmodal = newValue;
    console.log(this.openmodal);
  }
  
}
