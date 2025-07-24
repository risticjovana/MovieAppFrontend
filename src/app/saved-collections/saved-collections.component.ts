import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-collections',
  templateUrl: './saved-collections.component.html',
  styleUrls: ['./saved-collections.component.css']
})
export class SavedCollectionsComponent implements OnInit {
  user: any = null;
  savedCollections: any[] = [];

  constructor(
    private collectionService: CollectionService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserFromToken();

    if (this.user?.id) {
      this.collectionService.getSavedCollections(this.user.id).subscribe({
        next: (collections) => this.savedCollections = collections,
        error: (err) => console.error('Failed to fetch saved collections', err)
      });
    }
  }

  loadUserFromToken() {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.user = jwtDecode(token);
      } catch {
        this.user = null;
      }
    }
  }

  openCollectionContents(collectionId: number) {
    this.router.navigate(['/collections', collectionId, 'contents']);
  }
}
