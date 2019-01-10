// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCXLw_W1JfT3TaoXGfSGOq7gPjG_SfUCFo',
    authDomain: 'timetable-164d8.firebaseapp.com',
    databaseURL: 'https://timetable-164d8.firebaseio.com',
    projectId: 'timetable-164d8',
    storageBucket: 'timetable-164d8.appspot.com',
    messagingSenderId: '357607994345'
  },
// firebase.initializeApp(config);
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
