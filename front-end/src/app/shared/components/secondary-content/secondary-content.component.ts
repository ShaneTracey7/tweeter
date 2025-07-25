import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { createSecondarySearchTopics} from '../../../core/data';
import { CoreService } from '../../../core/core-service.service';
@Component({
  /*standalone: true,*/
  selector: 'secondary-content',
  templateUrl: './secondary-content.component.html',
})
export class SecondaryContentComponent {

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed
  @Input() pane: number = 0; //what pane is being displayed
  profiles: any [];// = []
  service_acc_name: string;

  constructor(private service: CoreService){
    
    this.profiles = [];//this.service.UserFeed
    this.service_acc_name = "";
    //console.log(this.profiles)
  }

  ngOnInit()
  {
    console.log("page b4 init:" + this.page)
    this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";  
    
    //this.service.createUserFeed(true,this.service_acc_name);
    console.log("this.service.WhoToFollowFeed: " + this.service.WhoToFollowFeed)
    if (this.service.WhoToFollowFeed == null || this.service.WhoToFollowFeed.length < 1)
      {
        this.service.createWhoToFollowFeed(this.service_acc_name).subscribe(feed => {
          console.log("WhoToFollowFeed", feed);
          if(feed.length >= 3)
          {
            this.profiles = [feed[0],feed[1],feed[2]];
          }
          else
          {
            this.profiles = feed;
          } 
          
        });
        //this.profiles = this.service.createUserFeed2(this.service_acc_name);
        console.log("this.service.UserFeed == null");
      }
    else
      {
        if(this.service.WhoToFollowFeed.length >= 3)
          {
            this.profiles = [this.service.WhoToFollowFeed[0],this.service.WhoToFollowFeed[1],this.service.WhoToFollowFeed[2]];
          }
          else
          {
            this.profiles = this.service.WhoToFollowFeed;
          } 
        //this.profiles = this.service.WhoToFollowFeed;
        console.log("this.service.UserFeed is not null");
      }
  }

  ngOnChanges(changes: SimpleChanges)
  {
    console.log(changes);
    console.log("a change in secondary component");
    console.log("tab:" + this.tab)
    console.log("page:" + this.page)
  }

  // global page data
  //profiles = createProfiles();
  topics = createSecondarySearchTopics();

}
