import 'mocha';
import * as assert from 'assert';
import {Observe, Unobserve, ClearObservers, ObserverChange, Observables, observable} from '../src/observable';

class Test {
    @observable()
    public value1: any;
    @observable()
    public value2: number;
    public value3: string;
}
describe('Observable', function() {    
    it ('Class observables', function(){
        let test = new Test();         
        test.value1 = {
            name: 'ycwong',
            address: {
                city: 'hk'
            }
        };    
        let changeCount = 0;
        Observe(Observables(test, 'value1'), function(changes){
            changeCount++;
            assert.deepStrictEqual(changes[0].path, ['name']);
            assert.strictEqual(changes[0].value, 'yc');            
        })
        test.value1.name = 'yc';

        ClearObservers(Observables(test, 'value1'));
        Observe(Observables(test, 'value1'), function(changes){
            changeCount++;
            assert.deepStrictEqual(changes[0].path, ['address','city']);            
            assert.strictEqual(changes[0].value, 'shatin');            
        })
        test.value1.address.city = 'shatin';

        Observe(Observables(test, 'value2'), function(changes){
            changeCount++;
            assert.strictEqual(changes[0].value, 3);
        })    
        test.value2 = 3;

        //not observable
        Observe(Observables(test, 'value3'), function(changes){
            changeCount++;            
        })    
        test.value3 = 'abc';
        assert.strictEqual(changeCount, 3);
    })
    it ('update', function(){        
        let changeCount = 0;
        let lastChange: ObserverChange = {};
        const order = { type: 'book', pid: 102, ammount: 5, remark: 'remove me' };
        const observableOrder = Observe(order);

        let observer = function(changes: ObserverChange[]){                
            changes.forEach((change) => {            
                lastChange = change;
                changeCount++
            });
        }
        Observe(observableOrder, observer);
        observableOrder.ammount = 7;            
        //  { type: 'update', path: ['ammount'], value: 7, oldValue: 5, object: observableOrder }
        assert.strictEqual(lastChange.type, 'update');
        assert.deepStrictEqual(lastChange.path, ['ammount']);
        assert.strictEqual(lastChange.value, 7);
        assert.strictEqual(lastChange.oldValue, 5);        
        assert.strictEqual(changeCount, 1);
        Unobserve(observableOrder, observer);
        observableOrder.ammount = 8;
        assert.strictEqual(changeCount, 1);
    })            
    it ('insert object', function(){             
        let changeCount = 0;
        let lastChange: ObserverChange = {};
        const order = { type: 'book', pid: 102, ammount: 5, remark: 'remove me' };
        const observableOrder = Observe(order);

        let observer = function(changes: ObserverChange[]){                
            changes.forEach((change) => {                         
                lastChange = change;
                changeCount ++;
            });
        }
        Observe(observableOrder, observer);
        observableOrder.address = {
            street: 'Str 75',
            apt: 29
        };
        //  { type: "insert", path: ['address'], value: {street: "Str 75", apt: 29}, object: observableOrder }
        assert.strictEqual(lastChange.type, 'insert');
        assert.deepStrictEqual(lastChange.path, ['address']);
        assert.deepStrictEqual({street: lastChange.value.street,apt: lastChange.value.apt}, {street: "Str 75", apt: 29});
        assert.strictEqual(changeCount, 1);

        //  { type: "update", path: ['address','apt'], value: 30, oldValue: 29, object: observableOrder.address }
        observableOrder.address.apt ++;
        assert.strictEqual(lastChange.type, 'update');
        assert.deepStrictEqual(lastChange.path, ['address', 'apt']);
        assert.strictEqual(lastChange.value, 30);
        assert.strictEqual(changeCount, 2);
    })
    it ('observe path', function(){     
        let changeCount = 0;
        let lastChange: ObserverChange = {};
        const order = { type: 'book', pid: 102, ammount: 5, remark: 'remove me', address: {apt: 30, street: 'Str 70'} };
        const observableOrder = Observe(order);

        let observer = function(changes: ObserverChange[]){                
            changes.forEach((change) => {            
                lastChange = change;
                changeCount++
            });
        }
        Observe(observableOrder, observer, {path: 'address.street'});
        let currChangeCount = changeCount;
        observableOrder.address.apt = 31;
        assert.strictEqual(changeCount, currChangeCount);
        observableOrder.address.street = 'Str 80';
        assert.strictEqual(lastChange.type, 'update');
        assert.deepStrictEqual(lastChange.path, ['address', 'street']);
        assert.strictEqual(lastChange.value, 'Str 80');        
    })     
})
