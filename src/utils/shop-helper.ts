import { Shop } from '../models/shop';
import { DaySchedule } from '../models/submodels/timetable';
import { MyTime, TimeHelper, MyDate } from './time-helper';
import { Coordinates } from '../models/submodels/coordinates';
import {LocationHelper} from "@src/utils/location-helper";

class ShopHelperClass {

  locationHelper = LocationHelper;

  constructor(
  ) {}

  getArrivalTimesOn(shop: Shop, day: any, at: MyTime) {
    const preparationTime = MyTime.parse(shop.preparationTime);
    const timeStepInMin   = 15;
    const minimunTime     = MyTime.minutesToTime(at.toMinutes() + preparationTime.toMinutes() + 15);
    // @ts-ignore
    const daySchedule     = shop.timetable[day] as DaySchedule;

    if (daySchedule.isClosed) return [];

    const times: MyTime[] = [];
    const time = MyTime.minutesToTime(Math.round(minimunTime.toMinutes() / timeStepInMin) * timeStepInMin);

    daySchedule.workingPeriods.forEach((workingPeriod) => {
      if (workingPeriod.startTime && workingPeriod.endTime) {
        const startTime = MyTime.parse(workingPeriod.startTime);
        const endTime   = MyTime.parse(workingPeriod.endTime);

        const from = MyTime.minutesToTime( startTime.toMinutes() + preparationTime.toMinutes() + 5);
        const to   = MyTime.minutesToTime(   endTime.toMinutes() + preparationTime.toMinutes());

        while (time.toMinutes() < to.toMinutes()) {
          if (time.isWithinTimeSpan(from, to)) times.push(time.copy());
          time.addMinutes(timeStepInMin);
        }
      }
    });

    return times;
  }

  getArrivalTimesOfEarliestDay(shop: Shop) {
    const days  = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = MyDate.getCurrentDay();
    const todayIndex = days.findIndex((day) => day === today);
    const daysSofted = days.slice(todayIndex, days.length).concat(days.slice(0, todayIndex));

    for (const day of daysSofted) {
      const at = day === MyDate.getCurrentDay() ? MyTime.getCurrentTime() : MyTime.parse('00:00');
      const arrivalTimes = this.getArrivalTimesOn(shop, day, at);
      if (arrivalTimes.length) return arrivalTimes;
    }

    return [];
  }

  getArrivalTimesOfToday(shop: Shop) {
    return this.getArrivalTimesOn(shop, MyDate.getCurrentDay(), MyTime.getCurrentTime());
  }

  getArrivalTimesOfTomorrow(shop: Shop) {
    return this.getArrivalTimesOn(shop, MyDate.getNextDay(), MyTime.parse('00:00'));
  }

  earliestArrivalTime(shop: Shop) {
    const arrivalTimes = this.getArrivalTimesOfEarliestDay(shop);
    return arrivalTimes[0];
  }

  latestArrivalTime(shop: Shop) {
    const arriavalTimes = this.getArrivalTimesOfEarliestDay(shop);
    return arriavalTimes[arriavalTimes.length];
  }

  getTodaySchedule(shop: Shop) {
    const today = MyDate.getCurrentDay();
    // @ts-ignore
    return shop.timetable[today] as DaySchedule;
  }

  getTomorrowSchedule(shop: Shop) {
    const tomorrow = MyDate.getNextDay();
    // @ts-ignore
    return shop.timetable[tomorrow] as DaySchedule;
  }

  getScheduleAsArray(shop: Shop) {
    const shopSchedule: {day: string, schedule: DaySchedule}[] = [];

    shopSchedule.push({day: 'monday'   , schedule: shop.timetable.monday   });
    shopSchedule.push({day: 'tuesday'  , schedule: shop.timetable.tuesday  });
    shopSchedule.push({day: 'wednesday', schedule: shop.timetable.wednesday});
    shopSchedule.push({day: 'thursday' , schedule: shop.timetable.thursday });
    shopSchedule.push({day: 'friday'   , schedule: shop.timetable.friday   });
    shopSchedule.push({day: 'saturday' , schedule: shop.timetable.saturday });
    shopSchedule.push({day: 'sunday'   , schedule: shop.timetable.sunday   });

    return shopSchedule;
  }

  isOpenOn(shop: Shop, day: string, time: MyTime) {
    // @ts-ignore
    const daySchedule = shop.timetable[day] as DaySchedule;

    if (daySchedule.isClosed) return false;

    for (const workingPeriod of daySchedule.workingPeriods) {
      const startTime = TimeHelper.parse(workingPeriod.startTime);
      const endTime = TimeHelper.parse(workingPeriod.endTime);
      if (TimeHelper.isWithinTimeSpan(time, startTime, endTime)) return true;
    }

    return false;
  }

  isOpenTodayAt(shop: Shop, time: MyTime) {
    const today = TimeHelper.getCurrentDay();
    return this.isOpenOn(shop, today, time);
  }

  isOpenToday(shop: Shop) {
    const today = TimeHelper.getCurrentDay();
    // @ts-ignore
    return !shop.timetable[today].isClosed;
  }

  isClosedToday(shop: Shop) {
    const today = TimeHelper.getCurrentDay();
    // @ts-ignore
    return shop.timetable[today].isClosed;
  }

  isLocationWithinBounds(shop: Shop, point: Coordinates) {
    const distanceInKm = this.locationHelper.getRadiusDistanceInKm(shop.address.coordinates, point);
    // console.log('isLocationWithinBounds', shop.name, shop.deliveryCoverage, distanceInKm);
    return (distanceInKm <= (shop.deliveryCoverage));
  }

  getDeliveryFee(shop: Shop, distanceInKm: number) {
    let deliveryFee = shop.deliveryFeeMin;
    if (distanceInKm > 1) {
      deliveryFee = shop.deliveryFeeMin + (shop.deliveryFeePerKm * (distanceInKm - 1));
    }
    deliveryFee = Math.min(deliveryFee, shop.deliveryFeeMax);
    deliveryFee = Math.round((deliveryFee + Number.EPSILON) * 100) / 100;
    return deliveryFee;
  }

}

export const ShopHelper = new ShopHelperClass();
