import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import { ShortProfileComponent } from '../short-profile/short-profile.component';
import { Profile } from '../../../core/data';
import { SecondaryContentComponent } from '../secondary-content/secondary-content.component';
import { CoreService } from '../../../core/core-service.service';
import { TweetService } from '../../../core/tweet-service';
import { MainContentComponent } from '../main-content/main-content.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({

  selector: 'profile-modal',
  templateUrl: './profile-modal.component.html',
})
export class ProfileModalComponent {

  @Input() profile = new Profile('','','','',0,0);
  @Input() show: boolean = false; //used to be false
  @Input() inMain: boolean = false;
  @Output() showChange = new EventEmitter<boolean>();
  @Input() scc:SecondaryContentComponent = new SecondaryContentComponent(this.service); //needed to check if any open modals
  @Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService,this.service,this.authService,this.route); //NEW

  //modal_profile = this.profile;

  original_x: number = 0;
  original_y: number = 0;
  original_m_height: number = 0;
  f_check: string = "Follow";


  service_acc_name: string = "";
  
  constructor(public service: CoreService, public tweetService: TweetService, public authService: AuthService, public route: ActivatedRoute){
    this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";
    this.setInfo();
    //this.setFCheck();
    console.log("inside profile modal constructor");
    console.log("Profile: " + this.profile);
  }

  ngOnChanges(changes: SimpleChanges){
  
    if (changes['profile']) {
      console.log("**ngOnChanges** PM");
      console.log("PROFILE CV: "+ changes['profile'].currentValue);
      console.log("PROFILE: PV"+ changes['profile'].previousValue);

      //testing
      this.setFCheck();
    }
}


  setInfo()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.setFCheck();
            resolve('we got a response');
          }, 1000) // 1 secs
        })

        async function myAsync(){
          try{
            postPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
        }
        myAsync();
  }

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
     this.scc.changeOpenModal(false);
     this.mcc.changeOpenModal(false);
    }

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

        console.log('x = ' + x + " y = " + y);
        let left_value = x + (img_width/2) - (modal_width/2) - window.scrollX;
        let top_value = y - 10 - scroll_container.scrollTop - window.scrollY;
        //console.log("x: " + x + " y: " + y + "w-scrolly: " + window.scrollY + "sc-scroll: " + secondary_content_container.scrollTop);

        console.log("top value: " + top_value + "y: " + y + "scroll container: " + scroll_container.scrollTop + "modal height: " +modal_height);
        console.log( "((window.innerHeight/3)*2): " + ((window.innerHeight/3)*2) + " top_value: " + top_value)
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
        }
        this.service.router.navigate(['tweeter/' + r]);
      }
    }
}
  

