import {Review} from '../review';

export class SocialUser {

  constructor(
    public uid: string = '',
    public name: string = '',
    public email: string = '',
    public photoUrl: string = '',
    public foodType: string = '',
    public foodTypeSVG: string = '',
    public reviews: Array<Review> = [],
    public likes: number,
    public wallet = 0
  ) {}

}
