import {take} from 'rxjs/operators';
import {Option} from '../models/option';
import {Order} from '../models/order';
import {OrderItem} from '../models/order-item';
import {OrderOption} from '../models/order-option';
import {ShopService} from '../services/shop.service';
import {UserService} from '../services/user.service';
import {ShopHelper} from './shop-helper';
import {UIDGenerator} from './uid-generator';
import {MyMoment} from "@src/utils/time-helper";


class OrderHelperClass {

  shopService = ShopService;
  userService = UserService;
  shopHelper = ShopHelper;

  constructor(
  ) {}

  async buildNewOrder() {
    const user = await this.userService.observeCurrentUser().pipe(take(1)).toPromise();
    const shop = await this.shopService.getCurrentShop().pipe(take(1)).toPromise();
    if (!user || !shop) console.error('No shop or no user!');

    const order = new Order();
    order.uid = UIDGenerator.generate();
    order.status = 'being-created';
    order.log = [];
    order.shop = JSON.parse(JSON.stringify(shop));
    order.user = JSON.parse(JSON.stringify(user));
    order.orderItems = [];
    order.submittedAt = '';
    order.completedAt = '';
    console.log('MyMoment.getCurrentMoment().toString()', MyMoment.getCurrentMoment().toString());
    order.arrivalExpectedAt = MyMoment.getCurrentMoment().toString();
    // order.easypayPayment = {} as EasypayPayment;

    return order;
  }

  itemToOrderItem(item: any, quantity: number) {
    const orderItem: any = new OrderItem();
    for (const k in item) orderItem[k] = item[k];
    orderItem.quantity = quantity;

    return orderItem;
  }

  optionToOrderOption(option: any, quantity: number) {
    const orderOption: any = new OrderOption();
    for (const k in option) orderOption[k] = option[k];
    orderOption.quantity = quantity;

    return orderOption;
  }

  removeOrderItem(order: Order, orderItem: OrderItem) {
    order.orderItems.findIndex((orderItem) => orderItem.uid === orderItem.uid);
  }

  getOrderSubTotal(order: Order) {
    let subTotal = 0;
    order.orderItems.forEach(orderItem => subTotal += this.getOrderItemTotal(orderItem));
    return subTotal;
  }

  getOrderTotal(order: Order) {
      return this.getOrderSubTotal(order);
  }

  getOrderItemTotal(orderItem: OrderItem) {
    let total = 0;

    total += orderItem.price;
    orderItem.optionsSelected.forEach(optionSelected => {
      total += optionSelected.price * optionSelected.quantity;
    });
    total *= orderItem.quantity;

    return total;
  }

  areEquals(option: Option, orderOption: OrderOption) {
    if (option.name !== orderOption.name) return false;
    if (option.price !== orderOption.price) return false;
    if (option.description !== orderOption.description) return false;

    return true;
  }

}

export const OrderHelper = new OrderHelperClass();
