import {Service} from "../Service.js"
import {devJS} from "../../devJs/devJs.js"
import { child } from "./child.js";
export const parent={
    name:'parent',
    state:{
        users:[]
    },
    componentReady(){
        console.log(this)
        let a=new Service();
     a.get().then(res=>{
            this.setState({
                users:res
            })
        })  
    },
    view:(component)=>{
        let {state}=component
        console.log(state)
        let list=state.users.map((u)=>{ 
            return devJS.html`<child isHook='true' prop="${u}"></child>`
        })
        return `<div class="container">
        <div>This is parent element which passed all these values </div>
            ${list}
        </div>`
    }
}