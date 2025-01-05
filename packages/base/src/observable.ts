//Modified base on https://github.com/gullerya/object-observer/blob/main/src/object-observer.js
const
	INSERT = 'insert',
	UPDATE = 'update',
	DELETE = 'delete',
	REVERSE = 'reverse',
	SHUFFLE = 'shuffle',
	oMetaKey = Symbol.for('object-observer-meta-key-0'),
	validObservableOptionKeys = { async: 1 },
	processObserveOptions = (options:any) => {
		if (!options || typeof options !== 'object') {
			return null;
		}

		const result:any = {};
		const invalidOptions = [];
		for (const [optName, optVal] of Object.entries(options)) {
			if (optName === 'path') {
				if (typeof optVal !== 'string' || optVal === '') {
					throw new Error('"path" option, if/when provided, MUST be a non-empty string');
				}
				result[optName] = optVal;
			} else if (optName === 'pathsOf') {
				if (options.path) {
					throw new Error('"pathsOf" option MAY NOT be specified together with "path" option');
				}
				if (typeof optVal !== 'string') {
					throw new Error('"pathsOf" option, if/when provided, MUST be a string (MAY be empty)');
				}
				result[optName] = options.pathsOf.split('.').filter(Boolean);
			} else if (optName === 'pathsFrom') {
				if (options.path || options.pathsOf) {
					throw new Error('"pathsFrom" option MAY NOT be specified together with "path"/"pathsOf" option/s');
				}
				if (typeof optVal !== 'string' || optVal === '') {
					throw new Error('"pathsFrom" option, if/when provided, MUST be a non-empty string');
				}
				result[optName] = optVal;
			} else {
				invalidOptions.push(optName);
			}
		}
		if (invalidOptions.length) {
			throw new Error(`'${invalidOptions.join(', ')}' is/are not a valid observer option/s`);
		}
		return result;
	},
	observe = function observe(this:any, observer:any, options:any) {		
		if (typeof observer !== 'function') {
			throw new Error(`observer MUST be a function, got '${observer}'`);
		}

		const observers = (<any>this)[oMetaKey].observers;
		if (!observers.some((o:any) => o[0] === observer)) {
			observers.push([observer, processObserveOptions(options)]);
		} else {
			console.warn('observer may be bound to an observable only once; will NOT rebind');
		}
	},
	unobserve = function unobserve(this:any) {
		const observers = (<any>this)[oMetaKey].observers;
		let ol = observers.length;
		if (ol) {
			let al = arguments.length;
			if (al) {
				while (al--) {
					let i = ol;
					while (i--) {
						if (observers[i][0] === arguments[al]) {
							observers.splice(i, 1);
							ol--;
						}
					}
				}
			} else {
				observers.splice(0);
			}
		}
	},
	clearObservers = function unobserve(this:any) {
		(<any>this)[oMetaKey].observers = [];		
	},
	propertiesBluePrint = { __observe: { value: observe }, __unobserve: { value: unobserve }, __clearObservers: {value: clearObservers} },
	prepareObject = (source:any, oMeta:any) => {
		const target:any = Object.defineProperties({}, propertiesBluePrint);
		target[oMetaKey] = oMeta;
		for (const key in source) {
			target[key] = getObservedOf(source[key], key, oMeta);
		}
		return target;
	},
	prepareArray = (source:any, oMeta:any) => {
		let l = source.length;
		const target:any = Object.defineProperties(new Array(l), propertiesBluePrint);
		target[oMetaKey] = oMeta;
		for (let i = 0; i < l; i++) {
			target[i] = getObservedOf(source[i], i, oMeta);
		}
		return target;
	},
	prepareTypedArray = (source:any, oMeta:any) => {
		Object.defineProperties(source, propertiesBluePrint);
		source[oMetaKey] = oMeta;
		return source;
	},
	filterChanges = (options:any, changes:any) => {
		if (!options) {
			return changes;
		}

		let result = changes;
		if (options.path) {
			const oPath = options.path;
			const tempArr: any[] = [];
			result = changes.filter((change:any) => {
				const isValidPath = (change.path || []).every((path: any) => typeof path === 'string');
				if (!isValidPath) return false;
				if (change.path.join('.').startsWith(oPath) && change.type == 'insert')
					tempArr.push(change);
				return change.path.join('.') === oPath;
			});
			if (result.length === 0) {
				result = tempArr;
			}
		} else if (options.pathsOf) {
			const oPathsOf = options.pathsOf;
			const oPathsOfStr = oPathsOf.join('.');
			result = changes.filter((change:any) =>
				(change.path.length === oPathsOf.length + 1 ||
					(change.path.length === oPathsOf.length && (change.type === REVERSE || change.type === SHUFFLE))) &&
				change.path.join('.').startsWith(oPathsOfStr)
			);
		} else if (options.pathsFrom) {
			const oPathsFrom = options.pathsFrom;
			result = changes.filter((change:any) =>
				change.path.join('.').startsWith(oPathsFrom)
			);
		}
		return result;
	},
	callObserverSafe = (listener:any, changes:any) => {
		try {
			listener(changes);
		} catch (e) {
			console.error(`failed to notify listener ${listener} with ${changes}`, e);
		}
	},
	callObserversFromMT = function callObserversFromMT(this: any) {
		const batches = (<any>this).batches;
		(<any>this).batches = null;
		for (const [listener, changes] of batches) {
			callObserverSafe(listener, changes);
		}
	},
	callObservers = (oMeta:any, changes:any) => {
		let currentObservable = oMeta;
		let observers, target, options, relevantChanges, i;
		const l = changes.length;
		do {
			observers = currentObservable.observers;
			i = observers.length;
			while (i--) {
				[target, options] = observers[i];
				relevantChanges = filterChanges(options, changes);

				if (relevantChanges.length) {
					if (currentObservable.options.async) {
						//	this is the async dispatch handling
						if (!currentObservable.batches) {
							currentObservable.batches = [];
							queueMicrotask(callObserversFromMT.bind(currentObservable));
						}
						let rb;
						for (const b of currentObservable.batches) {
							if (b[0] === target) {
								rb = b;
								break;
							}
						}
						if (!rb) {
							rb = [target, []];
							currentObservable.batches.push(rb);
						}
						Array.prototype.push.apply(rb[1], relevantChanges);
					} else {
						//	this is the naive straight forward synchronous dispatch
						callObserverSafe(target, relevantChanges);
					}
				}
			}

			//	cloning all the changes and notifying in context of parent
			if (currentObservable.parent) {
				const clonedChanges = new Array(l);
				for (let j = 0; j < l; j++) {
					clonedChanges[j] = { ...changes[j] };
					clonedChanges[j].path = [currentObservable.ownKey, ...clonedChanges[j].path];
				}
				changes = clonedChanges;
				currentObservable = currentObservable.parent;
			} else {
				currentObservable = null;
			}
		} while (currentObservable);
	},
	getObservedOf = (item:any, key:any, parent:any) => {
		if (!item || typeof item !== 'object') {
			return item;
		} else if (Array.isArray(item)) {
			return new ArrayOMeta({ target: item, ownKey: key, parent: parent }).proxy;
		} else if (ArrayBuffer.isView(item)) {
			return new TypedArrayOMeta({ target: item, ownKey: key, parent: parent }).proxy;
		} else if (item instanceof Date) {
			return item;
		} else {
			return new ObjectOMeta({ target: item, ownKey: key, parent: parent }).proxy;
		}
	},
	proxiedPop = function proxiedPop(this:any) {
		const oMeta = this[oMetaKey],
			target = oMeta.target,
			poppedIndex = target.length - 1;

		let popResult = target.pop();
		if (popResult && typeof popResult === 'object') {
			const tmpObserved = popResult[oMetaKey];
			if (tmpObserved) {
				popResult = tmpObserved.detach();
			}
		}

		const changes = [new Change(DELETE, [poppedIndex], undefined, popResult, this)];
		callObservers(oMeta, changes);

		return popResult;
	},
	proxiedPush = function proxiedPush(this:any) {
		const
			oMeta = this[oMetaKey],
			target = oMeta.target,
			l = arguments.length,
			pushContent = new Array(l),
			initialLength = target.length;

		for (let i = 0; i < l; i++) {
			pushContent[i] = getObservedOf(arguments[i], initialLength + i, oMeta);
			// const item = arguments[i];
			// if (typeof item !== 'object' || item === null) {
			// 	pushContent[i] = getObservedOf(Observe({}), initialLength + i, oMeta);
			// } else {
			// 	pushContent[i] = getObservedOf(item, initialLength + i, oMeta);
			// }
		}
		const pushResult = Reflect.apply(target.push, target, pushContent);

		const changes = [];
		for (let i = initialLength, j = target.length; i < j; i++) {
			changes[i - initialLength] = new Change(INSERT, [i], target[i], undefined, this);
		}

		callObservers(oMeta, changes);

		return pushResult;
	},
	proxiedShift = function proxiedShift(this:any) {
		const
			oMeta = this[oMetaKey],
			target = oMeta.target;
		let shiftResult, i, l, item, tmpObserved;

		shiftResult = target.shift();
		if (shiftResult && typeof shiftResult === 'object') {
			tmpObserved = shiftResult[oMetaKey];
			if (tmpObserved) {
				shiftResult = tmpObserved.detach();
			}
		}

		//	update indices of the remaining items
		for (i = 0, l = target.length; i < l; i++) {
			item = target[i];
			if (item && typeof item === 'object') {
				tmpObserved = item[oMetaKey];
				if (tmpObserved) {
					tmpObserved.ownKey = i;
				}
			}
		}

		const changes = [new Change(DELETE, [0], undefined, shiftResult, this)];
		callObservers(oMeta, changes);

		return shiftResult;
	},
	proxiedUnshift = function proxiedUnshift(this:any) {
		const
			oMeta = this[oMetaKey],
			target = oMeta.target,
			al = arguments.length,
			unshiftContent = new Array(al);

		for (let i = 0; i < al; i++) {
			unshiftContent[i] = getObservedOf(arguments[i], i, oMeta);
		}
		const unshiftResult = Reflect.apply(target.unshift, target, unshiftContent);

		for (let i = 0, l = target.length, item; i < l; i++) {
			item = target[i];
			if (item && typeof item === 'object') {
				const tmpObserved = item[oMetaKey];
				if (tmpObserved) {
					tmpObserved.ownKey = i;
				}
			}
		}

		//	publish changes
		const l = unshiftContent.length;
		const changes = new Array(l);
		for (let i = 0; i < l; i++) {
			changes[i] = new Change(INSERT, [i], target[i], undefined, this);
		}
		callObservers(oMeta, changes);

		return unshiftResult;
	},
	proxiedReverse = function proxiedReverse(this:any) {
		const
			oMeta = this[oMetaKey],
			target = oMeta.target;
		let i, l, item;

		target.reverse();
		for (i = 0, l = target.length; i < l; i++) {
			item = target[i];
			if (item && typeof item === 'object') {
				const tmpObserved = item[oMetaKey];
				if (tmpObserved) {
					tmpObserved.ownKey = i;
				}
			}
		}

		const changes = [new Change(REVERSE, [], undefined, undefined, this)];
		callObservers(oMeta, changes);

		return this;
	},
	proxiedSort = function proxiedSort(this:any, comparator:any) {
		const
			oMeta = this[oMetaKey],
			target = oMeta.target;
		let i, l, item;

		target.sort(comparator);
		for (i = 0, l = target.length; i < l; i++) {
			item = target[i];
			if (item && typeof item === 'object') {
				const tmpObserved = item[oMetaKey];
				if (tmpObserved) {
					tmpObserved.ownKey = i;
				}
			}
		}

		const changes = [new Change(SHUFFLE, [], undefined, undefined, this)];
		callObservers(oMeta, changes);

		return this;
	},
	proxiedFill = function proxiedFill(this:any, filVal:any, start:any, end:any) {
		const
			oMeta = (<any>this)[oMetaKey],
			target = oMeta.target,
			changes = [],
			tarLen = target.length,
			prev = target.slice(0);
		start = start === undefined ? 0 : (start < 0 ? Math.max(tarLen + start, 0) : Math.min(start, tarLen));
		end = end === undefined ? tarLen : (end < 0 ? Math.max(tarLen + end, 0) : Math.min(end, tarLen));

		if (start < tarLen && end > start) {
			target.fill(filVal, start, end);

			let tmpObserved;
			for (let i = start, item, tmpTarget; i < end; i++) {
				item = target[i];
				target[i] = getObservedOf(item, i, oMeta);
				if (i in prev) {
					tmpTarget = prev[i];
					if (tmpTarget && typeof tmpTarget === 'object') {
						tmpObserved = tmpTarget[oMetaKey];
						if (tmpObserved) {
							tmpTarget = tmpObserved.detach();
						}
					}

					changes.push(new Change(UPDATE, [i], target[i], tmpTarget, this));
				} else {
					changes.push(new Change(INSERT, [i], target[i], undefined, this));
				}
			}

			callObservers(oMeta, changes);
		}

		return this;
	},
	proxiedCopyWithin = function proxiedCopyWithin(this:any, dest:any, start:any, end:any) {
		const
			oMeta = (<any>this)[oMetaKey],
			target = oMeta.target,
			tarLen = target.length;
		dest = dest < 0 ? Math.max(tarLen + dest, 0) : dest;
		start = start === undefined ? 0 : (start < 0 ? Math.max(tarLen + start, 0) : Math.min(start, tarLen));
		end = end === undefined ? tarLen : (end < 0 ? Math.max(tarLen + end, 0) : Math.min(end, tarLen));
		const len = Math.min(end - start, tarLen - dest);

		if (dest < tarLen && dest !== start && len > 0) {
			const
				prev = target.slice(0),
				changes = [];

			target.copyWithin(dest, start, end);

			for (let i = dest, nItem, oItem, tmpObserved; i < dest + len; i++) {
				//	update newly placed observables, if any
				nItem = target[i];
				if (nItem && typeof nItem === 'object') {
					nItem = getObservedOf(nItem, i, oMeta);
					target[i] = nItem;
				}

				//	detach overridden observables, if any
				oItem = prev[i];
				if (oItem && typeof oItem === 'object') {
					tmpObserved = oItem[oMetaKey];
					if (tmpObserved) {
						oItem = tmpObserved.detach();
					}
				}

				if (typeof nItem !== 'object' && nItem === oItem) {
					continue;
				}
				changes.push(new Change(UPDATE, [i], nItem, oItem, this));
			}

			callObservers(oMeta, changes);
		}

		return this;
	},
	proxiedSplice = function proxiedSplice(this:any) {
		const
			oMeta = this[oMetaKey],
			target = oMeta.target,
			splLen = arguments.length,
			spliceContent = new Array(splLen),
			tarLen = target.length;

		//	observify the newcomers
		for (let i = 0; i < splLen; i++) {
			spliceContent[i] = getObservedOf(arguments[i], i, oMeta);
		}

		//	calculate pointers
		const
			startIndex = splLen === 0 ? 0 : (spliceContent[0] < 0 ? tarLen + spliceContent[0] : spliceContent[0]),
			removed = splLen < 2 ? tarLen - startIndex : spliceContent[1],
			inserted = Math.max(splLen - 2, 0),
			spliceResult: any = Reflect.apply(target.splice, target, spliceContent),
			newTarLen = target.length;

		//	reindex the paths
		let tmpObserved;
		for (let i = 0, item; i < newTarLen; i++) {
			item = target[i];
			if (item && typeof item === 'object') {
				tmpObserved = item[oMetaKey];
				if (tmpObserved) {
					tmpObserved.ownKey = i;
				}
			}
		}

		//	detach removed objects
		let i, l, item;
		for (i = 0, l = spliceResult.length; i < l; i++) {
			item = spliceResult[i];
			if (item && typeof item === 'object') {
				tmpObserved = item[oMetaKey];
				if (tmpObserved) {
					spliceResult[i] = tmpObserved.detach();
				}
			}
		}

		const changes = [];
		let index;
		for (index = 0; index < removed; index++) {
			if (index < inserted) {
				changes.push(new Change(UPDATE, [startIndex + index], target[startIndex + index], spliceResult[index], this));
			} else {
				changes.push(new Change(DELETE, [startIndex + index], undefined, spliceResult[index], this));
			}
		}
		for (; index < inserted; index++) {
			changes.push(new Change(INSERT, [startIndex + index], target[startIndex + index], undefined, this));
		}
		callObservers(oMeta, changes);

		return spliceResult;
	},
	proxiedTypedArraySet = function proxiedTypedArraySet(this:any, source:any, offset:any) {
		const
			oMeta = this[oMetaKey],
			target = oMeta.target,
			souLen = source.length,
			prev = target.slice(0);
		offset = offset || 0;

		target.set(source, offset);
		const changes = new Array(souLen);
		for (let i = offset; i < (souLen + offset); i++) {
			changes[i - offset] = new Change(UPDATE, [i], target[i], prev[i], this);
		}

		callObservers(oMeta, changes);
	},
	proxiedArrayMethods = {
		pop: proxiedPop,
		push: proxiedPush,
		shift: proxiedShift,
		unshift: proxiedUnshift,
		reverse: proxiedReverse,
		sort: proxiedSort,
		fill: proxiedFill,
		copyWithin: proxiedCopyWithin,
		splice: proxiedSplice
	},
	proxiedTypedArrayMethods = {
		reverse: proxiedReverse,
		sort: proxiedSort,
		fill: proxiedFill,
		copyWithin: proxiedCopyWithin,
		set: proxiedTypedArraySet
	};

class Change {
	type: any;
	path: any;
	value: any;
	oldValue: any;
	object: any;
	constructor(type:any, path:any, value:any, oldValue:any, object:any) {
		this.type = type;
		this.path = path;
		this.value = value;
		this.oldValue = oldValue;
		this.object = object;
	}
}

class OMetaBase {
	parent: any;
	ownKey: any;
	observers: any;
	revocable: any;
	proxy: any;
	target: any;
	options: any;
	constructor(properties:any, cloningFunction:any) {
		const { target, parent, ownKey } = properties;
		if (parent && ownKey !== undefined) {
			this.parent = parent;
			this.ownKey = ownKey;
		} else {
			this.parent = null;
			this.ownKey = null;
		}
		const targetClone = cloningFunction(target, this);
		this.observers = [];
		this.revocable = Proxy.revocable(targetClone, this);
		this.proxy = this.revocable.proxy;
		this.target = targetClone;
		this.options = this.processOptions(properties.options);
	}

	processOptions(options:any) {
		if (options) {
			if (typeof options !== 'object') {
				throw new Error(`Observable options if/when provided, MAY only be an object, got '${options}'`);
			}
			const invalidOptions = Object.keys(options).filter(option => !(option in validObservableOptionKeys));
			if (invalidOptions.length) {
				throw new Error(`'${invalidOptions.join(', ')}' is/are not a valid Observable option/s`);
			}
			return Object.assign({}, options);
		} else {
			return {};
		}
	}

	detach() {
		this.parent = null;
		return this.target;
	}

	set(target:any, key:any, value:any) {
		let oldValue = target[key];

		if (value !== oldValue) {
			const newValue = getObservedOf(value, key, this);
			target[key] = newValue;

			if (oldValue && typeof oldValue === 'object') {
				const tmpObserved = oldValue[oMetaKey];
				if (tmpObserved) {
					oldValue = tmpObserved.detach();
				}
			}

			const changes = oldValue === undefined
				? [new Change(INSERT, [key], newValue, undefined, this.proxy)]
				: [new Change(UPDATE, [key], newValue, oldValue, this.proxy)];
			callObservers(this, changes);
		}

		return true;
	}

	deleteProperty(target:any, key:any) {
		let oldValue = target[key];

		delete target[key];

		if (oldValue && typeof oldValue === 'object') {
			const tmpObserved = oldValue[oMetaKey];
			if (tmpObserved) {
				oldValue = tmpObserved.detach();
			}
		}

		const changes = [new Change(DELETE, [key], undefined, oldValue, this.proxy)];
		callObservers(this, changes);

		return true;
	}
}

class ObjectOMeta extends OMetaBase {
	constructor(properties:any) {
		super(properties, prepareObject);
	}

	// get(target:any, key:any){
	// 	if (this.parent instanceof ArrayOMeta) {
	// 		if (key === '__target')
	// 			return this.target;
	// 		else if (key === '__path')
	// 			return this.ownKey !== undefined ? [this.ownKey] : [];
	// 		else if (key === '$renderElms' && this.target.__target)
	// 			return this.target.__target.$renderElms;
	// 	}
	// 	return <any>target[key];
	// }
}

class ArrayOMeta extends OMetaBase {
	constructor(properties:any) {
		super(properties, prepareArray);
	}

	get(target:any, key:any) {
		return (<any>proxiedArrayMethods)[key] || target[key];
	}
}

class TypedArrayOMeta extends OMetaBase {
	constructor(properties:any) {
		super(properties, prepareTypedArray);
	}

	get(target:any, key:any){
		return (<any>proxiedTypedArrayMethods)[key] || target[key];
	}
}

const Observable = Object.freeze({
	from: (target:any, options?:any) => {
		if (!target || typeof target !== 'object') {
			throw new Error('observable MAY ONLY be created from a non-null object');
		} else if (target[oMetaKey]) {
			return target;
		} else if (Array.isArray(target)) {
			return new ArrayOMeta({ target: target, ownKey: null, parent: null, options: options }).proxy;
		} else if (ArrayBuffer.isView(target)) {
			return new TypedArrayOMeta({ target: target, ownKey: null, parent: null, options: options }).proxy;
		} else if (target instanceof Date) {
			throw new Error(`${target} found to be one of a non-observable types`);
		} else {
			return new ObjectOMeta({ target: target, ownKey: null, parent: null, options: options }).proxy;
		}
	},
	isObservable: (input:any) => {
		return !!(input && input[oMetaKey]);
	}
});
export function isObservable(input: any): boolean{
	return !!(input && input[oMetaKey]);
}
export interface ObserverOptions {
	path?: string;
	pathsOf?: string;
	pathFrom?: string
}
export interface ObserverChange{
	type?: string;
	path?: string[];
	value?: any;
	oldValue?: any;
	object?: any;
}
export type ObserverCallback = (changes: ObserverChange[])=>void;
export function Observe(target:any, callback?: ObserverCallback, options?: ObserverOptions): any{
	if (!target)
		return;
	if (!!(target && target[oMetaKey])){		
		if (callback)
			target.__observe(callback, options)
		return target;
	};
	let result;
	if (!target || typeof target !== 'object') {
		throw new Error('observable MAY ONLY be created from a non-null object');
	} else if (target[oMetaKey]) {
		result = target;
	} else if (Array.isArray(target)) {
		result = new ArrayOMeta({ target: target, ownKey: null, parent: null}).proxy;
	} else if (ArrayBuffer.isView(target)) {
		result = new TypedArrayOMeta({ target: target, ownKey: null, parent: null}).proxy;
	} else if (target instanceof Date) {
		throw new Error(`${target} found to be one of a non-observable types`);
	} else {
		result = new ObjectOMeta({ target: target, ownKey: null, parent: null}).proxy;
	}
	if (callback)
		result.__observe(callback, options);
	return result;
}
export function Unobserve(target: any, observer: ObserverCallback): void{	
	if (!target)
		return;
	if (!!(target && target[oMetaKey])){
		target.__unobserve(observer);
	}
}
export function ClearObservers(target: any): void{
	if (!target)
		return;
	if (!!(target && target[oMetaKey])){
		target.__clearObservers();
	}
}
export function observable(propName?: string, isArray?: boolean) {	
	return function(target: any, propertyName: string) {		
		target['$observableProps'] = target['$observableProps'] || {};
		target['$observableProps'][propName || propertyName] = {
			propertyName: propertyName,
			isArray: isArray
		};
	}
	// return function(target: any, propertyName: string) {		
	// 	target['$observables'] = target['$observables'] || {};
	// 	let val = Observe({});		
	// 	let isObject = false;
	// 	target['$observables'][propName || propertyName] = val;
	// 	const getter = function() {			
	// 		if (isObject)
	// 			return val
	// 		else{
	// 			return val.value;
	// 		}
	// 	};
	// 	const setter = function(newVal: any) {
	// 		if (typeof(newVal) == 'object'){
	// 			isObject = true;
	// 			Object.assign(val, newVal)
	// 		}
	// 		else{
	// 			isObject = false;
	// 			val.value = newVal
	// 		}
	// 	};
	// 	Object.defineProperty(target, propertyName, {
	// 		get: getter,
	// 		set: setter
	// 	}); 
	// }
}

export function initObservables(target: any){
	let observables = target['$observableProps'];
	target['$observables'] = target['$observables'] || {};
	for (let propName in observables){
		let propertyName = observables[propName]?.propertyName;
		let isArray = observables[propName]?.isArray;
		let val = isArray ? Observe([]): Observe({});
		let isObject = false;
		target['$observables'][propName] = val;

		const getter = function() {			
			if (isObject)
				return val
			else{
				return val.value;
			}
		};

		const setter = function(newVal: any) {
			if (typeof(newVal) == 'object'){
				isObject = true;
				if (Array.isArray(newVal) && isArray){
					if (val.length === 0 && newVal.length > 0){
						Object.assign(val, newVal);
						return;
					}
					if (val.length > 0 && newVal.length === 0){
						val.length = 0;
						return;
					}
					if (val.length > 0 && newVal.length > 0){
						val.splice(0, val.length, ...newVal);
						return;
					}
				} else {
					Object.assign(val, newVal);
				}
			}
			else{
				isObject = false;
				val.value = newVal
			}
		};
		Object.defineProperty(target, propertyName, {
			get: getter,
			set: setter
		}); 
	}	
}

export function Observables(target: any, propertyName?: string) {		
	let result = target['$observables'] || {};	
	if (propertyName){
		return result[propertyName]
	}
	else
		return result;
}
// const
// 	callbackKey = Symbol('callback-key'),
// 	targetsKey = Symbol('targets-key');
// class ObjectObserver {
// 	constructor(callback:any) {
// 		(<any>this)[callbackKey] = callback;
// 		(<any>this)[targetsKey] = new Set();
// 		Object.freeze(this);
// 	}

// 	observe(target:any, config:any) {
// 		const r = Observable.from(target);
// 		r.__observe((<any>this)[callbackKey], config);
// 		(<any>this)[targetsKey].add(r);
// 		return r;
// 	}
// 	unobserve(target:any) {
// 		target.__unobserve((<any>this)[callbackKey]);
// 		(<any>this)[targetsKey].delete(target);
// 	}

// 	disconnect() {
// 		for (const t of (<any>this)[targetsKey]) {
// 			t.__unobserve((<any>this)[callbackKey]);
// 		}
// 		(<any>this)[targetsKey].clear();
// 	}
// }