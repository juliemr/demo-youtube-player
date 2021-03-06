import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ThumbChangeEvent } from './thumbs.component';

import { Video } from '../video';

export enum SearchResultState {
  THUMBNAIL,
  PLAYER
}


@Component({
  selector: 'demo-search-result-card',
  templateUrl: './search-result-card.component.html',
  styleUrls: [ './search-result-card.component.css' ],
})
export class SearchResultCardComponent {
  state: SearchResultState = SearchResultState.THUMBNAIL;

  /* The video instance to take in. */
  @Input() video: Video;

  @Output() playVideo = new EventEmitter<CardPlayEvent>();

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitize video input to ensure we get a safe URL for embedding into our
   * app.
   * @returns A URL-safe string with the embedded video link.
   */
  get safeVideoUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
        `//www.youtube.com/embed/${this.video.id}`);
  }

  /**
   * Getter that tells the app if the video on this component is playing.
   * @returns A boolean indicating if the video is playing.
   */
  get isPlaying(): boolean {
    return this.state === SearchResultState.PLAYER;
  }

  /**
   * Instruction to play the video on this search result.
   */
  play(): void {
    this.playVideo.emit(new CardPlayEvent(this));
  }

  /**
   * Handles a thumb button being clicked to adjust the like or dislike count.
   * @param event The event that captures the thumb click.
   */
  onThumbsChange(event: ThumbChangeEvent) : void {
    this.video.likeCount += event.upDiff;
    this.video.dislikeCount += event.downDiff;
  }
}

export class CardPlayEvent {
  constructor(public target: SearchResultCardComponent) {}
}
