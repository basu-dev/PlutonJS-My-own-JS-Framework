import { devJS } from "../../devJs/devJs.js";
import { Route } from "./routes.js";
import {name} from "./components/name.js"
import { detail } from "./components/detail.js";
import { test } from "./components/test.js";
import { nav } from "./components/nav.js";
import { app } from "./components/app.js";
import { intro } from "./components/intro.js";
import { myForm } from "./components/form.js";
import { parent } from "./components/parent.js";
import {child} from "./components/child.js";
 export const devApp=new devJS("#entry","router",[
  name,
  detail,
  test,
  nav,
  app,
  intro,
  myForm,
  parent,
  child
])

let a = new Route(devApp);
window['devApp']=devApp
