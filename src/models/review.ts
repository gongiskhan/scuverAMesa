import {Shop} from './shop';
import {User} from './user';
import {Comment} from './submodels/comment';

export class Review {

  constructor(
    public uid: string = '',
    public shop: Shop = new Shop(),
    public user: User = new User(),
    public globalRating: number = 0,
    public waitingTimeRating: number = 0,
    public packagingRating: number = 0,
    public notes: string = '',
    public whatToOrder: string = '',
    public comments: Array<Comment> = [],
    public hasUnreadComments = false,
    public userLikes: Array<string> = [],
    public photos: Array<string> = []
  ) {}

}
