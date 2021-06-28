import {Address} from './submodels/address';
import { PostCodeAndCoordinates } from './submodels/postcode-and-coordinates';

export class User {

  constructor(
    public uid: string = '',
    public name: string = '',
    public email: string = '',
    public fiscalNumber: string = '',
    public role: 'client' | 'admin' = 'client',
    public phoneNumber: string = '',
    public addresses: Array<Address> = [],
    public photoUrl: string = '',
    public shopId: string = '',
    public authProvider: 'password'|'phone'|'google.com'|'facebook.com'|'apple.com' = 'password',
    public fcmTokens = [],
    public wallet = 0
  ) {}

}
