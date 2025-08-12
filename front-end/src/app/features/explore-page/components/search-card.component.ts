import { Component, Input} from '@angular/core';
import { SearchTopic } from '../../../core/data';
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
@Input () epc: any = '';
  //populates searchbar with searchtopic topic
  constructor(public service: CoreService) {}
        
  goToSearch(){

    if(this.service.current_page == 'Explore' || this.service.current_page == 'OtherExplore')
    {    
        //start loading spinner
        this.epc.loadingPostFlag = true;

        this.epc.inActiveSearch = true;
        this.service.routeToChild('blank');

        //latest (get posts [0] and users [1], people [2], media [3] )
        this.epc.postList = [];
        this.epc.postUserList = [];
        this.epc.getDBPostFeed(this.searchTopic.topic);
      
        this.epc.userList = [];
        this.epc.getDBUserFeed(this.searchTopic.topic);

        this.epc.query = this.searchTopic.topic;
        let urlFriendlyStr = this.searchTopic.topic.replace(/ /g, '-');
        this.service.router.navigate(['tweeter/Explore/' + urlFriendlyStr]);
        this.service.setCurrentPage('OtherExplore'); 
        this.service.routeToChild('latest');
        console.log("submitted");
    }
    else
    {
      let urlFriendlyStr = this.searchTopic.topic.replace(/ /g, '-');
      this.service.router.navigate(['tweeter/Explore/' + urlFriendlyStr]);
      //this.service.setCurrentPage('OtherExplore'); 
      this.service.setCurrentPage('OtherExplore'); 
    }

  }
}