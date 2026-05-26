import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard/admin-dashboard.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { SigninFormComponent } from './shared/components/auth/signin-form/signin-form.component';
import { UserComplaintsComponent } from './shared/components/user-complaints/user-complaints.component';
import { SubAdminDasboardComponent } from './shared/components/sub-admin/sub-admin-dasboard/sub-admin-dasboard.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';

export const routes: Routes = [

  // = ADMIN ROUTES =
  {
    path: 'admin',
    component: AppLayoutComponent,
    canActivate: [authGuard],

    children: [

      {
        path: '',
        component: AdminDashboardComponent,
      },

      {
        path: 'addComplaint',
        component: UserComplaintsComponent,
      },

    ]
  },

  // = SUB ADMIN ROUTES =
  {
    path: 'sub-admin',
    component: AppLayoutComponent,
    canActivate: [authGuard],

    children: [

      {
        path: '',
        component: SubAdminDasboardComponent,
      },

    ]
  },

  // = AUTH =
  {
    path: 'signin',
    component: SigninFormComponent,
  },

  // = DEFAULT =
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full'
  },

  // = WILDCARD =
  {
    path: '**',
    // redirectTo: 'signin'
    component: NotFoundComponent
  },

];