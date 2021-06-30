import { Address } from './submodels/address';
import { BookingSettings } from './submodels/booking-settings';
import { ClosingDays } from './submodels/closing-days';
import { Timetable } from './submodels/timetable';

export class Shop {

  constructor(
    public uid: string = '',
    public name: string = '',
    public fiscalNumber: string = '',
    public address: Address = new Address(),
    public phoneNumber: string = '',
    public email: string = '',
    public photoUrl: string = '',
    public foodTypesId: string[] = [],
    public suspendOrders: boolean = false,
    public onlinePaymentStatus: boolean = true,
    public deliveryFeeMin: number = 1.85,
    public deliveryFeeMax: number = 3.50,
    public deliveryFeePerKm: number = 0.55,
    public deliveryCoverage: number = 7,
    public preparationTime: string = '00:30',
    public timetable: Timetable = new Timetable(),
    public minimumOrder: number = 5,
    public businessType: 'shop'|'store'|'groceries'|'pharmacy' = 'shop',
    public dinnerDisabled = false,
    public bookingSettings: BookingSettings = new BookingSettings(),
    public iban: string = '',
    public promo: number = 0,
    public inShopEnabled = false
  ) {}

}
