import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule, KENDO_GRID } from '@progress/kendo-angular-grid';
import { DrawerItem, DrawerSelectEvent, LayoutModule } from '@progress/kendo-angular-layout';
import {  menuIcon, SVGIcon, userIcon ,gridIcon} from '@progress/kendo-svg-icons';

interface CustomDrawerItem extends DrawerItem {
  route?: string;
}
@Component({
  selector: 'app-nav-bar',
  imports: [FormsModule, KENDO_GRID, GridModule, CommonModule, LayoutModule, FormsModule, KENDO_GRID, GridModule, CommonModule, LayoutModule, ButtonsModule,RouterOutlet],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  @ViewChild('drawer') drawer: any;
  isExpanded = true;


  // toggle() {
  //   this.isExpanded = !this.isExpanded;
  // }

  constructor(private router: Router) {}
    public selected = "Inbox";
    public menuSvg: SVGIcon = menuIcon;
    public onSelect(event: DrawerSelectEvent): void {
      this.router.navigate([event.item.route]); 
    }
  
    public items: Array<CustomDrawerItem> = [
      { text: "Students", svgIcon: userIcon, selected: true , route:'/Home'},
      { text: "Courses", svgIcon:gridIcon , selected: true , route:'/course'},
    ];
}
