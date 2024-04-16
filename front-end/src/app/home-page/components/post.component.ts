import { Component, Input} from '@angular/core';
import { Post } from '../../data';


@Component({

  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: '../home-page.component.scss',

})
export class PostComponent {
@Input () post = new Post('','','','','','',0,0,0,0);
 
}
