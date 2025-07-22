import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
  showCreateModal = false;
  dropdownOpenId: number | null = null;

  newCollection = {
    name: '',
    description: ''
  };


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

  openCreateCollectionModal() {
  this.showCreateModal = true;
}

closeModal() {
  this.showCreateModal = false;
}

createCollection() {
  if (!this.newCollection.name.trim() || !this.user?.id) return;

  this.collectionService.createPersonalCollection(
    this.newCollection.name,
    this.newCollection.description,
    this.user.id
  ).subscribe({
    next: (collection) => {
      this.userCollections.unshift(collection);
      this.closeModal();

      // Reset the form
      this.newCollection.name = '';
      this.newCollection.description = '';

      // Navigate to the collection's contents page
      this.router.navigate(['/collections', collection.id, 'contents']);
    },
    error: (err) => {
      console.error('Failed to create collection', err);
    }
  });
}

toggleDropdown(event: MouseEvent, collectionId: number): void {
  event.stopPropagation();
  this.dropdownOpenId = this.dropdownOpenId === collectionId ? null : collectionId;
}

@HostListener('document:click')
closeDropdown(): void {
  this.dropdownOpenId = null;
}

deleteCollection(collectionId: number): void {
  this.collectionService.deleteCollection(collectionId).subscribe({
    next: () => {
      this.userCollections = this.userCollections.filter(c => c.id !== collectionId);
    },
    error: () => { 
    }
  });
}

}
