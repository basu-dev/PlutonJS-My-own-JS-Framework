//Component with Name 'app' is compulsory. This is the entry

import { nav } from "./nav.js";

//point of the app.
//be aware while using arrow function
let a;
export const app={
    name:'app',
    children:[
        nav
    ],  
    state:{
        showform:true
    },
    componentReady(){
        console.log('App component bootstrapped')
    },
    actions:{
        apple(a){
            console.log(this)
            console.log(a)
            return 'a'
        }
    },
    view(a,b){
        console.log(this)
        return `
        <div>
        <nav></nav>
       <myForm></myForm>
       <myForm></myForm>

    </div>
    `
    }
}