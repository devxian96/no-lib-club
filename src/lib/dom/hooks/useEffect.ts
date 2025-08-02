import { getCurrentComponentContext } from './useSignal';

type EffectCallback = () => void | (() => void);
type DependencyList = ReadonlyArray<unknown>;

interface EffectStorage {
    callback: EffectCallback;
    cleanup?: () => void;
    dependencies?: DependencyList;
    hasRun: boolean;
}

const componentEffects = new Map<string, EffectStorage>();

const areDependenciesEqual = (prevDeps?: DependencyList, nextDeps?: DependencyList) => {
    if (prevDeps === undefined && nextDeps === undefined) {
        return false;
    }

    if (prevDeps === undefined || nextDeps === undefined) {
        return false;
    }

    if (prevDeps.length !== nextDeps.length) {
        return false;
    }

    for (let i = 0; i < prevDeps.length; i++) {
        if (!Object.is(prevDeps[i], nextDeps[i])) {
            return false;
        }
    }

    return true;
};

export const useEffect = (callback: EffectCallback, dependencies?: DependencyList) => {
    const context = getCurrentComponentContext();

    context.hookIndex += 1;
    const effectKey = `component_${context.id}_effect_${context.hookIndex}`;

    const existingEffect = componentEffects.get(effectKey);

    const shouldRun =
        !existingEffect || !existingEffect.hasRun || !areDependenciesEqual(existingEffect.dependencies, dependencies);

    if (shouldRun) {
        if (existingEffect?.cleanup) {
            existingEffect.cleanup();
        }

        const cleanup = callback();

        const effectStorage: EffectStorage = {
            callback,
            cleanup: typeof cleanup === 'function' ? cleanup : undefined,
            dependencies: dependencies ? [...dependencies] : undefined,
            hasRun: true,
        };

        componentEffects.set(effectKey, effectStorage);
    }
};
