import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TicketReservationComponent } from './ticket-reservation/ticket-reservation.component';
import { MovieProjectionsComponent } from './movie-projections/movie-projections.component';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';
import { OutdoorCinemaComponent } from './outdoor-cinema/outdoor-cinema.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component'; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    SidebarComponent,
    TicketReservationComponent,
    MovieProjectionsComponent,
    MyReservationsComponent,
    OutdoorCinemaComponent,
    UserProfileComponent,
    AdminDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
