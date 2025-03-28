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

const diff = (oldNode: VNode, newNode: VNode) => {
    if (oldNode === newNode) {
        return false;
    }

    if (oldNode === null && newNode === null) return false;
    if (oldNode === undefined && newNode === undefined) return false;
    if (oldNode === null || newNode === null) return true;
    if (oldNode === undefined || newNode === undefined) return true;

    if (typeof oldNode !== typeof newNode) {
        return true;
    }

    if (typeof oldNode === 'string' || typeof oldNode === 'number') {
        return oldNode !== newNode;
    }

    if (isVDom(oldNode) && isVDom(newNode)) {
        const oldType = getNodeType(oldNode);
        const newType = getNodeType(newNode);

        if (oldType !== newType) {
            return true;
        }

        const oldProps = oldNode.props || {};
        const newProps = newNode.props || {};

        if (oldProps.key !== newProps.key) {
            return true;
        }

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

        const oldKeys = Object.keys(oldProps).filter((key) => !excludeProps.includes(key) && key !== 'children');
        const newKeys = Object.keys(newProps).filter((key) => !excludeProps.includes(key) && key !== 'children');

        if (oldKeys.length !== newKeys.length) {
            return true;
        }

        for (const key of oldKeys) {
            if (oldProps[key] !== newProps[key]) {
                return true;
            }
        }

        if (oldNode.children.length !== newNode.children.length) {
            return true;
        }

        for (let i = 0; i < oldNode.children.length; i++) {
            if (diff(oldNode.children[i], newNode.children[i])) {
                return true;
            }
        }

        return false;
    }

    return true;
};

const update = (parent: HTMLElement, oldNode: VNode, newNode: VNode) => {
    const isDifferent = diff(oldNode, newNode);

    if (isDifferent) {
        const newElement = createElement(newNode);
        if (parent.firstChild) {
            parent.replaceChild(newElement, parent.firstChild as Node);
        } else {
            parent.appendChild(newElement);
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

const rerender = () => {
    if (rootElement && rootVNode) {
        const newNode = rootVNode();

        if (rootElement.firstChild) {
            rootElement.removeChild(rootElement.firstChild);
        }
        rootElement.appendChild(createElement(newNode));

        currentVDom = newNode;
    }
};
