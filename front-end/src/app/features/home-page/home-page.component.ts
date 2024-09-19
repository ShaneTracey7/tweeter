import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { AuthService } from '../../core/auth.service'; 
import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  //encapsulation: ViewEncapsulation.None
/* HOPING the scope of this is just within home-page module, but it could be global */
})
export class HomePageComponent extends CoreComponent{
  
constructor(router: Router, authService: AuthService, route: ActivatedRoute, service: CoreService,private http: HttpClient)
{
  super(router,authService,route,service);
}

  reaction: string = "";

  //called upon successful submit of create account form
  addPost()
  {
    //get id value for user using acc_name
    let text_input = (<HTMLInputElement>document.getElementById("e-post-input")).value;

    if (text_input != "")
    {  
      let postData = {
      "user": 20, //fake value
      "date_created": new Date(),
      "text_content": text_input,
      "image_content": 'url',
      "likes": 0,
      "comments": 0,
      "retweets": 0,
      "engagements": 0,
      };
      this.http.post("http://127.0.0.1:8000/tweet",postData).subscribe((resultData: any)=>
      {
          console.log(resultData);
      });
    }
  }
/*
  id: string;  
  constructor(private router: Router, private authService: AuthService, public override route: ActivatedRoute, public override service: CoreService) {
    super(route, service);

    this.id = "";
  }  
  ngOnInit() {  
    this.id = localStorage.getItem('token') ?? "badToken";  
    console.log(this.id);  
  } 

  logout() {  
    console.log('logout');  
    this.authService.logout();  
    this.router.navigate(['/Login']);  
  } 
  */

  colorReactionBarIcon(str: string) {

    if (this.reaction == str) {
      return this.service.setUrl(str + "-color.png");
    }
    else{
      return this.service.setUrl(str + ".png");
    }
  }

  

  colorReactionBarText(str:string)
  {
    if (this.reaction == str) {

      if( str == 'heart')
        {
          return {
            color: '#FF4086',
          }
        }
      else if ( str == 'retweet')
        {
          return {
            color: '#17BD69',
          }
        }
      else
        {
          return {
            color: '#1DA1F2',
          }
        }
    }
    else{

      return {
        color: '#808080',
      }
    }
  }

  colorReactionBarBG(str:string)
  {
    if (this.reaction == str) {

      if( str == 'heart')
        {
          return {
            backgroundColor: '#ff40862b',
          }
        }
      else if ( str == 'retweet')
        {
          return {
            backgroundColor: '#17bd6a29',
          }
        }
      else
        {
          return {
            backgroundColor: '#1da0f22f',
          }
        }
    }
    else{

      return {
        backgroundColor: 'transparent',
      }
    }
  }
  //#17BD69 (green)
  //FF4086 (red)
  /*
    setReaction(str: string)
    {
      const tmp = str;
      this.reaction = tmp;
    }
    */
}
