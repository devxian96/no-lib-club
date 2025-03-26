import { createElement } from '.';
import type { VNode, VDom } from '@/lib/jsx/jsx-runtime';

let currentVDom: VNode | null = null;

const isVDom = (node: VNode): node is VDom => {
    return node !== null && node !== undefined && typeof node === 'object' && 'type' in node && 'children' in node;
};

const diff = (oldNode: VNode, newNode: VNode): boolean => {
    if (oldNode === newNode) return false;
    if (oldNode === null || newNode === null) return true;
    if (oldNode === undefined || newNode === undefined) return true;
    if (typeof oldNode !== typeof newNode) return true;

    if (typeof oldNode === 'string' || typeof oldNode === 'number') {
        return oldNode !== newNode;
    }

    if (isVDom(oldNode) && isVDom(newNode)) {
        if (oldNode.type !== newNode.type) return true;
        if (oldNode.props?.key !== newNode.props?.key) return true;
        if (oldNode.children.length !== newNode.children.length) return true;
        return oldNode.children.some((child, index) => diff(child, newNode.children[index]));
    }

    return true;
};

const update = (parent: HTMLElement, oldNode: VNode, newNode: VNode) => {
    if (diff(oldNode, newNode)) {
        const newElement = createElement(newNode);
        parent.replaceChild(newElement, parent.firstChild as Node);
    }
};

export const render = (element: HTMLElement, node: VNode) => {
    if (currentVDom === null) {
        element.appendChild(createElement(node));
    } else {
        update(element, currentVDom, node);
    }

    currentVDom = node;
};
