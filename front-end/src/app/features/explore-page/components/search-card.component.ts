import { Component, Input} from '@angular/core';
import { SearchTopic } from '../../../core/data';
import { ExplorePageComponent } from '../explore-page.component';



@Component({

  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrl: '../explore-page.component.scss',

})
export class SearchCardComponent extends ExplorePageComponent{
@Input () searchTopic = new SearchTopic('','',0);
 
}