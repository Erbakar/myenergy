import {
  Component,
  OnInit,
  OnDestroy,
  AfterContentChecked,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  NavigationStart,
  ActivatedRoute,
} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge, Subscription } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ResizedEvent } from 'angular-resize-event';
import { environment } from '@env/environment';
import { Logger, I18nService } from '@app/core';
import { StoryblokService } from './myEnergy/storyblok.service';
export let browserRefresh = false;

const log = new Logger('App');
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked {
  subscription: Subscription;
  environmentUrl = 'Debug api';
  environmentName = '';
  event;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private i18nService: I18nService,
    public storyblokService: StoryblokService
  ) {
    this.storyblokService.getData();
    this.environmentUrl = environment.serverUrl;
    this.environmentName = environment.project;
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
        if (browserRefresh) {
          sessionStorage.removeItem('programs_loaded');
        }
      }
    });

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (environment.project === 'cti') {
          if (val.url === '/') {
            const user = JSON.parse(sessionStorage.getItem('credentials'));
            if (
              user &&
              user.organisation &&
              user.organisation.licenseType === 'Free'
            ) {
              this.router.navigate(['/cti/materials']);
            } else {
              this.router.navigate(['/cti/dashboard']);
            }
          }
        } else {
          if (val.url.indexOf('/cti') > -1) {
            this.router.navigate(['/products']);
          } else if (val.url === '/') {
            this.router.navigate(['/products']);
          }
        }
      }
    });
    this.event = $(window).width();
  }

  onResize(event: ResizedEvent) {
    this.event = event['target']['innerWidth'];
  }
  ngAfterContentChecked() {
    if ($('div').hasClass('sentry-error-embed-wrapper')) {
      $('.close').trigger('click');
      $('.sentry-error-embed-wrapper').css('display', 'none');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    localStorage.setItem('environment', environment.serverUrl);
    localStorage.setItem('project', environment.project);
    localStorage.setItem('GTAKey', environment['GTAKey']);
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

    // Setup translations
    this.i18nService.init(
      environment.defaultLanguage,
      environment.supportedLanguages
    );

    const onNavigationEnd = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    );

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });
  }
}
