import { Component, Input} from '@angular/core';
import { SearchTopic } from '../../data';


@Component({

  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrl: '../explore-page.component.scss',

})
export class SearchCardComponent {
@Input () searchTopic = new SearchTopic('','',0);
 
}