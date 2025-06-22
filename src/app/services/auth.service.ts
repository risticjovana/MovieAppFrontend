import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

interface LoginPayload {
    email: string;
    password: string;
}

interface ChangePasswordModel {
    userId: number;
    currentPassword: string;
    newPassword: string;
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
        localStorage.removeItem('token'); 
    }

    getUserById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/user/${id}`);
    }

    changePassword(payload: ChangePasswordModel): Observable<string> {
        return this.http.post(`${this.apiUrl}/change-password`, payload, { responseType: 'text' });
    }

    requestRoleChange(payload: { userId: number; requestedRole: string }): Observable<string> {
        return this.http.post(`${this.apiUrl}/request-role`, payload, { responseType: 'text' });
    }
}