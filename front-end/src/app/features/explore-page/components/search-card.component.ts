import { Component, Input} from '@angular/core';
import { SearchTopic } from '../../../core/data';
import { ExplorePageComponent } from '../explore-page.component';
import { CoreService } from '../../../core/core-service.service';



@Component({

  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrl: '../explore-page.component.scss',

})
export class SearchCardComponent /*extends ExplorePageComponent*/{
@Input () searchTopic = new SearchTopic('','',0);
@Input () inSearch: boolean = false;

//need to pass instance of explore page into this component
//@Input () epc: ExplorePageComponent = new ExplorePageComponent(this.router,this.http,this.authService,this.route,this.service,this.tweetService);
@Input () epc: any = '';
  //populates searchbar with searchtopic topic
  constructor(public service: CoreService) {}
        
  goToSearch(){
    

    

    if(this.service.current_page == 'Explore' ||this.service.current_page == 'OtherExplore')
    {
        //hide modal of search bar
        //this.modalFlag = false;
        //this.focus =false;

        this.epc.inActiveSearch = true;

        this.service.routeToChild('blank');
        //do all the db calls from here to populate the arrays

        //one for latest (get posts [0] and users [1])
        this.epc.postList = [];
        this.epc.postUserList = [];
        this.epc.getDBPostFeed(this.searchTopic.topic);
        //one for people (get users [2])
        this.epc.userList = [];
        this.epc.getDBUserFeed(this.searchTopic.topic);

        //none for media [3] is always empty

        setTimeout(() => {
          this.epc.arr = [this.epc.postList,this.epc.postUserList,this.epc.userList,''];
          this.epc.query = this.searchTopic.topic;
          let urlFriendlyStr = this.searchTopic.topic.replace(/ /g, '-');
          this.service.router.navigate(['tweeter/Explore/' + urlFriendlyStr]);
          this.service.setCurrentPage('OtherExplore'); 
          console.log("submitted");
        }, 1000) // 1 sec
        
        setTimeout(() => {
          this.service.routeToChild('latest');
        }, 2000) // 2 sec
    }
    else
    {
      let urlFriendlyStr = this.searchTopic.topic.replace(/ /g, '-');
      this.service.router.navigate(['tweeter/Explore/' + urlFriendlyStr]);
    }

  }
}