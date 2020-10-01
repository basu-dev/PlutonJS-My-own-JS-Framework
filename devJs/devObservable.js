
 export class devObservable{
    constructor(observer){
        this.observer=observer
    }
    subscribe({next,error,complete}){
        return this.observer({next,error,complete})
    }
    map(cb=(v)=>v){
         return new Observable(({next,error,complete})=>{
             this.subscribe({
                 next:value=>{
                    next(cb(value))
                 }
             })
         })
    }
    do(cb){
        return new Observable(({next})=>{
            this.subscribe({
                next:(v)=>{
                    cb(v);
                    next(v);
                }
            })
        })
    }
    filter(cb){
        return new Observable(({next})=>{
            this.subscribe({
                next:(value)=>{
                    if(cb(value)){
                        next(value)
                    }
                }
            })
        })
    }
 }
