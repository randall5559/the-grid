import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, UnsupportedGuard } from './shared/guards';
import { environment } from '../environments/environment';
import { ErrorsComponent } from './shared/components/errors';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserProfilerResolver } from './shared/resolvers/userProfile.resolver';
import { DataService, ActionsService } from './services/';


const routes: Routes = [
  {
    path: 'view',
    loadChildren: './editor-agency/editor-agency.module#EditorAgencyModule',
    // canActivate: ['AuthGuard', 'UnsupportedGuard'],
    // resolve: {
    //   userProfile: UserProfilerResolver
    // }
  },
  // {
  //   path: '',
  //   redirectTo: 'edit',
  //   pathMatch: 'full'
  // },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    //canActivate: ['AuthGuard']
  },
  {
   path: '',
   component: WelcomeComponent,
  //  canActivate: ['AuthGuard'],
  //  resolve: {
  //    userProfile: UserProfilerResolver
  //  }
  },

  {
    path: 'errors/:errId',
    component: ErrorsComponent,
    // resolve: {
    //   userProfile: UserProfilerResolver
    // }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  // providers: [
  //   {
  //     provide: 'AuthGuard',
  //     useFactory: AuthGuardFactory,
  //   },
  //   {
  //     provide: 'UnsupportedGuard',
  //     useFactory: UnsupportedGuardFactory,
  //   },
  //   UserProfilerResolver,
  //   ActionsService,
  //   DataService
  // ]
})
export class AppRoutingModule { }

// export function AuthGuardFactory() {
//   return new AuthGuard(environment.tokenKey);
// }

// export function UnsupportedGuardFactory() {
//   return new UnsupportedGuard();
// }
