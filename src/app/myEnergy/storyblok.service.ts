import { Injectable } from '@angular/core';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class StoryblokService {
  constructor() {}

  public getData() {
    fetch(environment.stroyblockUrl)
      .then((response) => response.json())
      .then(({ story }) =>
        localStorage.setItem('storyblok', JSON.stringify(story.content))
      );
  }
}
