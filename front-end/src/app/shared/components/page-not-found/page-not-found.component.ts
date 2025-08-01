import { Component } from '@angular/core';
import { Router} from '@angular/router';


@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {

  constructor(public router: Router ) {}

  //navigates user to search/explore page
  handleSearchClick()
  {
    this.router.navigate(['tweeter/Explore']);
    console.log("search clicked");
  }
}
