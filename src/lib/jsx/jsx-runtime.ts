export interface VDom {
    type: string;
    props?: Record<string, unknown>;
    children: VNode[];
}

export type VNode = string | number | VDom | null | undefined;

export type Component = (props?: VDom['props']) => VNode;

import { beginRender, endRender } from '@/lib/dom/hooks/useSignal';

/**
 * Hyperscript function to create VNodes or invoke components.
 * @param {Component | string} component - Component function or tag name
 * @param {VDom['props']} [props={}] - Props for the component or element
 * @param {...VNode[]} children - Child nodes
 * @returns {VNode} The resulting virtual node
 */
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
