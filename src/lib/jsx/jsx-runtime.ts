export interface VDom {
    type: string;
    props?: Record<string, unknown>;
    children: VNode[];
}

export type VNode = string | number | VDom | null | undefined;

export type Component = (props?: VDom['props']) => VNode;

import { beginRender, endRender } from '@/lib/dom/hooks/useSignal';

export const h = (component: Component | string, props: VDom['props'] = {}, ...children: VNode[]) => {
    if (typeof component === 'function') {
        try {
            beginRender(component);
            const propsWithChildren = {
                ...props,
                children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children,
            };
            return component(propsWithChildren);
        } finally {
            endRender();
        }
    }

    return { component, props, children: children.flat() };
};
