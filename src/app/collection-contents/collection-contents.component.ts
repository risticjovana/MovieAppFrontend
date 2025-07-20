import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../services/collection.service';
import { MovieService } from '../services/movie.service';
import { VisualContent } from '../model/visual-content';

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


  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private movieService: MovieService,
    private router: Router,
  ) {}

  ngOnInit(): void { 
    this.collectionId = Number(this.route.snapshot.paramMap.get('id'));

    this.collectionService.getCollectionInfo(this.collectionId).subscribe({
      next: (info) => {
        this.collectionInfo = info;
      },
      error: () => {
        this.error = 'Failed to load collection info.';
      }
    });

    this.collectionService.getCollectionContents(this.collectionId).subscribe({
      next: (data) => {
        this.contents = data;
        this.loading = false;

        for (const movie of this.contents) {
          this.movieService.getSeriesPoster(movie.name).subscribe({
            next: (posterUrl) => {
              this.posterMap[movie.contentId] = posterUrl;
            },
            error: () => {
              this.posterMap[movie.contentId] = 'assets/default-movie.jpg';
            }
          });
        }
      },
      error: (err) => {
        this.error = 'Failed to load collection contents.';
        this.loading = false;
      }
    });
  }

  goToContentInfo(content: VisualContent) {
    if(content.contentTypeString=='Movie')
      this.router.navigate(['/movie-info', content.contentId]);
    else if(content.contentTypeString == 'TVSeries')
      this.router.navigate(['/series-info', content.contentId]);
  }

}