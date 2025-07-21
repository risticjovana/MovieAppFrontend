import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private baseUrl = 'http://localhost:5193/api/collections';

  constructor(private http: HttpClient) {}
 
  addContentToCollection(contentId: number, collectionId: number, userId: number): Observable<boolean> {
      const url = `${this.baseUrl}/${collectionId}/add-content/${contentId}?userId=${userId}`;
      return this.http.post<boolean>(url, {});
  }

  getUserCollections(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/personal/user/${userId}`);
  }

  getCollectionContents(collectionId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${collectionId}/contents`;
    return this.http.get<any[]>(url);
  }

  getCollectionInfo(collectionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${collectionId}`);
  }

  createPersonalCollection(
    name: string,
    description: string,
    userId: number
  ): Observable<any> {
    const url = `${this.baseUrl}/create-personal`;
    const body = { name, description, userId };
    return this.http.post<any>(url, body);
  }

  getAvailableContentNotInCollection(collectionId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${collectionId}/available-content`;
    return this.http.get<any[]>(url);
  }


}
