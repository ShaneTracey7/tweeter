import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { getImgUrl } from '../../../core/data';

@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {

  setUrl(str: string)
{
  return getImgUrl(str);
}
}
