import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { CoreService } from "../../../core/core-service.service";
import { Profile } from "../../../core/data";
import { FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({

    selector: 'edit-profile-modal',
    templateUrl: './edit-profile-modal.component.html',
    styleUrl: '../profile-page.component.scss'
  })
  export class EditProfileModalComponent {
  
    @Input() profile = new Profile('','','','',0,0);
    @Input() showep: boolean = false; //used to be false
    @Output() showepChange = new EventEmitter<boolean>();
   
    service_acc_name: string = "";

    submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted

    editProfileForm: any;

    //profile_pic_url: string;// = '';
    //header_pic_url: string;// = '';
    
    constructor(public service: CoreService,private formBuilder: FormBuilder,private http: HttpClient){
      this.service_acc_name = localStorage.getItem('acc_name') ?? "badToken";

      this.editProfileForm = this.formBuilder.group({
        bio: [this.profile.bio, [Validators.maxLength(99)]],
        profile_pic: [],
        header_pic: [],
        });
        
        this.onChanges();
       // let file;// = document.getElementById('profile-img-upload')?.files;
        
    }

    //temporarily (only for when inside modal) changes picture
    onChanges(): void {
      this.editProfileForm.get('profile_pic')?.valueChanges.subscribe((val: any) => {
        console.log("change in value: " + val);
        
        if(String(val) != "" )
        {
          const file = (<HTMLInputElement>document.getElementById("profile-img-upload"))!.files;//.files![0]

          if (file != null)
          {
            console.log("value: " + URL.createObjectURL(file[0]));
            //this.profile.pic = URL.createObjectURL(file[0]);
            let pp_img = (<HTMLInputElement>document.getElementById("edit-profile-p-image"))!;
            pp_img.src = URL.createObjectURL(file[0]);
            
          }
        }
        else
        {
          //doesn't do anything (cuz value doesn't change)
          let pp_img = (<HTMLInputElement>document.getElementById("edit-profile-p-image"))!;
          pp_img.src = this.service.setUrl(this.profile.pic)  
          //this.profile.pic = this.service.setUrl(this.profile.pic);
        }
        
      });
      this.editProfileForm.get('header_pic')?.valueChanges.subscribe((val: any) => {
        console.log("change in value: " + val);
        
        if(String(val) != "" )
        {
          const file = (<HTMLInputElement>document.getElementById("header-img-upload"))!.files;//.files![0]

          if (file != null)
          {
            console.log("value: " + URL.createObjectURL(file[0]));
            //this.profile.pic = URL.createObjectURL(file[0]);
            let hp_img = (<HTMLInputElement>document.getElementById("edit-profile-bg-image"))!;
            hp_img.src = URL.createObjectURL(file[0]);
            
          }
        }
        else
        {
          
        }
        
      });
    }

/* //DOESNT WORK
    ngOnChanges(changes: SimpleChanges){
  
      if (changes['profile']) {
        console.log("**ngOnChanges**");
        let pp_img = (<HTMLInputElement>document.getElementById("edit-profile-p-image"))!;
            //if(file[0] != null){
            pp_img.src = this.service.setUrl(this.profile.pic);
      }
  }
  */
    
  


    hideModal()
      {
       this.showep = false;
       this.showepChange.emit(this.showep);
      }

      onSubmit(){

        if(this.editProfileForm.valid)
          {
            //enter logic here
            if(this.editProfileForm.bio != this.profile.bio)
            {
                //call database
                this.updateBioDB();
            }

            console.log("submitted");
          }
        else
          {
            console.log("not submitted");
            this.submit_flag = 1;
          }
      }
    
      updateBioDB()
      { 
            /*
          let requestBody =
          {
            'word': 'updateProfile',
            'word2': this.profile.acc_name, //acc_name
            'word3': this.editProfileForm.bio, // new bio
          };
          */
          let requestBody =
          {
            "username" : 'updateProfile',
            "email" : 'e',
            "acc_name" : this.profile.acc_name,
            "password" : this.editProfileForm.value.bio,
            "pic" : "p", //new 
            "header_pic" : "p",
            "bio" : "b",
            "follower_count" : 0,
            "following_count" : 0,
          };

            this.http.put("http://127.0.0.1:8000/user",requestBody).subscribe((resultData: any)=>
            {
                console.log(resultData);
              if(resultData == 'Failed to Add')
                {
                  console.log('Unsuccessful data base retrieval');
                }
                else //Successful
                {
                  console.log('Successful data base retrieval');
                }
            });
      }

      handleClick(option: string)
      {
        if(option == 'profile')
        {

            console.log('profile pic clicked in edit profile modal');
        }
        else // header
        {
            console.log('header pic clicked in edit profile modal');
        }
      }

  }
    