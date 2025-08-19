import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Profile } from '../../../core/data';
import { CoreService } from '../../../core/core-service.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({

  selector: 'profile-modal',
  templateUrl: './profile-modal.component.html',
})
export class ProfileModalComponent{

  @Input() profile = new Profile('','','','','',0,0);
  @Input() show: boolean = false;
  @Input() inMain: boolean = false;
  @Input() inFeed: boolean = false;
  @Output() showChange = new EventEmitter<boolean>();

  original_x: number = 0;
  original_y: number = 0;
  original_m_height: number = 0;
  f_check: string = "Follow";
  modalStyle: any = {};

  service_acc_name: string = "";
  
  constructor(public formBuilder: FormBuilder,public service: CoreService, public route: ActivatedRoute){
    
    this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
  }

  ngOnInit()
  {
    this.setFCheck();
  }

  //sets the follow/following button (currently not functionality for the buttton)
  setFCheck()
  {
    if(this.service.isFollower(this.profile.acc_name)){
      this.f_check = "Following";
    }
    else
    {
      this.f_check = "Follow";
    }
  }

  hideModal()
    {
     this.show = false;
     this.showChange.emit(this.show);
     this.service.changeOpenModal(false);
    }

    //directs user to follow lists of user profile
    handleFollowClick(str: string)
    {
      //condition necessary, because it would be a mess otherwise
      if(this.service.current_page != "Profile" && this.service.current_page != "OtherProfile" && this.service.current_page != 'ProfileFollow')
      {
        var r: string = 'Profile/';
        if(this.profile.acc_name == this.service_acc_name)
        {
          r = r + str;
        }
        else
        {
          r = r + this.profile.acc_name + '/' + str;
        }
        this.service.router.navigate(['tweeter/' + r]);
      }
    }

  //sets postion of modal if not in a feed  
  setModalPosition() {
        
        if(this.inFeed)
        {
          return; //default will be modal below post
        }

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
        let modal_height = 0;
        var img_width = 40;
        let img_height = 40;
        let x = 0;
        let y = 0;
          if (this.original_x == 0)
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

        let left_value = x + (img_width/2) - (modal_width/2) - window.scrollX;
        let top_value = y - 10 - scroll_container.scrollTop - window.scrollY;
      
        if (((window.innerHeight/3)*2) >= top_value) //underneath profile pic
        {
          if (left_value <= 50) //too far left
          {
            return { 
              left: left_value + (modal_width/2) - img_width +  "px",
              top: top_value + "px", 
            };
          }
          else if (window.innerWidth - left_value <= modal_width/2 + 50) //too far right
          {
            return { 
              left: left_value - (modal_width/2) + "px",
              top: top_value + "px", 
            };
          }
          else
          {
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
            return { 
              left: left_value + (modal_width/2) - img_width + "px",
              top: top_value - ((modal_height/2)*3) -20 - img_height + "px", 
            };
          }
          else if (window.innerWidth - left_value <= modal_width/2 + 50) //too far right
          {
            return { 
              left: left_value - (modal_width/2) + "px",
              top: top_value - ((modal_height/2)*3) -20 - img_height + "px", 
            };
          }
          else
          {
            return {
              left: left_value + "px",
              top: top_value - ((modal_height/2)*3) -20 - img_height + "px",
            };
          }
        }
    }

    //goes to user profile upon click
    handleUsernameClick()
    {
      //condition necessary, because it would be a mess otherwise
      if(this.service.current_page != "Profile" && this.service.current_page != "OtherProfile" && this.service.current_page != 'ProfileFollow')
      {
        var r: string = 'Profile';
        if(this.profile.acc_name == this.service_acc_name)
        {
          //do nothing
        }
        else
        {
          r = r + '/' + this.profile.acc_name;
          this.service.openmodal = false;
          this.service.router.navigate(['tweeter/' + r]);

        }
      }
    }
}
  

