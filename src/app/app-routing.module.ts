import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { TicketReservationComponent } from './ticket-reservation/ticket-reservation.component';
import { MovieProjectionsComponent } from './movie-projections/movie-projections.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'ticket-reservation', component: TicketReservationComponent },
  { path: 'movies/:contentId/projections', component: MovieProjectionsComponent },
  { path: '**', redirectTo: 'login' }, // move this to the end
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
