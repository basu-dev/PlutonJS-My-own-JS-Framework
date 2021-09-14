export class Service {
  instance;
  constructor() {
    this.dataEndPoint = "https://jsonplaceholder.typicode.com/users";
  }
  get() {
    return fetch(this.dataEndPoint).then((e) => e.json());
  }
}
