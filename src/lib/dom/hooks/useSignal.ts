import type { Component } from '@/lib/jsx/jsx-runtime';

type SubscribeCallback<T> = (value: T) => void;
type SignalSetter<T> = (value: T | ((prev: T) => T)) => void;
type Signal<T> = {
    value: T;
    subscribe: (callback: SubscribeCallback<T>) => () => void;
};

interface SignalStorage<T> {
    signal: Signal<T>;
    setter: SignalSetter<T>;
}

interface ComponentFunction extends Component {
    __componentId?: number;
}

interface ComponentContext {
    id: number;
    hookIndex: number;
}

const globalState = {
    nextComponentId: 0,
    currentComponent: null as ComponentContext | null,
    componentStack: [] as ComponentContext[],
};

const componentSignals = new Map<string, SignalStorage<unknown>>();

/**
 * Creates a reactive signal with getter and setter.
 * @template T Signal value type
 * @param {T} initialValue - The initial value of the signal
 * @returns {[Signal<T>, SignalSetter<T>]} A tuple of signal object and setter function
 */
export const createSignal = <T>(initialValue: T): [Signal<T>, SignalSetter<T>] => {
    let value = initialValue;
    const subscribers = new Set<(value: T) => void>();

    const signal: Signal<T> = {
        get value() {
            return value;
        },
        subscribe: (callback: SubscribeCallback<T>) => {
            subscribers.add(callback);
            return () => subscribers.delete(callback);
        },
    };

    const setter: SignalSetter<T> = (newValue) => {
        const nextValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;

        if (Object.is(nextValue, value)) {
            return;
        }

        value = nextValue;

        subscribers.forEach((callback) => {
            callback(value);
        });

        if (typeof window !== 'undefined') {
            document.dispatchEvent(new CustomEvent('signal-update'));
        }
    };

    return [signal, setter];
};

/**
 * Begins the render phase for a component, setting up its context for hooks.
 * @param {ComponentFunction} componentFn - The component function to render
 * @returns {ComponentContext} The context for the current component
 */
export const beginRender = (componentFn: ComponentFunction) => {
    const componentId =
        typeof componentFn.__componentId === 'number'
            ? componentFn.__componentId
            : (componentFn.__componentId = globalState.nextComponentId += 1);

    const context: ComponentContext = {
        id: componentId,
        hookIndex: 0,
    };

    globalState.componentStack.push(context);
    globalState.currentComponent = context;

    return context;
};

/**
 * Ends the render phase for the current component, restoring previous context.
 */
export const endRender = () => {
    globalState.componentStack.pop();
    globalState.currentComponent =
        globalState.componentStack.length > 0
            ? globalState.componentStack[globalState.componentStack.length - 1]
            : null;
};

/**
 * Gets the current component context for hooks.
 * @throws {Error} If called outside of a component render
 * @returns {ComponentContext} The current component context
 */
export const getCurrentComponentContext = () => {
    if (!globalState.currentComponent) {
        throw new Error('hooks is only available in the component');
    }
    return globalState.currentComponent;
};

/**
 * React-like signal hook for function components.
 * @template T Signal value type
 * @param {T} initialValue - The initial value of the signal
 * @returns {[Signal<T>, SignalSetter<T>]} A tuple of signal object and setter function
 */
export const useSignal = <T>(initialValue: T): [Signal<T>, SignalSetter<T>] => {
    const context = getCurrentComponentContext();

    const hookIndex = context.hookIndex + 1;

    const signalKey = `component_${context.id}_hook_${hookIndex}`;

    if (componentSignals.has(signalKey)) {
        const stored = componentSignals.get(signalKey) as SignalStorage<T>;
        return [stored.signal, stored.setter];
    }

    const [signal, setter] = createSignal<T>(initialValue);

    const storage: SignalStorage<T> = { signal, setter };
    componentSignals.set(signalKey, storage as SignalStorage<unknown>);

    return [signal, setter];
};
