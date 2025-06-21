import { createElement } from '.';
import type { VNode, VDom, Component } from '@/lib/jsx/jsx-runtime';

let currentVDom: VNode | null = null;
let rootElement: HTMLElement | null = null;
let rootVNode: Component | null = null;

const isVDom = (node: VNode): node is VDom => {
    const result = node !== null && node !== undefined && typeof node === 'object' && 'children' in node;
    return result;
};

const getNodeType = (node: VDom) => {
    return 'component' in node ? node.component : node.type;
};

const update = (parent: HTMLElement, oldNode: VNode, newNode: VNode, index = { i: 0 }) => {
    if (oldNode === null || oldNode === undefined) {
        parent.appendChild(createElement(newNode));
        return;
    }

    if (newNode === null || newNode === undefined) {
        if (parent.childNodes[index.i]) {
            parent.removeChild(parent.childNodes[index.i]);
            index.i -= 1;
        }
        return;
    }

    if (typeof oldNode !== typeof newNode) {
        const newElement = createElement(newNode);
        parent.replaceChild(newElement, parent.childNodes[index.i]);
        return;
    }

    if (typeof newNode === 'string' || typeof newNode === 'number') {
        if (oldNode !== newNode) {
            const newElement = document.createTextNode(String(newNode));
            parent.replaceChild(newElement, parent.childNodes[index.i]);
        }
        return;
    }

    if (isVDom(oldNode) && isVDom(newNode)) {
        const oldType = getNodeType(oldNode);
        const newType = getNodeType(newNode);

        if (oldType !== newType) {
            const newElement = createElement(newNode);
            parent.replaceChild(newElement, parent.childNodes[index.i]);
            return;
        }

        const element = parent.childNodes[index.i] as HTMLElement;
        const oldProps = oldNode.props || {};
        const newProps = newNode.props || {};

        const excludeProps = [
            'onClick',
            'onChange',
            'onInput',
            'onSubmit',
            'onBlur',
            'onFocus',
            'onKeyDown',
            'onKeyUp',
        ];

        for (const key of Object.keys(oldProps)) {
            if (!excludeProps.includes(key) && key !== 'children' && !(key in newProps)) {
                element.removeAttribute(key);
            }
        }

        for (const key of Object.keys(newProps)) {
            if (!excludeProps.includes(key) && key !== 'children' && oldProps[key] !== newProps[key]) {
                if (key === 'className') {
                    element.setAttribute('class', String(newProps[key]));
                } else if (key === 'style' && typeof newProps[key] === 'object') {
                    Object.assign(element.style, newProps[key]);
                } else {
                    element.setAttribute(key, String(newProps[key]));
                }
            }
        }

        const oldChildren = oldNode.children;
        const newChildren = newNode.children;
        const maxLength = Math.max(oldChildren.length, newChildren.length);

        for (const index = { i: 0 }; index.i < maxLength; index.i += 1) {
            update(
                element,
                index.i < oldChildren.length ? oldChildren[index.i] : null,
                index.i < newChildren.length ? newChildren[index.i] : null,
                index,
            );
        }
    }
};

export const render = (element: HTMLElement, node: Component) => {
    rootElement = element;
    rootVNode = node;
    const newNode = node();

    if (currentVDom === null) {
        element.appendChild(createElement(newNode));
    } else {
        update(element, currentVDom, newNode);
    }

    currentVDom = newNode;

    document.addEventListener('signal-update', rerender);
};

export const rerender = () => {
    if (rootElement && rootVNode) {
        const newNode = rootVNode();
        update(rootElement, currentVDom, newNode);
        currentVDom = newNode;
    }
};
