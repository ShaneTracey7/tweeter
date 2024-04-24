import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { createAllNotifications, createEntertainmentSearchTopics, createFollowingFeed, createForYouFeed, createForYouSearchTopics, createMentionsNotifications, createMessages, createNewsSearchTopics, createSportsSearchTopics, createTrendingSearchTopics, createVerifiedNotifications } from '../../../core/data';
@Component({
  /*standalone: true,*/
  selector: 'main-content',
  templateUrl: './main-content.component.html',
})
export class MainContentComponent {

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed

  //home page data
  followingFeed = createFollowingFeed();
  forYouFeed = createForYouFeed();

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
  
}
