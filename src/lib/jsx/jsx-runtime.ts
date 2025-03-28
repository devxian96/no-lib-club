export interface VDom {
    type: string;
    props?: Record<string, unknown>;
    children: VNode[];
}

export type VNode = string | number | VDom | null | undefined;

export type Component = (props?: VDom['props']) => VNode;

import { beginRender, endRender } from '@/lib/dom/hooks/useSignal';

export const h = (component: Component, props: VDom['props'], ...children: VNode[]) => {
    if (typeof component === 'function') {
        try {
            beginRender(component);
            return component(props);
        } finally {
            endRender();
        }
    }

    return { component, props, children: children.flat() };
};
