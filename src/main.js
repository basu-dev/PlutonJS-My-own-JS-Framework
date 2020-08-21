//this is the file where you mention all your components to be registered to app.
//thie app not mentioned here will not be the part of your project.
//

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
//here #entry is for the main area of the index.html where all the components will be rendered <div id='main'></div>s

//the components rendered during haschange will be placed on the element represented by router
//here the app will search for the element with the name router ... <router></router>
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
//this is added for debugging purpose.
//Remove this in production
//type devApp in the console and you will see the current state of the app
window['com']=devApp.components    
window['dev']=devApp    