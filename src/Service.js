
import "../src/main.js"
export class Service{
    constructor(){
        this.dataEndPoint="http://localhost:3000/data";
    }
    get(){
       return fetch(this.dataEndPoint).then(e=>e.json()
        )
    }
}