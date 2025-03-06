import { Component } from '@angular/core';
import { NavBarComponent } from './common/nav-bar/nav-bar.component';


@Component({
  selector: 'app-root',
  imports: [NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Client App';
}
