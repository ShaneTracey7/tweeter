import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import { ShortProfileComponent } from '../short-profile/short-profile.component';
import { Profile } from '../../../core/data';

@Component({

  selector: 'profile-modal',
  templateUrl: './profile-modal.component.html',
})
export class ProfileModalComponent {

  @Input() profile = new Profile('','','','',0,0);
  @Input() show: boolean = false;
  @Input() inMain: boolean = false;

  setModalPosition() {
        
        let secondary_content_container = <HTMLElement>document.getElementById("sc");
        let main_content_container = <HTMLElement>document.getElementById("mc");
        let scroll_container;

        if (this.inMain) //in main content
          {
            scroll_container = main_content_container;
          }
        else // in secondary content
          {
            scroll_container = secondary_content_container;
          }

        let modal = <HTMLElement>document.getElementById("p-modal");
        let img = <HTMLElement>document.getElementById("p-img"); //in modal
        let modal_width = 300;
        let modal_height = modal.offsetHeight;
        var img_width = 40;
        let img_height = 40;
        
        let x = img.getBoundingClientRect().left;//img.offsetLeft;
        let y = img.getBoundingClientRect().top;//img.offsetTop;
        let left_value = x + (img_width/2) - (modal_width/2) - window.scrollX;
        let top_value = y - 10 - scroll_container.scrollTop - window.scrollY;
        //console.log("x: " + x + " y: " + y + "w-scrolly: " + window.scrollY + "sc-scroll: " + secondary_content_container.scrollTop);

        console.log("top value: " + top_value + "y: " + y + "scroll container: " + scroll_container.scrollTop);
        
        if (((window.innerHeight/3)*2) >= top_value) //underneath profile pic
        {
          if (left_value <= 50) //too far left
          {
            console.log("1.1");
            return { 
              left: left_value + (modal_width/2) - img_width +  "px",
              top: top_value + "px", 
            };
          }
          else if (window.innerWidth - left_value <= modal_width/2 + 50) //too far right
          {
            console.log("1.2");
            return { 
              left: left_value - (modal_width/2) + "px",
              top: top_value + "px", 
            };
          }
          else
          {
            console.log("1.3");
            return {
              left: left_value + "px",
              top: top_value + "px", 
            };
          }
        }
        else // overtop of profile
        {
          if (left_value <= 50) //too far left
          {
            console.log("2.1");
            return { 
              left: left_value + (modal_width/2) - img_width + "px",
              top: top_value - ((modal_height/2)*3) -20 - img_height + "px", 
            };
          }
          else if (window.innerWidth - left_value <= modal_width/2 + 50) //too far right
          {
            console.log("2.2");
            return { 
              left: left_value - (modal_width/2) + "px",
              top: top_value - ((modal_height/2)*3) -20 - img_height + "px", 
            };
          }
          else
          {
            console.log("2.3");
            return {
              left: left_value + "px",
              top: top_value - ((modal_height/2)*3) -20 - img_height + "px",
            };
          }

        }
    }
}
  

