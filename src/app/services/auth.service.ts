import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

interface LoginPayload {
    email: string;
    password: string;
}

@Injectable({
providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5193/api/auth'

    constructor(private http: HttpClient) {}

    login(data: any): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
      }

    register(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, payload, { responseType: 'text' });
    }

    logout(): void {
        localStorage.removeItem('token'); // or any user-related storage item
    }
}