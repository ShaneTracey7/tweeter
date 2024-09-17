import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { CoreComponent } from '../../core/core.component';
import { CoreService } from '../../core/core-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service'; 

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss'
})
export class ExplorePageComponent extends CoreComponent {
  
}
