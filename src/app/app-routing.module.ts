import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { TicketReservationComponent } from './ticket-reservation/ticket-reservation.component';
import { MovieProjectionsComponent } from './movie-projections/movie-projections.component';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';
import { SeriesInfoComponent } from './series-info/series-info.component';
import { MyCollectionsComponent } from './my-collections/my-collections.component';
import { CollectionContentsComponent } from './collection-contents/collection-contents.component'; 
import { ExploreCollectionsComponent } from './explore-collections/explore-collections.component';
import { OtherUsersComponent } from './other-users/other-users.component';
import { FollowersComponent } from './followers/followers.component';
import { SavedCollectionsComponent } from './saved-collections/saved-collections.component';
import { EditorsCollectionsComponent } from './editors-collections/editors-collections.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'ticket-reservation', component: TicketReservationComponent },
  { path: 'my-reservations', component: MyReservationsComponent },
  { path: 'movies/:contentId/projections', component: MovieProjectionsComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'movie-info/:contentId', component: MovieInfoComponent},
  { path: 'series-info/:contentId', component: SeriesInfoComponent},
  { path: 'my-collections', component: MyCollectionsComponent },
  { path: 'collections/:id/contents', component: CollectionContentsComponent }, 
  { path: 'explore-collections', component: ExploreCollectionsComponent },
  { path: 'other-users', component: OtherUsersComponent },
  { path: 'followers', component: FollowersComponent },
  { path: 'saved-collections', component: SavedCollectionsComponent },
  { path: 'editors-collections', component: EditorsCollectionsComponent},
  { path: 'user-details/:userId', component: UserDetailsComponent},
  { path: '**', redirectTo: 'login' }, // move this to the end
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
