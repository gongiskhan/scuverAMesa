import {BehaviorSubject, Observable} from 'rxjs';
import {Review} from '../models/review';
import {FirestoreService} from './firestore-utils/firestore.service';
import {map, take} from 'rxjs/operators';
import {UserService} from "@src/services/user.service";

class ReviewServiceClass {

  // @ts-ignore
  public userReviews$ = new BehaviorSubject<Array<Review>>(null);
  userService = UserService;
  firestoreService = FirestoreService;

  constructor(
  ) {
    this.trackUserReviews();
  }

  trackUserReviews() {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.firestoreService.observeRecordsByProperty('reviews', 'user.uid', '==', user.uid).subscribe((reviews: Review[]) => {
          // @ts-ignore
          this.userReviews$.next(reviews.map(review => review ? {...new Review(), ...review} : null));
        });
      }
    });
  }

  // async getReview(uid: string): Promise<Review> {
  //   return this.observeReview(uid).pipe(take(1)).toPromise();
  // }

  async getReviews(): Promise<Review[]> {
    return this.observeReviews().pipe(take(1)).toPromise();
  }

  // getReviewsByShop(shopId: string): Promise<Review[]> {
  //   return this.firestoreService.observeRecordsByProperty('reviews', 'shop.uid', '==', shopId)
  //       .pipe(
  //           take(1),
  //           map((reviews: Review[]) => reviews.map(review => review ? {...new Review(), ...review} : null))
  //       ).toPromise();
  // }

  // getReviewsByUser(userId: string): Promise<Review[]> {
  //   return this.firestoreService.observeRecordsByProperty('reviews', 'user.uid', '==', userId)
  //       .pipe(
  //           take(1),
  //           map((reviews: Review[]) => reviews.map(review => review ? {...new Review(), ...review} : null))
  //       ).toPromise();
  // }

  // observeReviewsByUser(userId: string): Observable<Review[]> {
  //   return this.firestoreService.observeRecordsByProperty('reviews', 'user.uid', '==', userId)
  //       .pipe(
  //           map((reviews: Review[]) => reviews.map(review => review ? {...new Review(), ...review} : null))
  //       );
  // }

  // getReviewByShopAndUser(shopId: string, userId: string): Promise<Review> {
  //   return new Promise<Review>(resolve => {
  //     this.firestoreService.getRecordsByProperty('reviews', 'shop.uid', '==', shopId).then(reviews => {
  //       let review = null;
  //       reviews.forEach(r => {
  //         if (r.user.uid === userId) {
  //           review = r;
  //         }
  //       });
  //       resolve(review);
  //     });
  //   });
  // }

  // getMergedReviewsByShop(shopId: string): Promise<Review[]> {
  //   return new Promise((resolve, reject) => {
  //     this.getReviewsByShop(shopId).then(reviews => {
  //       if (reviews && reviews.length) {
  //         const mergedReviews = new Map<string, Review>();
  //         mergedReviews.set(shopId, reviews[0]);
  //         reviews.forEach((review, it) => {
  //           if (it !== 0) {
  //             const mergedReview = mergedReviews.get(shopId);
  //             mergedReview.comments[review.user.uid].push(review.notes);
  //             mergedReview.comments = new Map([...mergedReview.comments].concat([...review.comments]));
  //             mergedReview.globalRating += (review.globalRating / reviews.length);
  //             mergedReview.waitingTimeRating += (review.waitingTimeRating / reviews.length);
  //             mergedReview.packagingRating += (review.packagingRating / reviews.length);
  //             mergedReview.whatToOrder += review.whatToOrder;
  //           }
  //         });
  //       } else {
  //         resolve([]);
  //       }
  //     });
  //   });
  // }

  // saveReview(review: Review): Promise<Review> {
  //   return this.firestoreService.addOrUpdateRecord('reviews', JSON.parse(JSON.stringify(review))) as Promise<Review>;
  // }

  removeReview(uid: string) {
    return this.firestoreService.removeRecord('reviews', uid);
  }

  // observeReview(uid: string): Observable<Review> {
  //   return this.firestoreService.observeRecord('reviews', uid).pipe(map((review: Review) => review ? merge(new Review(), review) : null));
  // }

  observeReviews(): Observable<Review[]> {
    return new Observable(observer => {
      this.firestoreService.observeCollection('reviews').pipe(map((reviews) => {
        return reviews.map((review: any) => review ? {...new Review(), ...review} : null)
      })).subscribe(result => {
        observer.next(result as any);
      });
    });
  }

  observeShopRating(shopUID: string): Observable<string> {
    return new Observable((observer) => {
      this.observeReviews().subscribe(reviews => {
        let totalRating = 0;
        let count = 0;
        reviews.forEach(review => {
          if (review.shop?.uid === shopUID) {
            totalRating += review.globalRating;
            count++;
          }
        });
        observer.next(totalRating ? `${(totalRating / count).toFixed(1)} (${count})` : '');
      });
    });
  }

  observeShopRatings(): Observable<Map<string, string>> {
    return new Observable((observer) => {
      this.observeReviews().subscribe(reviews => {
        const totalRatings = new Map<string, number>();
        const counts = new Map<string, number>();
        reviews.forEach(review => {
          if (review.shop) {
            totalRatings.set(review.shop.uid, (totalRatings.get(review.shop.uid) || 0) + review.globalRating);
            counts.set(review.shop.uid, (counts.get(review.shop.uid) || 0) + 1);
          }
        });
        const ratings = new Map<string, string>();
        totalRatings.forEach((v, k) => {
          // @ts-ignore
          ratings.set(k, `${(v / counts.get(k)).toFixed(1)}:${counts.get(k)}`);
        });
        // observer.next(totalRating ? `${(totalRating / count).toFixed(1)} (${count})` : '');
        observer.next(ratings);
      });
    });
  }
}

export const ReviewService = new ReviewServiceClass();
