import { Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { HomePageComponent } from '../../../features/home-page/home-page.component';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { Profile, getImgUrl} from '../../../core/data';
import { SecondaryContentComponent } from '../secondary-content/secondary-content.component';
import { CoreService } from '../../../core/core-service.service';
import { MainContentComponent } from '../main-content/main-content.component';
import { TweetService } from '../../../core/tweet-service';
@Component({

  selector: 'short-profile',
  templateUrl: './short-profile.component.html',
})
export class ShortProfileComponent{

  @Input() profile = new Profile('','','','',0,0);
  //@Output() openmodalChangeS = new EventEmitter<boolean>();
  //@Output() openmodalChangeM = new EventEmitter<boolean>();
  @Input() scc:SecondaryContentComponent = new SecondaryContentComponent(this.service);
  //@Input() mcc:MainContentComponent = new MainContentComponent(this.tweetService);
  show_modal: boolean = false;
  modal_profile = this.profile;
  timer:any;

  f_check: string = "Follow";

  constructor(public service: CoreService/*, public tweetService: TweetService*/){
    //changed from public
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
    }
    else
    {
      this.f_check = "Follow";
    }
  }

  goToProfile(timer:any)
  {
    this.service.router.navigate(['/tweeter/Profile/' + this.profile.acc_name]);
    this.service.setCurrentPage('OtherProfile');
    this.service.routeToChild('posts'); //NEW
    clearTimeout(timer);
  }

  //shows modal if mouse is over profile pic for long enough
  showModal(profile: Profile, obj:ShortProfileComponent)
  {
    obj.timer = setTimeout( function(){
      //insert logic here
      if(obj.show_modal || obj.scc.openmodal /*|| obj.mcc.openmodal*/)
        {
          console.log("show: " + obj.show_modal + " openModalS: " + obj.scc.openmodal /*+ " openModalM: " + obj.mcc.openmodal*/);
        }
        else
        {
          //obj.modal_profile = obj.profile;
          obj.show_modal = true;
          obj.scc.changeOpenModal(true);
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
}
