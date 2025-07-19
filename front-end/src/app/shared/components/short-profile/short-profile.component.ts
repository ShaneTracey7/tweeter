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
  //@Output() openmodalChangeS = new EventEmitter<boolean>();
  //@Output() openmodalChangeM = new EventEmitter<boolean>();
  @Input() upc: any = '';
  @Input() scc:SecondaryContentComponent = new SecondaryContentComponent(this.service);
  @Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService,this.service,this.authService,this.route);
  
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

  setFCheck()
  {
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

  //shows modal if mouse is over profile pic for long enough
  showModal(profile: Profile, obj:ShortProfileComponent)
  {
    if(this.inNewMessage)
    {
      //do nothing
      return;
    }

    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.scc.openmodal || obj.mcc.openmodal)
        {
          console.log("show: " + obj.show_modal + " openModalS: " + obj.scc.openmodal /*+ " openModalM: " + obj.mcc.openmodal*/);
        }
        else
        {
          //obj.modal_profile = obj.profile;
          obj.show_modal = true;
          obj.scc.changeOpenModal(true);
          obj.mcc.changeOpenModal(true);
        }

    }, 1000);

    //timer;
    // cancel it immediately so it will never run
    //clearTimeout(timer);

  }
    //shows modal if mouse is over profile pic for long enough
    showModal2(profile: Profile, obj:ShortProfileComponent)
    {
  
      obj.timer = setTimeout( function(){
        //insert logic here
        if(obj.show_modal || obj.upc.openmodal /*|| obj.mcc.openmodal*/)
          {
            console.log("show: " + obj.show_modal + " openModalS: " + obj.upc.openmodal /*+ " openModalM: " + obj.mcc.openmodal*/);
          }
          else
          {
            //obj.modal_profile = obj.profile;
            obj.show_modal = true;
            obj.upc.changeOpenModal(true);
            //obj.mcc.changeOpenModal(true);
          }
  
      }, 1000);
  
      //timer;
      // cancel it immediately so it will never run
      //clearTimeout(timer);
  
    }
  //prevents modal from appearing if mouse isnt over profile pic long enough
  hideModal(timer:any)
  {
    if(this.inNewMessage)
      {
        //do nothing
        return;
      }
    clearTimeout(timer);
  }

/*
  showModal2(profile: Profile)
    {
      if(this.show_modal || this.scc.openmodal)
        {
          console.log("show: " + this.show_modal + " openModal: " + this.scc.openmodal)
        }
        else
        {
          this.modal_profile = this.profile;
          this.show_modal = true;
          this.scc.changeOpenModal(true);
        }
    }*/

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
