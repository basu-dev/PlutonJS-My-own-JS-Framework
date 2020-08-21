export class Router {
  routes = {};
  defualtRoute;
  hashChangeEnabled=false;
  constructor(devApp,route) {
    this.app = devApp;
    route.forEach(({routeName,componentName,isDefault})=>{
        this.addRoute(routeName,componentName,isDefault)
    })
    window.addEventListener('hashchange',this.hashChanged)
    this.initialize();
  }
  addRoute = (routeName, componentName, isDefault) => {
    this.routes[routeName] = this.app.components[componentName];
    if (isDefault) {
      this.routes["default"] = this.app.components[componentName];
    }   
  };
  initialize() {
    this.app.creater$
      .subscribe({
        next: ({ initialized, routerEnabled }) => {
          if (initialized && routerEnabled) {
            this.hashChangeEnabled=true;
            this.hashChanged();
          } 
        }
      });
  }
  hashChanged = () => {
      if(this.hashChangeEnabled){
        let hashvalue = window.location.hash.split("#")[1];
        if (hashvalue) {
          let routeName = hashvalue.split("/")[1];
          let component = this.routes[routeName];
          if (component) {
            this.app.showComponent(component);
          } else {
            component = this.routes["default"];
            this.app.showComponent(component);
          }
        }
        else{
          let component=this.routes['default'];
          this.app.showComponent(component)
        }
      }
  };
}
