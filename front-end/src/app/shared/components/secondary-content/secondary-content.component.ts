import { Component, Input, SimpleChanges } from '@angular/core';
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
  profiles: any []; //who to follow profile arr
  service_acc_name: string;

  loadingFlag: boolean = true; //flags to show spinner while data is being fetched

  // global page data
  topics = createSecondarySearchTopics(); //static data

  constructor(private service: CoreService){
    
    this.profiles = []; 
    this.service_acc_name = "";
  }

  ngOnInit()
  {
    this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";  
    
    if (this.service.WhoToFollowFeed == null || this.service.WhoToFollowFeed.length < 1)
      {
        this.service.createWhoToFollowFeed(this.service_acc_name).subscribe(feed => {
          //console.log("WhoToFollowFeed", feed);
          if(feed.length >= 3)
          {
            this.profiles = [feed[0],feed[1],feed[2]];
          }
          else
          {
            this.profiles = feed; //could be null or [] idk
          } 
          this.loadingFlag = false;
        });
        console.log("this.service.UserFeed == null");
      }
    else
      {
        if(this.service.WhoToFollowFeed.length >= 3)
          {
            //first 3 max
            this.profiles = [this.service.WhoToFollowFeed[0],this.service.WhoToFollowFeed[1],this.service.WhoToFollowFeed[2]];
          }
          else
          {
            this.profiles = this.service.WhoToFollowFeed;
          } 
          this.loadingFlag = false;
        console.log("this.service.UserFeed is not null");
      }
  }

  //only for testing purposes
  ngOnChanges(changes: SimpleChanges)
  {
    console.log(changes);
    console.log("a change in secondary component");
    console.log("tab:" + this.tab)
    console.log("page:" + this.page)
  }

}
