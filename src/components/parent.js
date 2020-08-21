import {Service} from "../Service.js"
import {devJS} from "../../devJs/devJs.js"
import { child } from "./child.js";
export const parent={
    name:'parent',
    state:{
        users:[]
    },
    childrens:[
        child
    ],
    componentReady(){
        console.log('Parent Ready')
        let a=new Service();
     a.get().then(res=>{
            this.setState({
                users:res
            })
        })  
    },
    actions:{
        fromChild:(child)=>{
            console.log("from Child",child)
        }
    },
    view(){
        let {state}=this
        let list=state.users.map((u)=>{ 
            return devJS.html`<child isHook='true' prop="${u}"></child>`
        })
        return `<div class="container">
        <div>This is parent element which passed all these values </div>
            ${list}
        </div>`
    }
}