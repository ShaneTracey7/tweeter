import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { createAllNotifications, createEntertainmentSearchTopics, createFollowingFeed, createForYouSearchTopics, createMentionsNotifications, createMessages, createNewsSearchTopics, createSportsSearchTopics, createTrendingSearchTopics, createVerifiedNotifications } from '../../../core/data';
import { TweetService } from '../../../core/tweet-service';
import { MessagePageComponent } from '../../../features/message-page/message-page.component';
import { CoreService } from '../../../core/core-service.service';
import { AuthService } from '../../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  /*standalone: true,*/
  selector: 'main-content',
  templateUrl: './main-content.component.html',
})
export class MainContentComponent {

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed
  @Input() mpc:MessagePageComponent = new MessagePageComponent(this.authService, this.route,this.service);
  @Input () c_c: boolean = false;
  forYouFeed: any [] = []

  constructor(private tweetService: TweetService, public service: CoreService, public authService: AuthService, public route: ActivatedRoute){
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
