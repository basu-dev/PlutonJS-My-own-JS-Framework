import { devObservable } from "./devObservable.js";
import morphdom from "./dist/morphdom-esm.js";
//for now I'm using morphdom to render the contents.
//In the future We will implement our own Virtual Dom called DevDOM which is still  in development
export class devJS {
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
    components.forEach(component => {
      this.addComponent(component);
    });
    this.initialize();
    // this.proxify.bind(this);
  }
  //this is used to transfer data about app initilization and router Enabled;
  startObservable(data) {
    this.creater$ = new devObservable(({ next }) => {
      next(data);
    });
  }
  //At the beginning of the app,component named 'app'is served;
  initialize() {
    let entryComponent = this.components["app"];
    if (
      entryComponent
        .view(
          entryComponent.state,
          entryComponent.props,
          entryComponent.actions
        )
        .includes(`<${this.routeName}></${this.routeName}>`)
    ) {
      this.routerEnabled = true;
    }
    this.showComponent(entryComponent);
  }
  //called from constructor
  addComponent(component, isClone) {
    if (component.state) {
      // component.state=this.proxify(component,component.state);
      component.rendered = false;
    }
    component.parent = this;
    component.setState = this.setState.bind(component);
    component.setProps = this.setProps.bind(component);
    component.cloneCount = 0;
    // if (component.props) {
    //   component.props = this.proxify(component.component.props);
    // }
    let selector = component.selector ? component.name : component.name;
    this.selectors.push(selector);
    this.components[component.name] = component;
  }
  //if separate element is passed it means it is a child component so
  // currentComponent value is set only for the parent element
  //First of all ShowComponent is called,then updateView then renderView and
  //finally attachEvents
  async showComponent(component, element) {
    if (!element) {
      this.currentComponent = component;
    }
    this.updateView(component, element);
    let thisComponent = element ? this.currentComponent : component;
    console.log(element);
    // if(component && !element.getAttribute('isHook')){
    if (component.hasOwnProperty("componentReady")) {
      component.componentReady.bind(component);
      component.componentReady(component.state);
      // }
    }
  }
  //renderView actually attaches elements to DOM
  //It renders on each property change... That should be fixed soon.
  //It should be rendered only on the property that is bound to change
  renderView = (component, el, tem) => {
    // //console.log('rendering',component.name)
    if (el.children.length > 0) {
    } else {
      let div = document.createElement("div");
      el.appendChild(div);
    }
    component.template = el;
    component.props = component.attributes;
    //console.log("FROM",el.children[0],"TO",tem)
    let a = morphdom(el.children[0], tem);
    // //console.log("from morphdom ",a);
    let eventElements = el.children[0].querySelectorAll(`[on]`);
    if (!component.rendered) {
      component.rendered = true;
      this.attachEvents(component, eventElements);
    }
  };
  //enents like click is attached through this
  //the syntax of adding event on html will be changed on coming updates and it will be able to pass data
  //for now data cannot be passed through events handling only the reference to the html element which triggered the event will be passed
  attachEvents(component, eventElements) {
    for (let i = 0; i < eventElements.length; i++) {
      let e = eventElements[i];
      let event = e.getAttribute("on");
      let key;
      let [eventtype, action] = event.split(",");
      let [actionName, value] = action.split("(");
      function passEventThis(component, actionName, e) {
        //console.log(this)
        this.actions[actionName].bind(component);
        this.actions[actionName].apply(this, [this, e]);
      }
      const ev = event => {
        event.preventDefault();
        passEventThis.call(component, component, actionName, event);
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
    let index = finalHtml.indexOf(" ");
    // console.log(finalHtml)

    this.setChildProp(self, objects);
    return finalHtml;
  }

  static setChildProp(p, v) {
    let i = p.childComponents.length;
    let TI = setInterval(() => {
      i = p.childComponents.length;
      if (i > 0) {
        clearInterval(TI);
        for (let j = 0; j < p.childComponents.length; j++) {
          if (p.childComponents[j].props == undefined) {
            p.childComponents[j].props = v;
            p.childComponents[j].componentReady();
            return;
          }
        }
      }
    });
  }

  setState(state) {
    //console.log(state)
    let stateProps = Object.getOwnPropertyNames(state);
    stateProps.forEach(p => {
      this.state[p] = state[p];
    });
    self.updateView(this, this.template);
  }
  setProps(props) {
    //console.log(state)
    let propss = Object.getOwnPropertyNames(props);
    propss.forEach(p => {
      if (this.props) {
        this.props[p] = props[p];
      }
    });
    self.updateView(this, this.template);
  }
  updateView(component, element) {
    let methods = component.actions ? component.actions : null;
    let props = component.props ? component.props : null;
    self = component;
    let template = component
      ? component.view(component)
      : `<h3>Page Not Found</h3>`;
    let innerComponents = [];
    component.childComponents = [];
    this.selectors.forEach(s => {
      if (template.includes(`</${s}>`)) {
        innerComponents.push(this.components[s]);
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
        routerEnabled: this.routerEnabled
      });
    }
    if (innerComponents.length > 0) {
      innerComponents.forEach(c => {
        let innerComps = renderElem.querySelectorAll(c.name);
        //console.log(innerComps)
        innerComps.forEach((elem, i) => {
            //there is some problem to be fixed
          if (component.childComponents) {
            //   console.log(elem.children)
            let newComp = { ...c };
            newComp.rendered = undefined;
            newComp.name = `${c.name}${(c.cloneCount + 1).toString()}`;
            c.cloneCount++;
            this.addComponent(newComp);
            component.childComponents.push(newComp);

            this.showComponent(newComp, innerComps[i]);
          }
        });
      });
    }
    self = this;
  }
  ///Need to handle all the event handlers on component detatch
  //component detatch is only implemented on the elements changed through hash change..
  //inner Components don't have support for onDetatch
  //This should be fixed as soon as possible
  onComponentDetach() {
    if (this.currentComponent.componentDetach) {
      this.currentComponent.componentDetach();
    }
    this.currentComponent.childComponents.forEach((e, i) => {
      console.log(e);
      //  console.log(this.currentComponent.childComponents[i])
      delete this.components[e.name];
      //  console.log(this.currentComponent.childComponents[i])
    });
    this.currentComponent.childComponents = [];
  }
}
