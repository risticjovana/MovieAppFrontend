import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CollectionService } from '../services/collection.service'; 
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore-collections',
  templateUrl: './explore-collections.component.html',
  styleUrls: ['./explore-collections.component.css']
})
export class ExploreCollectionsComponent implements OnInit {
  collections: any[] = [];
  loading = false;
  error: string | null = null;
  userId: number | null = null;
  userRole: string | null = null;
  showDeletePopup = false;
  collectionToDelete: any | null = null;

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserIdFromToken();
    if (this.userId !== null) {
      this.loadCollections();
    } else {
      this.error = 'User is not authenticated.';
    }
  }

  private loadUserIdFromToken(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.error = 'Not running in a browser environment.';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'No token found in localStorage.';
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      this.userId = decoded.id || decoded.sub || null;
      this.userRole = decoded.role || null;
    } catch {
      this.error = 'Failed to decode token.';
      this.userId = null;
    }
  }

   private loadCollections(): void {
    this.loading = true;
    this.error = null;

    this.collectionService.getAllCollectionsExceptUser(this.userId!).subscribe({
      next: (collections) => {
        this.collections = collections;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load collections.';
        this.loading = false;
      }
    });
  }

  openCollectionContents(collectionId: number) {
    this.router.navigate(['/collections', collectionId, 'contents']);
  }

  confirmDelete(collectionId: number) {
    this.collectionToDelete = collectionId;
    this.showDeletePopup = true;
  }
 
  cancelDelete() {
    this.collectionToDelete = null;
    this.showDeletePopup = false;
  }

  popupOpen(collectionId: number) {
    this.collectionToDelete = collectionId;
    this.showDeletePopup = true;
  }

  deleteConfirmed() {
    if (this.collectionToDelete === null) return;

    this.collectionService.deleteCollection(this.collectionToDelete).subscribe({ 
      next: () => { 
        this.collections = this.collections.filter(c => c.id !== this.collectionToDelete); 
        location.reload(); }, 
    error: () => { location.reload(); } }); } 
}
