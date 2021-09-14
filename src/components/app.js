//Component with Name 'app' is compulsory. This is the entry

import { nav } from "./nav";

//point of the app.
//be aware while using arrow function
let a;
export const app = {
  name: "app",
  children: [nav],
  state: {
    showform: true,
  },
  componentReady() {
    console.log("App component bootstrapped");
  },
  actions: {
    apple(a) {
      return "a";
    },
  },
  view(a, b) {
    window.app = this;
    return /*html*/ `
        <div>
        <nav></nav>
        <main>
        <router></router>
        </main>
        <app-footer></app-footer>
    </div>
    `;
  },
};
