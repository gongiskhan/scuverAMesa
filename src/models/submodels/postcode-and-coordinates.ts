export class PostCodeAndCoordinates {
  
  constructor(
    public postCode: string,
    public coordinates = { latitude: 0, longitude: 0}
  ) {}
  
}
