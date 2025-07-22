import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../services/collection.service';
import { MovieService } from '../services/movie.service';
import { VisualContent } from '../model/visual-content';
import { forkJoin } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; 
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-collection-contents',
  templateUrl: './collection-contents.component.html',
  styleUrls: ['./collection-contents.component.css']
})
export class CollectionContentsComponent implements OnInit {
  collectionId!: number;
  contents: any[] = [];
  loading = true;
  error: string | null = null;
  posterMap: { [contentId: number]: string } = {};
  collectionInfo: any = null;
  showAddContentModal = false;
  availableContents: any[] = [];
  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private movieService: MovieService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void { 
    this.loadUserFromToken();

    this.collectionId = Number(this.route.snapshot.paramMap.get('id'));

    this.collectionService.getCollectionInfo(this.collectionId).subscribe({
      next: (info) => this.collectionInfo = info,
      error: () => this.error = 'Failed to load collection info.'
    });

    this.collectionService.getCollectionContents(this.collectionId).subscribe({
      next: (data) => {
        this.contents = data;
        this.loading = false;
        for (const movie of this.contents) {
          this.movieService.getSeriesPoster(movie.name).subscribe({
            next: (posterUrl) => this.posterMap[movie.contentId] = posterUrl,
            error: () => this.posterMap[movie.contentId] = 'assets/default-movie.jpg'
          });
        }
      },
      error: () => {
        this.error = 'Failed to load collection contents.';
        this.loading = false;
      }
    });
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

  goToContentInfo(content: VisualContent) {
    if (content.contentTypeString === 'Movie')
      this.router.navigate(['/movie-info', content.contentId]);
    else if (content.contentTypeString === 'TVSeries')
      this.router.navigate(['/series-info', content.contentId]);
  }

  openAddContentModal() {
    this.showAddContentModal = true;

    this.collectionService.getAvailableContentNotInCollection(this.collectionId).subscribe({
      next: (contents) => {
        this.availableContents = contents.map(c => ({ ...c, selected: false }));
        for (const content of this.availableContents) {
          const fetchPoster$ =
            content.typeString === 'Movie'
              ? this.movieService.getPoster(content.name)
              : this.movieService.getSeriesPoster(content.name);

          fetchPoster$.subscribe({
            next: (posterUrl) => this.posterMap[content.contentId] = posterUrl,
            error: () => this.posterMap[content.contentId] = 'assets/default-movie.jpg'
          });
        }
      },
      error: () => this.availableContents = []
    });
  }

  closeAddContentModal() {
    this.showAddContentModal = false;
  }

  addSelectedContents() {
    if (!this.availableContents || !this.user) return;

    const selectedContents = this.availableContents.filter(c => c.selected);
    if (selectedContents.length === 0) return;

    const addRequests = selectedContents.map(content =>
      this.collectionService.addContentToCollection(content.contentId, this.collectionId, this.user.id)
    );

    forkJoin(addRequests).subscribe({
      next: () => {
        this.contents.push(...selectedContents);
        this.availableContents = this.availableContents.filter(c => !c.selected);
        this.closeAddContentModal();
      },
      error: (err) => {
        console.error('Failed to add some contents', err);
      }
    });
  }

  removeContentFromCollection(contentId: number) {
    if (!this.collectionInfo) return;
 
    this.collectionService.removeContentFromCollection(this.collectionInfo.id, contentId).subscribe({
      next: () => { 
        this.contents = this.contents.filter(c => c.contentId !== contentId);
      },
      error: (err) => { 
      }
    });
  }
}
