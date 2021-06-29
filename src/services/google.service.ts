// // import { google, Loader, LoaderOptions } from 'google-maps';
// import { ReplaySubject } from 'rxjs';
// import { take } from 'rxjs/operators';
//
// class GoogleServiceClass {
//
//   private google$ = new ReplaySubject<any>(1);
//
//   constructor() {
//     // const options: LoaderOptions = {
//     //   version: 'weekly',
//     //   language: 'pt-PT',
//     //   region: 'pt',
//     //   libraries: ['places', 'geometry']
//     // };
//     //
//     // new Loader('AIzaSyDYNIDWuvrgopqJn6JtyLWAFx3zmXCnd_0', options).load()
//     // .then((google) => this.google$.next(google));
//   }
//
//   /**
//    * It nevers returns null. (Edward)
//    */
//   getGoogle() {
//     return this.google$.pipe(take(1)).toPromise();
//   }
//
// }
//
// export const GoogleService = new GoogleServiceClass();
