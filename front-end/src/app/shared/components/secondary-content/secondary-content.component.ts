import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { createProfiles, createSecondarySearchTopics} from '../../../core/data';
import { CoreService } from '../../../core/core-service.service';
@Component({
  /*standalone: true,*/
  selector: 'secondary-content',
  templateUrl: './secondary-content.component.html',
})
export class SecondaryContentComponent {

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed
  @Input() pane: number = 0; //what pane is being displayed
  profiles: any [];// = []
  service_acc_name: string;

  constructor(private service: CoreService){
    
    this.profiles = [];//this.service.UserFeed
    this.service_acc_name = "";
    //console.log(this.profiles)
  }

  ngOnInit()
  {
    console.log("page b4 init:" + this.page)
    this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";  
    this.createServiceUserFeed();
    //this.service.createUserFeed(true,this.service_acc_name);
    this.profiles = this.service.UserFeed;

    
  }

  ngOnChanges(changes: SimpleChanges)
  {
    console.log(changes);
    console.log("a change in secondary component");
    console.log("tab:" + this.tab)
    console.log("page:" + this.page)
  }

  // global page data
  //profiles = createProfiles();
  topics = createSecondarySearchTopics();

  //to ensure only one modal is visible at a time
  openmodal: boolean = false;

  scc = this;

  changeOpenModal(newValue: boolean){
    this.openmodal = newValue;
    console.log(this.openmodal);
  }

  
  createServiceUserFeed()
  {
    let globalObj = this;

        const postPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 5000) // 5 secs

          setTimeout(() => {
            globalObj.service.createUserFeed(true,globalObj.service_acc_name);
            resolve('we got a response');
          }, 0) // 0 secs

        })

        const checkPromise = new Promise<any>(function (resolve, reject) {
          setTimeout(() => {
            reject("We didn't get a response")
          }, 8000) // 5 secs

          setTimeout(() => {
            globalObj.profiles = globalObj.service.UserFeed;
            resolve('we got a response');
          }, 1000) // 0 secs

        })

        async function myAsync(){
          //console.log("inside myAsync");
          try{
            postPromise;
            await checkPromise;
          }
          catch (error) {
            console.error('Promise rejected with error: ' + error);
          }
          //console.log("end of myAsync");
        }
        
        myAsync();
  }

}
