import { Component, EventEmitter, Input, Output} from "@angular/core";
import { CoreService } from "../../../core/core-service.service";
import { Profile } from "../../../core/data";
import { FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Component({

    selector: 'edit-profile-modal',
    templateUrl: './edit-profile-modal.component.html',
    styleUrl: '../profile-page.component.scss'
  })
  export class EditProfileModalComponent {
  
    @Input() profile = new Profile('','','','','',0,0);
    @Input() showep: boolean = false; //used to be false
    @Output() showepChange = new EventEmitter<boolean>();
   
    service_acc_name: string = "";
    submit_flag: number  = 0; // 0: not pressed, 1: pressed but not submitted, 2: pressed and submitted
    editProfileForm: any;
    updateBioFlag: boolean;
    up: any; //makes const updateProfile global
    image_type: string = '';
    image_tweet_id: string = ''; // a number in of data type string(has to be string to pass into fromData)
  
    constructor(public service: CoreService,private formBuilder: FormBuilder,private http: HttpClient)
    {
      this.service_acc_name = sessionStorage.getItem('acc_name') ?? "badToken";
      this.updateBioFlag = false;

      this.editProfileForm = this.formBuilder.group({
        bio: ['', [Validators.maxLength(99)]],
        profile_pic: [],
        header_pic: [],
        });

        const imageEndpoint = environment.apiUrl + '/image'; //might need to change this
        this.onChanges();
       // let file;// = document.getElementById('profile-img-upload')?.files;
       //const profileInput = document.querySelector('#profile-img-upload');

       const updateProfile = async() => {
         let profile_pic_input = (<HTMLInputElement>document.getElementById("profile-img-upload"))!.files;//.files![0]
         let header_pic_input = (<HTMLInputElement>document.getElementById("header-img-upload"))!.files;//.files![0]
           //console.log("p: " + profile_pic_input?.item(0));
           //console.log("h: " + header_pic_input?.item(0));

            //if both profile and header pic are selected
           if( profile_pic_input != null && profile_pic_input?.item(0) && header_pic_input != null && header_pic_input?.item(0))
            {
              let image = profile_pic_input[0];
              let image2 = header_pic_input[0];
              let formData = new FormData();
 
              formData.append('image_file',image);
              //console.log("image: " + image);
              formData.append('image_file2',image2);
              //console.log("image2: " + image2);
              //console.log("type: " + this.image_type);
              formData.append('type',this.image_type);
              //console.log("acc_name: " + this.service_acc_name);
              formData.append('acc_name',this.service_acc_name);
              //console.log("tweet_id: " + this.image_tweet_id);
              formData.append('tweet_id',this.image_tweet_id); //string form of number
 
              //optional
              if(this.updateBioFlag)
              {
               formData.append('bio',this.editProfileForm.value.bio);
               //console.log("bio: " + this.editProfileForm.value.bio);
              }
 
              let newImage = fetch(imageEndpoint,{
               method: 'POST',
               body: formData
               
              }).then(response => response.json())
              .then(data => {
                console.log(JSON.stringify(data));
                //add in logic
                sessionStorage.setItem('pic', data[0].image_url); //needed for profile in navbar 

              })
              .catch(error => {console.error(error)})
            }
            //just profile pic
         else if( profile_pic_input != null && profile_pic_input?.item(0) != null)
           {
             let image = profile_pic_input[0];
             let formData = new FormData();

             formData.append('image_file',image);
             //console.log("image: " + image);
             //console.log("type: " + this.image_type);
             formData.append('type',this.image_type);
             //console.log("acc_name: " + this.service_acc_name);
             formData.append('acc_name',this.service_acc_name);
             //console.log("tweet_id: " + this.image_tweet_id);
             formData.append('tweet_id',this.image_tweet_id); //string form of number

             //optional
             if(this.updateBioFlag)
             {
              formData.append('bio',this.editProfileForm.value.bio);
              //console.log("bio: " + this.editProfileForm.value.bio);
             }

             let newImage = fetch(imageEndpoint,{
              method: 'POST',
              body: formData
              
             }).then(response => response.json())
              .then(data => {
                console.log(JSON.stringify(data));
                //add in logic 
                sessionStorage.setItem('pic', data.image_url); //needed for profile in navbar
              })
              .catch(error => console.error(error));

           }
           //just header pic
       else if(header_pic_input != null && header_pic_input?.item(0) != null)
           {
            let image = header_pic_input[0];
            let formData = new FormData();

            formData.append('image_file',image);
            //console.log("image: " + image);
            //console.log("type: " + this.image_type);
            formData.append('type',this.image_type);
            //console.log("acc_name: " + this.service_acc_name);
            formData.append('acc_name',this.service_acc_name);
            //console.log("tweet_id: " + this.image_tweet_id);
            formData.append('tweet_id',this.image_tweet_id); //string form of number

            //optional
            if(this.updateBioFlag)
              {
               formData.append('bio',this.editProfileForm.value.bio);
               //console.log("bio: " + this.editProfileForm.value.bio);
              }

             let newImage = fetch(imageEndpoint,{
             method: 'POST',
             body: formData
             
            })
          }
           else // just bio updating
           {
            let formData = new FormData();

            //console.log("acc_name: " + this.service_acc_name);
            formData.append('acc_name',this.service_acc_name);
            formData.append('type',this.image_type);
            //console.log("type: " + this.image_type);
            formData.append('bio',this.editProfileForm.value.bio);
            //console.log("bio: " + this.editProfileForm.value.bio);

            let newImage = fetch(imageEndpoint,{
              method: 'POST',
              body: formData
              
             })
           }
        }

        this.up = updateProfile;
        this.updateBioFlag = false;
    }

   //run upon 'save' button click
   onSubmit()
   {
        // form is valid and at least one field is not empty
        if(this.editProfileForm.valid && (!(this.editProfileForm.value.bio == "" || this.editProfileForm.value.bio == null) || this.editProfileForm.value.profile_pic != null || this.editProfileForm.value.header_pic != null))
        {
            this.submit_flag = 2;
            console.log('valid submission');
            //enter logic here

              //check if bio changed
            if(this.editProfileForm.value.bio != this.profile.bio && this.editProfileForm.value.bio != "")
              {
                console.log('bio flag true');
                  this.updateBioFlag = true;
              }
            else
              {
                console.log('bio flag false');
                this.updateBioFlag = false;
              }
            //check if profile or header pic has changed
          if (this.editProfileForm.value.profile_pic == null)
          {
            console.log('profile null')
            
            if(this.editProfileForm.value.header_pic != null) // just header
            {
              console.log('header not null')
              this.image_type = this.updateBioFlag ? 'header bio' : 'header';
              this.image_tweet_id = '0';
              this.up();
              return;
            }
            else // just bio
            {
              console.log('both null')
              this.image_type = 'bio';
              this.up();
              return;
            }
          }
          else //profile pic is not null
          {
            if(this.editProfileForm.value.header_pic != null) //both
              {
                //need to figure out how to change 2 images
                console.log('both')
                this.image_type = this.updateBioFlag ? 'both bio' : 'both';
                this.image_tweet_id = '0';
                this.up();
                return;
              }
              else // just profile
              {
                console.log('header null')
                this.image_type = this.updateBioFlag ? 'profile bio' : 'profile';
                this.image_tweet_id = '0';
                this.up();
                return;
              }
          }
        }
        else
        {
          this.submit_flag = 1
          console.log('invalid submission')
        }
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
           // console.log("value: " + URL.createObjectURL(file[0]));
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
            //console.log("value: " + URL.createObjectURL(file[0]));
            //this.profile.pic = URL.createObjectURL(file[0]);
            let hp_img = (<HTMLInputElement>document.getElementById("edit-profile-bg-image"))!;
            hp_img.src = URL.createObjectURL(file[0]);
          }
        }
        else
        {
          //do nothing
        }
      });
    }

    //hides modal when 'x' button is clicked
    hideModal()
      {
       this.submit_flag = 0;
       this.editProfileForm.reset();
       this.updateBioFlag = false;
       this.showep = false;
       this.showepChange.emit(this.showep);
       this.service.openmodal = false; //adjust global account for modals
      }


      /*
      //idk if this is in use
      onSubmit2(){

        if(this.editProfileForm.valid && this.editProfileForm.bio == "")
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
      }*/

    //updates bio, called upon valid form submission
      updateBioDB()
      { 
          let requestBody =
          {
            "username" : 'updateProfile',
            "email" : 'e',
            "acc_name" : this.profile.acc_name,
            "password" : this.editProfileForm.value.bio,
            "pic" : null, //new 
            "header_pic" : null,
            "bio" : "b",
            "follower_count" : 0,
            "following_count" : 0,
          };

            this.http.put(environment.apiUrl +"/user",requestBody).subscribe((resultData: any)=>
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

      //just logs header or profile click because file input (that gets triggered at the same time, doesn't)
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
    