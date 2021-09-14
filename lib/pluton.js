import { devObservable } from "./devObservable.js";
import morphdom from "./dist/morphdom-esm.js";
// import cloneDeep from "lodash.clonedeep";
import { cloneDeep } from "lodash-es";
// console.log(cloneDeep);
// let cloneDeep = require("lodash.clonedeep");
//for now I'm using morphdom to render the contents.
//In the future We will implement our own Virtual Dom called DevDOM which is still  in development
export class Pluton {
  count = 0;
  components = {};
  routerEnabled = false;
  creater$;
  events = {};
  constructor(indexSelector, routeElement, components) {
    this.routeName = routeElement;
    this.routeElement = document.querySelector(routeElement);
    this.indexSelector = document.querySelector(indexSelector);

    this.selectors = [];
    components.forEach((component) => {
      this.addComponent(component);
    });
    this.initialize();

    // this.proxify.bind(this);
  }
  /**this is used to transfer data about app initilization and router Enabled;*/
  startObservable(data) {
    this.creater$ = new devObservable(({ next }) => {
      next(data);
    });
  }

  /**At the beginning of the app,component named 'app'is served;*/
  initialize() {
    this.detachElement.bind(this);
    let entryComponent = this.components["app"];
    if (
      entryComponent.view
        .call(entryComponent, entryComponent)
        .includes(`<${this.routeName}></${this.routeName}>`)
    ) {
      this.routerEnabled = true;
    }
    this.showComponent(entryComponent);
  }
  /**called from constructor*/
  addComponent(component, isClone) {
    if (component.state) {
      // component.state=this.proxify(component,component.state);
      component.rendered = false;
    }
    component.innerComponents = [];
    component.childComponents = [];
    component.global = this;
    component.cloneCount = 0;
    component.propsUpdated = false;

    // Bind methods
    component.setState = this.setState.bind(this.components[component.name]);
    component.setProps = this.setProps.bind(component);
    component.update = this.update.bind(component);
    let selector = component.selector ?? component.name;
    this.selectors.push(selector);
    this.components[component.name] = component;
  }
  //if separate element is passed it means it is a child component so
  // currentComponent value is set only for the global element
  //First of all ShowComponent is called,then updateView then renderView and
  //finally attachEvents
  async showComponent(component, element) {
    if (!element) {
      this.currentComponent = component;
    }
    this.updateView(component, element);
    let thisComponent = element ? this.currentComponent : component;
    // if(component && !element.getAttribute('isHook')){
    // if (element && element.getAttribute("isHook")) {
    //   // console.log(element);
    //   console.log("hook");
    //   component.componentReady.call(component, component);
    //   // console.log(component);
    // }
    if (component.hasOwnProperty("componentReady") && !component.rendered) {
      // console.log(component.componentReady)
      component.componentReady.call(component, component);
      // }
    }
  }

  prevOrigin = {};
  detachElement(a) {
    if (!a.parentElement.parentElement.origin) {
      return;
    }
    let origin = a.parentElement.parentElement.origin;
    if (origin == this.prevOrigin) {
      this.prevOrigin = {};
      return;
    } else {
      this.prevOrigin = origin;
      this.onComponentDetach(origin);
    }
    // console.log(a.parentElement)
  }

  /**renderView actually attaches elements to DOM
   *It renders on each property change... That should be fixed soon.
   *It should be rendered only on the property that is bound to change*/
  renderView = (component, el, tem) => {
    if (el.children.length > 0) {
    } else {
      let div = document.createElement("div");
      el.appendChild(div);
    }
    component.template = el;

    component.props = component.parent?.childProps
      ? component.parent?.childProps[component.currentIndex]
      : [];
    this.renderAfterPropsPassed(component);
    // console.log(el, tem, component);
    try {
      let a = morphdom(
        el.children[0],
        tem,
        {
          onBeforeNodeDiscarded: this.detachElement.bind(this),
          onNodeAdded: () => {
            this.onNodeAdded.bind(component).call(component, el);
          },
        },
        component
      );
    } catch (e) {
      // console.log(e);
    }

    self = this;
    el.origin = component;
  };
  /** Update child component after props are passed to it from parent component */
  renderAfterPropsPassed(component) {
    if (component.parent?.childProps) {
      if (component.propsUpdated) return;
      setTimeout(() => {
        component.update();
        component.propsUpdated = true;
      });
    }
  }

  onNodeAdded(el) {
    let component = this;
    if (!this.rendered) {
      let eventElements = el.querySelectorAll(`[on]`);
      if (!component.rendered && eventElements.length > 0) {
        this.global.attachEvents(component, eventElements);
      }

      component.rendered = true;
    }
  }
  //enents like click is attached through this
  //the syntax of adding event on html will be changed on coming updates and it will be able to pass data
  //for now data cannot be passed through events handling only the reference to the html element which triggered the event will be passed
  attachEvents(component, eventElements) {
    for (let i = 0; i < eventElements.length; i++) {
      let e = eventElements[i];
      let event = e.getAttribute("on");
      let key;
      let reg = /([a-z]+),([aA-zZ]+)/;
      let [, eventtype, actionName] = event.match(reg);
      function passEventThis(actionName, e) {
        e.preventDefault();
        //console.log(this)
        // this.actions[actionName].bind(component);
        this.actions[actionName].call(this, e);
      }
      const ev = (event) => {
        event.preventDefault();
        passEventThis.call(component, actionName, event);
      };
      let a = e.addEventListener(eventtype, ev);
      self = this;
    }
  }
  //this is used for rendering child components with props
  //should be the only method for rendering all child components not only with props in next update
  static html(html, ...objects) {
    let htmlArr = [];
    let finalHtml = "";
    for (let i = 0; i < html.length; i++) {
      htmlArr.push(html[i]);
      if (i < objects.length) {
        if (typeof objects[i] === "object") {
          for (let [k, v] of Object.entries(objects[i])) {
            htmlArr.push(`'${v}'` || "");
          }
        } else {
          htmlArr.push(objects[i]);
        }
      }
    }
    for (let i = 0; i < htmlArr.length; i++) {
      finalHtml = finalHtml.concat(htmlArr[i]);
    }

    // finalHtml= finalHtml.splice('child',1)

    this.setChildProp(self, JSON.parse(objects[0]));
    // console.log(self, objects[0]);

    return finalHtml;
  }

  static setChildProp(p, v) {
    if (!p.childProps) p.childProps = [];
    p.childProps.push(v);
  }

  update() {
    if (self !== this) {
      if (this.childComponents)
        this.childComponents.forEach((c) => (c.propsUpdated = false));
      this.global.updateView(this, this.template);
    }
  }
  /** Update View after calling setState and updating state */
  setState(state) {
    stateProps.forEach((p) => {
      this.state[p] = state[p];
    });
    if (self !== this) {
      this.global.updateView(this, this.template);
    }
  }
  setProps(props) {
    //console.log(state)
    let propss = Object.getOwnPropertyNames(props);
    propss.forEach((p) => {
      if (this.props) {
        this.props[p] = props[p];
      }
    });
    self.updateView(this, this.template);
  }

  newComps = [];

  updateView(component, element) {
    self = component;
    let template = component
      ? component.view.call(component, component)
      : `<h3>Page Not Found</h3>`;

    this.selectors.forEach((s) => {
      if (template.includes(`</${s}>`)) {
        component.innerComponents.push(this.components[s]);
      }
    });

    let renderElem = element
      ? element
      : this.routeElement
      ? this.routeElement
      : this.indexSelector;
    this.renderView(component, renderElem, template);
    if (!this.initialized) {
      this.routeElement = document.querySelector(this.routeName);
      this.initialized = true;
      this.startObservable({
        initialized: true,
        routerEnabled: this.routerEnabled,
      });
    }
    this.handleChildComponents(component, renderElem);

    self = this;
  }

  handleChildComponents(component, renderElem) {
    if (
      component.innerComponents.length > 0 &&
      component.innerComponents.length > component.childComponents.length
    ) {
      component.innerComponents.forEach((c) => {
        component.childSelectors = renderElem.querySelectorAll(c.name);
        component.childSelectors.forEach((elem, i) => {
          let newComp = cloneDeep(c);
          newComp.currentIndex = i;
          newComp.rendered = undefined;
          newComp.name = `${c.name}${(c.cloneCount + 1).toString()}`;
          c.cloneCount++;
          newComp.parent = component;
          this.addComponent(newComp);
          component.childComponents.push(newComp);
          this.showComponent(newComp, component.childSelectors[i]);
        });
      });
    }
  }

  ///Need to handle all the event handlers on component detatch
  //component detatch is only implemented on the elements changed through hash change..
  //inner Components don't have support for onDetatch
  //This should be fixed as soon as possible
  onComponentDetach(component) {
    if (component.componentDetach) {
      component.componentDetach();
    }
    // component.componentDetach?component.componentDetach():''
    this.clearChildComponents(component);
  }
  clearChildComponents(component) {
    component.childComponents.forEach((e, i) => {
      this.clearChildComponents(e);
      //  console.log(component.childComponents[i])
      delete this.components[e.name];

      //  console.log(component.childComponents[i])
    });
    component.cloneCount = 0;
    component.childComponents = [];
    component.childSelectors = [];
    component.innerComponents = [];
  }
}
/** Pluton */
