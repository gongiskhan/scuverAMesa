import {User} from './user';
import {Shop} from './shop';
import {OrderItem} from './order-item';

export class Order {

  constructor(
    public uid: string = '',
    public type: 'take-away' | 'delivery' | 'in-restaurant' = 'in-restaurant',
    public status: 'being-created' | 'pending' | 'viewed' | 'bringing' | 'completed' = 'being-created',
    public log: string[] = [],
    public shop: Shop = new Shop(),
    public user: User = new User(),
    public orderItems: OrderItem[] = [],
    public distanceInKm: number = 0,
    public submittedAt: string = '',
    public completedAt: string = '',
    public arrivalExpectedAt: string = '',
    public subTotal: number = 0,
    public total: number = 0,
    public notes: string = '',
    public wallet: number = 0,
    public table: string = 'counter'
  ) {}

}
