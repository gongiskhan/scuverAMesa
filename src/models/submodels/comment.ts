import {User} from '../user';

export class Comment {

  constructor(
    public user = new User(),
    public date = '',
    public read = false,
    public comment: string = ''
  ) {}

}
