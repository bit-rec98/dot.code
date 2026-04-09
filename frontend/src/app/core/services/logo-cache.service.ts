import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LogoCacheService {
  private cache = new Map<string, Observable<SafeHtml>>();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Returns an Observable of sanitized SVG markup for the given URL.
   * Each URL is fetched at most once; subsequent calls share the cached result.
   */
  getSvg(url: string): Observable<SafeHtml> {
    if (!this.cache.has(url)) {
      const request$ = this.http
        .get(url, { responseType: 'text' })
        .pipe(
          map((svg) => this.sanitizer.bypassSecurityTrustHtml(svg)),
          catchError(() => of(this.sanitizer.bypassSecurityTrustHtml(''))),
          shareReplay(1)
        );
      this.cache.set(url, request$);
    }
    return this.cache.get(url)!;
  }

  /**
   * Preloads a list of URLs, populating the cache so later .getSvg()
   * calls are served instantly from the replay.
   */
  preload(urls: string[]): void {
    urls.forEach((url) => this.getSvg(url).subscribe());
  }
}
