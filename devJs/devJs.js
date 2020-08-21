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
    components.forEach((component) => {
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
    this.detachElement.bind(this);
    let entryComponent = this.components["app"];
    if (
      entryComponent
        .view.call(entryComponent,
          entryComponent
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
    component.innerComponents = [];
    component.childComponents = [];
    component.global = this;
    component.setState = this.setState.bind(component);
    component.setProps = this.setProps.bind(component);
//  component.actions?Object.keys(component.actions).forEach(i=>{
//    component.actions[i].bind(component);
//  }):''
   
  //  component.view.bind(component)
    component.cloneCount = 0;
    // if (component.props) {
    //   component.props = this.proxify(component.component.props);
    // }
    let selector = component.selector ? component.name : component.name;
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
    if (element && element.getAttribute("isHook")) {
      console.log("hook");
    } else if (
      component.hasOwnProperty("componentReady") &&
      !component.rendered
    ) {
      // console.log(component.componentReady)
      component.componentReady.call(component ,component);
      // }
    }
  }
  //renderView actually attaches elements to DOM
  //It renders on each property change... That should be fixed soon.
  //It should be rendered only on the property that is bound to change
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
  renderView = (component, el, tem) => {
    // console.log('render View Called')
    // //console.log('rendering',component.name)
    if (el.children.length > 0) {
    } else {
      let div = document.createElement("div");
      el.appendChild(div);
    }
    component.template = el;
    component.props = component.attributes;

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
    self = this;
    el.origin = component;
  };
  onNodeAdded(el) {
    let component = this;
    if (!this.rendered) {
      let eventElements = el.querySelectorAll(`[on]`);
      if (!component.rendered && eventElements.length > 0) {
        this.global.attachEvents(component, eventElements);
        component.rendered = true;
      }
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
      function passEventThis( actionName, e) {
        //console.log(this)
        // this.actions[actionName].bind(component);
        this.actions[actionName].call(this, this, e);
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

    this.setChildProp(self, objects);
    return finalHtml;
  }

  static setChildProp(p, v) {
    let i = p.childComponents.length;
    let TI = setInterval(() => {
      i = p.childComponents.length;
      if (i > 0) {
        clearInterval(TI);
        
        let len = p.childComponents.length;
        for (let j = 0; j < len; j++) {
          let childComp=p.childComponents[j];
          if (p.childComponents[j].props == undefined) {
            console.log(`props of ${p.childComponents[j].name} is undefined`);
            p.childComponents[j].props = v[0];
            console.log(v)
            console.log(`props is now`, p.childComponents[j].props.name);
            if(!childComp.rendered){
              p.childComponents[j].componentReady.call(childComp,childComp);
            }
            break;
          }
        }
      }
    });
  }
  setState(state) {
    //console.log(state)
    let stateProps = Object.getOwnPropertyNames(state);
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
  updateView(component, element) {
    let methods = component.actions ? component.actions : null;
    let props = component.props ? component.props : null;
    self = component;
    let template = component
      ? component.view.call(component,component)
      : `<h3>Page Not Found</h3>`;

    this.selectors.forEach((s) => {
      if (template.includes(`</${s}>`)) {
        // console.log(component.innerComponents)
        component.innerComponents.push(this.components[s]);
      }
    });
    // if (component.children) {
    //   console.log(component.children);
    //   component.childern.forEach((c) => {
    //     if (template.includes(`</${c}>`)) {
    //       component.innerComponents.push(c);
    //     }
    //   });
    // }

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

    if (
      component.innerComponents.length > 0 &&
      component.innerComponents.length > component.childComponents.length
    ) {
      component.innerComponents.forEach((c) => {
        component.childSelectors = renderElem.querySelectorAll(c.name);
        //console.log(innerComps)
        component.childSelectors.forEach((elem, i) => {
          let newComp = { ...c };
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

    self = this;
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
