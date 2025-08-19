import { Component} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { CoreService } from './core-service.service';

@Component({

  selector: 'core-component',
  templateUrl: './core.component.html',
  styleUrl: './core.component.scss',
})
export class CoreComponent{
  title = 'front-end';

  constructor(public route: ActivatedRoute, public service: CoreService) {
    
    var arr = window.location.pathname.split("/");
    let last_url_section = arr.pop() ??"error";
    let second_last = arr.pop() ??"error";

    //sets current page and cp_style
    if (last_url_section == 'Home' || last_url_section == 'Explore' || last_url_section == 'Notifications' || last_url_section == 'Messages' || last_url_section == 'Profile')
    { 

      this.service.current_page = last_url_section;
      this.service.cp_style = last_url_section;
    }
    else
    {
        if (second_last == 'Profile')
        {
          if(last_url_section == 'followers' || last_url_section == 'following')
            {
              this.service.current_page = 'ProfileFollow';
              this.service.cp_style = 'ProfileFollow';
            }
            else
            {
              this.service.current_page = 'OtherProfile';
              this.service.cp_style = 'OtherProfile';
            }
        }
        else if(second_last == 'Post')
        {
          this.service.current_page = 'Post';
          this.service.cp_style = 'Post';
        }
        /*else if(second_last == 'Explore') //new
        {
          this.service.current_page = 'OtherExplore';
          this.service.cp_style = 'OtherExplore';
        }*/
        else
        {
          this.service.current_page = last_url_section;
          this.service.cp_style = last_url_section;
        }
    }

    }
}
