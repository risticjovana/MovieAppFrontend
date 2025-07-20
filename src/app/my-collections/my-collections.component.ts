import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-collections',
  templateUrl: './my-collections.component.html',
  styleUrls: ['./my-collections.component.css'] // corrected 'styleUrl' to 'styleUrls'
})
export class MyCollectionsComponent implements OnInit {
  user: any;
  userCollections: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadUserFromToken();
    this.getUserCollections();
  }

  loadUserFromToken() {
      if (!isPlatformBrowser(this.platformId)) return;
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          this.user = jwtDecode(token);
          console.log('Decoded user:', this.user);
        } catch {
          this.user = null;
        }
      }
    }

  getUserCollections(): void {
    try{
      this.loading = true;
      this.collectionService.getUserCollections(this.user.id).subscribe({
        next: (collections) => {
          this.userCollections = collections;
          this.loading = false;
          console.log("Collections:", collections);
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load collections.';
          this.loading = false;
        }
      });
    }
    catch{ 
    }
  }

  openCollectionContents(collectionId: number) {
    this.router.navigate(['/collections', collectionId, 'contents']);
  }

}
