import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { HomePageComponent } from '../../../features/home-page/home-page.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { Profile, getImgUrl} from '../../../core/data';
import { SecondaryContentComponent } from '../secondary-content/secondary-content.component';
import { CoreService } from '../../../core/core-service.service';
import { MainContentComponent } from '../main-content/main-content.component';
import { TweetService } from '../../../core/tweet-service';
import { AuthService } from '../../../core/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfilePageComponent } from '../../../features/profile-page/profile-page.component';
import { HttpClient } from '@angular/common/http';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { MessagePageComponent } from '../../../features/message-page/message-page.component';
import { FormBuilder } from '@angular/forms';
@Component({

  selector: 'short-profile',
  templateUrl: './short-profile.component.html',
})
export class ShortProfileComponent{

  @Input () selectedUser: string = ''; //acc_name of selected user
  @Output() selectedUserChange = new EventEmitter<string>();
  @Input () inNewMessage: boolean = false; //show search bar modal
  @Input () mshow: boolean = false; //show search bar modal
  @Output() mshowChange = new EventEmitter<boolean>();
  @Input () inSearch: boolean = false; //in search bar modal
  @Input() ppg = new ProfilePageComponent(this.router,this.http,this.authService,this.route,this.service,this.tweetService)
  @Input() profile = new Profile('','','','','',0,0);
  @Input() page: string = ""; //what current_page is being displayed
  
  show_modal: boolean = false;
  modal_profile = this.profile;
  timer:any;
  service_acc_name: string = "";

  f_check: string = "Follow";
  isSelected: boolean = false;

  constructor(public service: CoreService, public tweetService: TweetService, public authService: AuthService, public route: ActivatedRoute,public http: HttpClient, public router: Router){
    this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
    this.setInfo();
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

  //checks if logged in user is following the user in the short profile
  setFCheck()
  {
    console.log("inside f_check this.profile.acc_name: " + this.profile.acc_name)
    if(this.service.isFollower(this.profile.acc_name)){
      this.f_check = "Following";
      if(this.inNewMessage)
      {
        document.getElementById("shortProfile")!.style.height = "80px";
      }
    }
    else
    {
      this.f_check = "Follow";
    }
  }

  goToProfile(timer:any)
  {
    this.mshowChange.emit(false); //hide search bar modal
    
    if(this.inNewMessage)
    {
      //do nothing
      return;
    }
    else if(this.inSearch) //if inside of search bar modal
    {
      this.handleGoTo();
    }
    else
    {
    this.service.router.navigate(['/tweeter/Profile/' + this.profile.acc_name]);
    this.service.setCurrentPage('OtherProfile');
    this.service.routeToChild('posts'); //NEW
    clearTimeout(timer);
    }
  }

  //shows profile modal if there aren't any modals already open
  showModal()
  {
    if(this.inNewMessage)
    {
      //do nothing
      return;
    }

    let obj = this;
    
    if(obj.show_modal || obj.service.openmodal)
    {
      console.log("show: " + obj.show_modal + " openModal: " + obj.service.openmodal);
    }
    else
    {
      obj.timer = setTimeout(function(){

        obj.show_modal = true;
        obj.service.changeOpenModal(true);
      },1000);//delay for how long to be hovering over profile pic to show modal
    }
  }

  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideModal()
  {
    if(this.inNewMessage)
    {
      return; //do nothing
    }
    clearTimeout(this.timer);
  }

  handleGoTo()
  {
    if(this.service.current_page == "Profile" || this.service.current_page == "OtherProfile")
    {
    //this is a work in progress
    this.ppg.goToSearchProfile(this.profile.acc_name);
    }
    else
    {
      if(this.service_acc_name == this.profile.acc_name)
        {
          let route = "/tweeter/Profile";
          this.service.setCurrentPage('Profile');
          this.service.router.navigate([route]);
        }
        else
        {
          let route = "/tweeter/Profile/" + this.profile.acc_name;
          this.service.setCurrentPage('OtherProfile');
          this.service.router.navigate([route]);
        }
    }
  }

  handleSelected()
  {
    if(this.inNewMessage)
    {
      if(this.selectedUser != '')
      {
        if(this.isSelected)
        {
          this.isSelected = false;
          this.selectedUser = '';
          this.selectedUserChange.emit(this.selectedUser);
        }
      }
      else
      {
        this.isSelected = true;
        this.selectedUser = this.profile.acc_name;
        this.selectedUserChange.emit(this.selectedUser);
      }
    }
  }
} 
