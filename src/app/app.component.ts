import { Component, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Luma Health';
  headerTitle = this.title + '- San Francisco';
  colorOnScroll = 500;

  public transparent = true;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > this.colorOnScroll) {
        if (this.transparent) {
          this.transparent = false;
        }
    } else {
        if ( !this.transparent ) {
          this.transparent = true;
        }
    }
  }

}
