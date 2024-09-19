import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import { ShortProfileComponent } from '../short-profile/short-profile.component';
import { Profile } from '../../../core/data';
import { SecondaryContentComponent } from '../secondary-content/secondary-content.component';
import { NavigationBarComponent } from './navigation-bar.component';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CoreService } from '../../../core/core-service.service';

@Component({

  selector: 'logout-modal',
  templateUrl: './logout-modal.component.html',
})
export class LogoutModalComponent extends NavigationBarComponent{

  @Input() override show: boolean = false; //used to be false
  //@Input() acc_name: string = ""; //used to be false
  @Output() showChange = new EventEmitter<boolean>();

  //original_x: number = 0;
  //original_y: number = 0;
  //original_m_height: number = 0;
  

/*
    logout() {  
        /*
        console.log('logout');  
        this.authService.logout();  
        this.router.navigate(['/Login']);  
        
      }
*/
  hideModal()
    {
     this.show = false;
     this.showChange.emit(this.show);
    }

  setModalPosition() {
        
        
        let main_content_container = <HTMLElement>document.getElementById("navbar");
        let scroll_container = main_content_container

        let modal = <HTMLElement>document.getElementById("logout-modal");
        let img = <HTMLElement>document.getElementById("profile-nav"); //show button
        let modal_width = modal.offsetWidth
        if(modal_width < 200)
        {
            modal_width = 200;
        }
        //let modal_height = 75;
        let img_width = img.offsetWidth
        let img_height = img.offsetHeight
        //let x = 0;
        //let y = 0;
        let x = img.getBoundingClientRect().left;//img.offsetLeft;
        let y = img.getBoundingClientRect().top;//img.offsetTop;
        let modal_height = modal.offsetHeight;;
          /*if (this.original_x == 0)
            {
              x = img.getBoundingClientRect().left;//img.offsetLeft;
              y = img.getBoundingClientRect().top;//img.offsetTop;
              this.original_x = x;
              this.original_y = y;
            }
          else
            {
              x = this.original_x;//img.offsetLeft;
              y = this.original_y;//img.offsetTop;
            }
          if (this.original_m_height == 0)
            {
              modal_height = modal.offsetHeight;
              this.original_m_height = modal_height
            }
          else
            {
              modal_height = this.original_m_height 
            }
            */
        console.log('x = ' + x + " y = " + y + " img_width: " + img_width);
        let left_value = x + (img_width/2) - (modal_width/2) - window.scrollX;
        let top_value = y - 10 - scroll_container.scrollTop - window.scrollY;
        //console.log("x: " + x + " y: " + y + "w-scrolly: " + window.scrollY + "sc-scroll: " + secondary_content_container.scrollTop);

        //console.log("top value: " + top_value + "y: " + y + "scroll container: " + scroll_container.scrollTop + "modal height: " +modal_height);
        console.log("top value: " + top_value + "left_value: " + left_value + "window.scrollX: " + window.scrollX);
        
          if (left_value <= 50) //too far left
          {
            console.log("1.1");
            return { 
              left: left_value + (modal_width/2) - (img_width/2) + "px",
              top: top_value - ((modal_height/2)*3) -20 - img_height + "px", 
            };
          }
          else //i dont think i even need this case
          {
            console.log("1.2");
            return {
              left: left_value + "px",
              top: top_value - ((modal_height/2)*3) -20 - img_height + "px",
            };
          }

        
    }    
}