import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, RouteReuseStrategy} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';
import {provideHttpClient} from '@angular/common/http';
import {addIcons} from 'ionicons';
import {
  addOutline,
  alertCircleOutline,
  bookmarkOutline,
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
  'book-outline': bookOutline,
  'color-palette-outline': colorPaletteOutline,
  'home-outline': homeOutline,
  'search-outline': searchOutline,
  'list-outline': listOutline,
  'settings-outline': settingsOutline,
  'bookmark-outline': bookmarkOutline,
  'person-outline': personOutline,
  'calendar-outline': calendarOutline,
  'library-outline': libraryOutline,
  'alert-circle-outline': alertCircleOutline,
  'add-outline': addOutline,
  'ellipsis-vertical-outline': ellipsisVerticalOutline,
  'create-outline': createOutline,
  'trash-outline': trashOutline,
  'flask-outline': flaskOutline,
  'time-outline': timeOutline,
  'chevron-forward': chevronForward,
  'checkmark-circle': checkmarkCircle,
  'ellipse-outline': ellipseOutline,
  'close-outline': closeOutline,
  'laptop-outline': laptopOutline,
  'brush-outline': brushOutline,
  'medical-outline': medicalOutline,
  'heart-outline': heartOutline,
  'flash-outline': flashOutline,
  'warning-outline': warningOutline,
  'compass-outline': compassOutline,
  'people-outline': peopleOutline,
  'happy-outline': happyOutline,
  'star-outline': starOutline,
  'business-outline': businessOutline,
  'bulb-outline': bulbOutline
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
