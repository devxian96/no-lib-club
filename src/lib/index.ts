import type { VNode } from '@/lib/jsx/jsx-runtime';
export { useSignal, createSignal } from '@/lib/dom/hooks/useSignal';
export { useEffect } from '@/lib/dom/hooks/useEffect';

export type Children = VNode | VNode[];
export type PropsWithChildren<T = object> = T & {
    children?: Children;
};
