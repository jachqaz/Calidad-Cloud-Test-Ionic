import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient} from '@angular/common/http';
import {addIcons} from 'ionicons';
import {
  addOutline,
  alertCircleOutline,
  bookmarkOutline,
  bookmarksOutline,
  bookOutline,
  brushOutline,
  bulbOutline,
  businessOutline,
  calendarOutline,
  checkmarkCircle,
  chevronForward,
  closeOutline,
  colorPaletteOutline,
  compassOutline,
  createOutline,
  ellipseOutline,
  ellipsisVerticalOutline,
  flashOutline,
  flaskOutline,
  happyOutline,
  heartOutline,
  homeOutline,
  laptopOutline,
  libraryOutline,
  listOutline,
  medicalOutline,
  peopleOutline,
  personOutline,
  searchOutline,
  settingsOutline,
  star,
  starOutline,
  timeOutline,
  trashOutline,
  warningOutline
} from 'ionicons/icons';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {DATA_PROVIDERS} from './app/data/data.providers';
import {PRESENTATION_PROVIDERS} from './app/presentation/presentation.providers';

// Register required icons
addIcons({
  'add-outline': addOutline,
  'alert-circle-outline': alertCircleOutline,
  'book-outline': bookOutline,
  'bookmark-outline': bookmarkOutline,
  'bookmarks-outline': bookmarksOutline,
  'brush-outline': brushOutline,
  'bulb-outline': bulbOutline,
  'business-outline': businessOutline,
  'calendar-outline': calendarOutline,
  'checkmark-circle': checkmarkCircle,
  'chevron-forward': chevronForward,
  'close-outline': closeOutline,
  'color-palette-outline': colorPaletteOutline,
  'compass-outline': compassOutline,
  'create-outline': createOutline,
  'ellipse-outline': ellipseOutline,
  'ellipsis-vertical-outline': ellipsisVerticalOutline,
  'flash-outline': flashOutline,
  'flask-outline': flaskOutline,
  'happy-outline': happyOutline,
  'heart-outline': heartOutline,
  'home-outline': homeOutline,
  'laptop-outline': laptopOutline,
  'library-outline': libraryOutline,
  'list-outline': listOutline,
  'medical-outline': medicalOutline,
  'people-outline': peopleOutline,
  'person-outline': personOutline,
  'search-outline': searchOutline,
  'settings-outline': settingsOutline,
  'star': star,
  'star-outline': starOutline,
  'time-outline': timeOutline,
  'trash-outline': trashOutline,
  'warning-outline': warningOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    ...DATA_PROVIDERS,
    ...PRESENTATION_PROVIDERS
  ],
});
