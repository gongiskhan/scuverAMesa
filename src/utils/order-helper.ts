import {take} from 'rxjs/operators';
import {Option} from '../models/option';
import {Order} from '../models/order';
import {OrderItem} from '../models/order-item';
import {OrderOption} from '../models/order-option';
import {ShopService} from '../services/shop.service';
import {UserService} from '../services/user.service';
import {ShopHelper} from './shop-helper';
import {MyMoment} from './time-helper';
import {UIDGenerator} from './uid-generator';


class OrderHelperClass {

  shopService = ShopService;
  userService = UserService;
  shopHelper = ShopHelper;

  constructor(
  ) {}

  async buildNewOrder() {
    const user = await this.userService.getCurrentUser().pipe(take(1)).toPromise();
    const shop = await this.shopService.getCurrentShop().pipe(take(1)).toPromise();
    if (!user || !shop) return;

    const order = new Order();
    order.uid = UIDGenerator.generate();
    order.status = 'being-created';
    order.log = [];
    order.shop = JSON.parse(JSON.stringify(shop));
    order.user = JSON.parse(JSON.stringify(user));
    order.orderItems = [];
    order.address = user.addresses[user.addresses.length - 1];
    order.submittedAt = '';
    order.completedAt = '';
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
    if (order.type === 'delivery') {
      return this.getOrderSubTotal(order) + order.deliveryFee;
    } else {
      return this.getOrderSubTotal(order);
    }
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

  updateOrderExpectedArrivalIfNeeded(order: Order) {
    const expectedArrivalMoment = order.arrivalExpectedAt ? MyMoment.parse(order.arrivalExpectedAt) : null;
    const earliestArrivalTimeOfToday   = this.shopHelper.getArrivalTimesOfToday(order.shop)[0];
    const earliestArrivalMomentOfToday = earliestArrivalTimeOfToday ? MyMoment.todayAt(earliestArrivalTimeOfToday) : null;

    if (!expectedArrivalMoment && !earliestArrivalMomentOfToday) return false;

    if ( expectedArrivalMoment && !earliestArrivalMomentOfToday) {
      order.arrivalExpectedAt = new Order().arrivalExpectedAt;
      return true;
    }

    if (!expectedArrivalMoment &&  earliestArrivalMomentOfToday) {
      order.arrivalExpectedAt = earliestArrivalMomentOfToday.toString();
      return true;
    }

    // ⬇ both have a value...

    // @ts-ignore
    if (expectedArrivalMoment.toMinutes() < earliestArrivalMomentOfToday.toMinutes()) {
      // @ts-ignore
      order.arrivalExpectedAt = earliestArrivalMomentOfToday.toString();
      return true;
    }

    return false;
  }

  areEquals(option: Option, orderOption: OrderOption) {
    if (option.name !== orderOption.name) return false;
    if (option.price !== orderOption.price) return false;
    if (option.description !== orderOption.description) return false;

    return true;
  }

}

export const OrderHelper = new OrderHelperClass();
