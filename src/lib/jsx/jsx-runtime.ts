export interface VDom {
    type: string;
    props?: Record<string, unknown>;
    children: VNode[];
}
export type VNode = string | number | VDom | null | undefined;

export type Component = (props?: VDom['props']) => VNode;

export const h = (component: Component, props: VDom['props'], ...children: VNode[]) => {
    if (typeof component === 'function') {
        return component(props);
    }

    return { component, props, children: children.flat() };
};
