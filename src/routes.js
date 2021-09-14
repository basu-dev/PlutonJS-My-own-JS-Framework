import { Router } from "../lib/router";

export class Route extends Router {
  constructor(app) {
    super(app, [
      {
        routeName: "form",
        componentName: "myForm",
      },
      {
        routeName: "name",
        componentName: "name",
      },
      {
        routeName: "mycomp",
        componentName: "mycomp",
      },
      {
        routeName: "dtl",
        componentName: "detail",
      },
      {
        routeName: "nav",
        componentName: "nav",
      },
      {
        routeName: "intro",
        componentName: "intro",
        isDefault: true,
      },
      {
        routeName: "parent",
        componentName: "parent",
      },
      {
        routeName: "test",
        componentName: "test",
      },
      {
        routeName: "counter",
        componentName: "counter",
      },
    ]);
  }
}
