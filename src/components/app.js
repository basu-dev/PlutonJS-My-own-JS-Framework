//Component with Name 'app' is compulsory. This is the entry
//point of the app.
let a;
export const app={
    constructor(){},
    name:'app',
    state:{
        showform:true
    },
    conmponentReady(){
        console.log('App component bootstrapped')
    },
    
    actions:{
        apple:(a)=>{
            console.log(a)
        }
    },
    view:({state,props,actions})=>{
        return `
        <div>
        <nav></nav>
       <router></router>
    </div>
    `
    }
}