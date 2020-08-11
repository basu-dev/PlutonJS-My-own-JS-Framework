export class devObservable{
    constructor(observer){
        this.observer=observer
    }
    subscribe({next,error,completed}){
        this.observer({next,error,completed})
    }
}