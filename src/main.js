//this is the file where you mention all your components to be registered to app.
//thie app not mentioned here will not be the part of your project.
//

import { Pluton } from "../lib/pluton";
import { Route } from "./routes";
import { something } from "./components/name";
import { detail } from "./components/detail";
import { test } from "./components/test";
import { nav } from "./components/nav";
import { app } from "./components/app";
import { intro } from "./components/intro";
import { myForm } from "./components/form";
import { parent } from "./components/parent";
import { child } from "./components/child";
import { counter } from "./components/counter";
import { footer } from "./components/footer";
import "../src/site.scss";
//here #entry is for the main area of the index.html where all the components will be rendered <div id='main'></div>s

//the components rendered during haschange will be placed on the element represented by router
//here the app will search for the element with the name router ... <router></router>
export const devApp = new Pluton("#entry", "router", [
  something,
  detail,
  counter,
  test,
  nav,
  app,
  intro,
  myForm,
  parent,
  child,
  footer,
]);

let a = new Route(devApp);
//this is added for debugging purpose.
//Remove this in production
//type devApp in the console and you will see the current state of the app
window["com"] = devApp.components;
window["dev"] = devApp;
