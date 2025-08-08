import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GeneralComponent } from './pages/settings/general/general.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    {
        path: 'settings',
        children: [
            { path: 'general', component: GeneralComponent}
        ]
    },
    { path: 'signin', component: SigninComponent },
];
