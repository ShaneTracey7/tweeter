import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { getImgUrl } from '../../../core/data';

@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {

  constructor(public router: Router ) {}

  setUrl(str: string)
{
  return getImgUrl(str);
}

  handleSearchClick()
  {
    this.router.navigate(['tweeter/Explore']);
    console.log("search clicked");
  }
}
