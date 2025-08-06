import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Profile } from '../../../core/data';
import { CoreService } from '../../../core/core-service.service';
import { AuthService } from '../../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({

  selector: 'main-content',
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {

  @Input() query: string = ''; //needed for explore page
  @Input() upc: any = ''; //universal page component

  //testing
  @Input() data: any [] = []; //what tab is being displayed
  @Input() user: Profile = new Profile('','','','','',0,0);

  @Input() tab: string = ""; //what tab is being displayed
  @Input() page: string = ""; //what current_page is being displayed

  @Input () c_c: boolean = false;

  constructor(public service: CoreService, public authService: AuthService, public route: ActivatedRoute)
  { }

  ngOnChanges(changes: SimpleChanges)
  {
    console.log("tab:" + this.tab)
    console.log("page:" + this.page)
  }

  mcc = this;
  
}
