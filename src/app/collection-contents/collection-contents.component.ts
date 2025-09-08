import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../services/collection.service';
import { MovieService } from '../services/movie.service';
import { VisualContent } from '../model/visual-content';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common'; 
import { jwtDecode } from 'jwt-decode';
import { CommentDto } from '../model/comment';
import { ChangeDetectorRef } from '@angular/core';

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
  showCommentPopup = false;
  commentText: string = '';
  comments: CommentDto[] = [];
  randomNames = [
  'Alice Johnson',
  'Ben Carter',
  'Lily Thompson',
  'James Lee',
  'Emma Davis',
  'Noah Wilson',
  'Olivia Brown',
  'Lucas Garcia',
  'Ava Martinez',
  'Ethan Anderson'
];
  isSaved = false; 
  commentAvatars: string[] = [];
  showDeleteCommentPopup = false;
  commentToDelete: number | null = null; 

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private movieService: MovieService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void { 
    this.loadUserFromToken();
 
    this.collectionId = Number(this.route.snapshot.paramMap.get('id'));

    this.collectionService.getCollectionInfo(this.collectionId).subscribe({
        next: (info) => {
          this.collectionInfo = info;
          this.loadComments();   
        },
        error: () => this.error = 'Failed to load collection info.'
      });


    this.collectionService.getCollectionContents(this.collectionId).subscribe({
      next: (data) => {
        this.contents = data;
        this.loading = false;

        for (const content of this.contents) {
          if (content.contentTypeString === 'Movie') {
            this.movieService.getPoster(content.name).subscribe({
              next: (posterUrl) => this.posterMap[content.contentId] = posterUrl,
              error: () => this.posterMap[content.contentId] = 'assets/default-movie.jpg'
            });
          } else if (content.contentTypeString === 'TVSeries') {
            this.movieService.getSeriesPoster(content.name).subscribe({
              next: (posterUrl) => this.posterMap[content.contentId] = posterUrl,
              error: () => this.posterMap[content.contentId] = 'assets/default-movie.jpg'
            });
          } else {
            // fallback if type is unknown
            this.posterMap[content.contentId] = 'assets/default-movie.jpg';
          }
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
            content.contentTypeString === 'Movie'
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
        .pipe(
          catchError(err => {
            console.error(`Failed to add content ${content.contentId}`, err);
            return of(null); // continue even if this request fails
          })
        )
    );

    forkJoin(addRequests)
      .pipe(
        finalize(() => {
          // always close modal and navigate
          this.closeAddContentModal();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/collections/${this.collectionId}/contents`]);
          });
        })
      )
      .subscribe(results => {
        console.log('All requests completed', results);
        // optional: update local arrays if you want
        this.contents.push(...selectedContents);
        this.availableContents = this.availableContents.filter(c => !c.selected);
      });
  }

  removeContentFromCollection(contentId: number) {
    if (!this.collectionInfo) return;

    this.collectionService.removeContentFromCollection(this.collectionInfo.id, contentId).subscribe({
      next: () => { 
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/collections/${this.collectionId}/contents`]);
        });

        delete this.posterMap[contentId];
  
        this.cdr.detectChanges();
      },
      error: (err) => { 
        console.error('Failed to remove content', err);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([`/collections/${this.collectionId}/contents`]);
        });
      }
    });
  } 

  saveCollection(): void {
    if (!this.user?.id || !this.collectionInfo?.id) return;

    this.collectionService.saveCollection(this.user.id, this.collectionInfo.id).subscribe({
      next: () => { 
        this.collectionInfo.saveCount++;  
        this.isSaved = true;
      },
      error: (err) => {
        console.error('Failed to save collection', err); 
      }
    });
  }

  openCommentPopup() {
    this.commentText = '';
    this.showCommentPopup = true;
  }

  closeCommentPopup() {
    this.showCommentPopup = false;
  }

  submitComment() {
    if (!this.commentText.trim() || !this.collectionInfo?.id || !this.user?.id) return;

    this.collectionService.addCommentToCollection(
      this.collectionInfo.id,
      this.user.id, 
      this.commentText.trim()
    ).subscribe({
      next: () => {
        console.log("Comment submitted successfully");
        this.commentText = '';
        this.closeCommentPopup();
        this.loadComments(); // reload comments list
      },

      error: (err) => {
        console.error("Failed to submit comment", err);
      }
    });
  }

  shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  loadComments(): void {
    this.collectionService.getCommentsForCollection(this.collectionInfo.id)
      .subscribe({
        next: (data) => {
          this.comments = data;

          this.commentAvatars = this.comments.map(() =>
            this.randomAvatars[Math.floor(Math.random() * this.randomAvatars.length)]
          );

          const shuffled = this.shuffleArray(this.randomNames);
          this.commentNameList = this.comments.map((_, index) =>
            shuffled[index % shuffled.length]
          );

        },
        error: (err) => console.error('Failed to load comments', err)
      });
  }

  commentNameList: string[] = [];

  getRandomName(): string {
    const index = Math.floor(Math.random() * this.randomNames.length);
    return this.randomNames[index];
  }

  randomAvatars = [
    'https://i.pravatar.cc/50?img=1',
    'https://i.pravatar.cc/50?img=2',
    'https://i.pravatar.cc/50?img=3',
    'https://i.pravatar.cc/50?img=4',
    'https://i.pravatar.cc/50?img=5',
    'https://i.pravatar.cc/50?img=6',
    'https://i.pravatar.cc/50?img=7',
    'https://i.pravatar.cc/50?img=8',
    'https://i.pravatar.cc/50?img=9',
    'https://i.pravatar.cc/50?img=10',
  ];

  // Function to get a random avatar
  getRandomAvatar() {
    const index = Math.floor(Math.random() * this.randomAvatars.length);
    return this.randomAvatars[index];
  }

  get userRole(): string {
    return this.user?.role || 'Unknown';
  }

  confirmDeleteComment(commentId: number) {
    this.commentToDelete = commentId;
    this.showDeleteCommentPopup = true;
  }

  cancelDeleteComment() {
    this.commentToDelete = null;
    this.showDeleteCommentPopup = false;
  }

  deleteConfirmedComment() {
    if (this.commentToDelete === null || !this.collectionInfo?.id) return;

    this.collectionService.deleteCommentFromCollection(this.collectionInfo.id, this.commentToDelete)
      .subscribe({
        next: () => {
          this.comments = this.comments.filter(c => c.id !== this.commentToDelete);
          this.showDeleteCommentPopup = false;
          this.commentToDelete = null;
        },
        error: (err) => {
          console.error(`Failed to delete comment ${this.commentToDelete}`, err);
          this.showDeleteCommentPopup = false;
          this.commentToDelete = null;
        }
      });
  }

}
