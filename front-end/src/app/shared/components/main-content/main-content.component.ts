import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '../../../app.component';
import {createEntertainmentSearchTopics, createForYouSearchTopics , createNewsSearchTopics, createSportsSearchTopics, createTrendingSearchTopics, Profile } from '../../../core/data';
import { TweetService } from '../../../core/tweet-service';
import { MessagePageComponent } from '../../../features/message-page/message-page.component';
import { CoreService } from '../../../core/core-service.service';
import { AuthService } from '../../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  /*standalone: true,*/
  selector: 'main-content',
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {

  @Input() query: string = ''; //needed for explore page
  @Input() upc: any = ''; //universal page component

  //testing
  @Input() data: any [] = []; //what tab is being displayed
  @Input() user: Profile = new Profile('','','','','',0,0);

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed
  //@Input() mpc:MessagePageComponent = new MessagePageComponent(this.authService, this.route,this.service,this.tweetService);
  @Input () c_c: boolean = false;
  forYouFeed: any [] = []

  constructor(private tweetService: TweetService, public service: CoreService, public authService: AuthService, public route: ActivatedRoute){
   // console.log('myService', tweetService);

    //this.forYouFeed = this.tweetService.FEfeed
   // this.forYouFeed = [];
    //console.log(this.forYouFeed)
  }

  ngOnChanges(changes: SimpleChanges)
  {
    console.log(changes);
    console.log("a change in main component");
    console.log("tab:" + this.tab)
    console.log("page:" + this.page)
  }

  //explore page data
  forYouSearchTopics = createForYouSearchTopics();
  trendingSearchTopics = createTrendingSearchTopics();
  newsSearchTopics = createNewsSearchTopics();
  sportsSearchTopics = createSportsSearchTopics();
  entertainmentSearchTopics = createEntertainmentSearchTopics();

  //profile page data
  followerProfiles = [];
  followingProfiles = [];

  // global page data

  //to ensure only one modal is visible at a time
  openmodal: boolean = false;

  mcc = this;

  changeOpenModal(newValue: boolean){
    this.openmodal = newValue;
    console.log(this.openmodal);
  }
  
}
