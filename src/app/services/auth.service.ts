import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserActivity } from "../model/user-activity";

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

    getAllRoleRequests(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/role-requests`);
    }

    verifyRoleRequest(id: number): Observable<string> {
        return this.http.post(`${this.apiUrl}/verify-role/${id}`, {}, { responseType: 'text' });
    }

    declineRoleRequest(id: number): Observable<string> {
        return this.http.post(`${this.apiUrl}/decline-role/${id}`, {}, { responseType: 'text' });
    }

    getAllUsersExcept(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all-except/${id}`);
    }

    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all-users`);
    }

    followUser(followerId: number, followeeId: number): Observable<string> {
        return this.http.post(`${this.apiUrl}/follow`, { FollowerId: followerId, FolloweeId: followeeId }, { responseType: 'text' });
    }
    
    getFollowers(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/followers/${userId}`);
    }

    blockUser(userId: number): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/block-user/${userId}`, {});
    }

    getUserActivity(userId: number): Observable<UserActivity> {
        return this.http.get<UserActivity>(`${this.apiUrl}/user-activity/${userId}`);
    }
}