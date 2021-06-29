import {Coordinates} from "@src/models/submodels/coordinates";
// import {GoogleService} from "@src/services/google.service";

class LocationHelperClass {

  // googleService = GoogleService;

  constructor(
  ) {}

  getRadiusDistanceInKm(point1: Coordinates, point2: Coordinates) {
    // @ts-ignore
    const toRadian = angle => (Math.PI / 180) * angle;
    // @ts-ignore
    const distance = (a, b) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;

    const dLat = distance(point2.latitude, point1.latitude);
    const dLon = distance(point2.longitude, point1.longitude);

    const rLat1 = toRadian(point1.latitude);
    const rLat2 = toRadian(point2.latitude);

    // Haversine Formula
    const a =
        Math.pow(Math.sin(dLat / 2), 2) +
        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(rLat1) * Math.cos(rLat2);
    const c = 2 * Math.asin(Math.sqrt(a));

    return Math.floor(RADIUS_OF_EARTH_IN_KM * c);
  }

  // async getRoadDistanceInKm(point1: Coordinates, point2: Coordinates) {
  //   return new Promise<number>(async (resolve, reject) => {
  //     const google = await this.googleService.getGoogle();
  //     const googlePoint1 = new google.maps.LatLng(point1.latitude, point1.longitude);
  //     const googlePoint2 = new google.maps.LatLng(point2.latitude, point2.longitude);
  //
  //     const request = {
  //       origins: [googlePoint1],
  //       destinations: [googlePoint2],
  //       travelMode: 'DRIVING',
  //       avoidHighways: false,
  //       avoidTolls: true,
  //     } as google.maps.DistanceMatrixRequest;
  //
  //     new google.maps.DistanceMatrixService().getDistanceMatrix(request, (response) => {
  //       const status = response.rows[0].elements[0].status;
  //       if (status === 'OK') {
  //         const distanceInKm = response.rows[0].elements[0].distance.value / 1000;
  //         resolve(Math.round(distanceInKm));
  //       }
  //       else {
  //         // @ts-ignore
  //         resolve(null);
  //       }
  //     });
  //   });
  // }

}

export const LocationHelper = new LocationHelperClass();
