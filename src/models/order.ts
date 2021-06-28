import { EasypayPayment } from './easypay-payment';
import { User } from './user';
import { Shop } from './shop';
import { Address } from './submodels/address';
import { OrderItem } from './order-item';
import { Driver } from './driver';

export class Order {

  constructor(
    public uid: string = '',
    public type: 'take-away' | 'delivery' = 'delivery',
    public status: string = '',
    public log: string[] = [],
    public shop: Shop = new Shop(),
    public user: User = new User(),
    public driver: Driver = null,
    public orderItems: OrderItem[] = [],
    public address: Address = null,
    public distanceInKm: number = 0,
    public submittedAt: string = '',
    public completedAt: string = '',
    public arrivalExpectedAt: string = '',
    public subTotal: number = 0,
    public deliveryFee: number = 0,
    public total: number = 0,
    public paid: boolean = false,
    public paymentMethod: '' | 'mb' | 'mbw' | 'payment-on-delivery' = '',
    public easypayPayment: EasypayPayment = {} as EasypayPayment,
    public easypayPaymentId: string = '',
    public notes: string = '',
    public referrer: string = null,
    public wallet: number = 0,
  ) {}

}
