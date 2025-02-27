import { Routes } from '@angular/router';
import { StudentViewComponent } from './features/student-view/student-view.component';


export const routes: Routes = [
    {
        path: "",
        redirectTo: "Home",
        pathMatch: "full"
    },
    {
        path: "Home",
        component: StudentViewComponent
    },
];
