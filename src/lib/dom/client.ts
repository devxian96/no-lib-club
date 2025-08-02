import { createElement } from '.';
import type { VNode, VDom, Component } from '@/lib/jsx/jsx-runtime';

let currentVDom: VNode | null = null;
let rootElement: HTMLElement | null = null;
let rootVNode: Component | null = null;

/**
 * Checks if a node is a virtual DOM (VDom) object.
 * @param {VNode} node - The node to check
 * @returns {node is VDom} True if the node is a VDom object
 */
const isVDom = (node: VNode): node is VDom => {
    const result = node !== null && node !== undefined && typeof node === 'object' && 'children' in node;
    return result;
};

/**
 * Gets the type or component of a VDom node.
 * @param {VDom} node - The VDom node
 * @returns {string | Component} The type or component
 */
const getNodeType = (node: VDom) => {
    return 'component' in node ? node.component : node.type;
};

/**
 * Updates the real DOM to match the new virtual DOM tree.
 * @param {HTMLElement} parent - The parent DOM element
 * @param {VNode} oldNode - The previous virtual node
 * @param {VNode} newNode - The new virtual node
 * @param {{i: number}} [index={i:0}] - The child index tracker
 */
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

/**
 * Renders a component into a DOM element, managing the virtual DOM.
 * @param {HTMLElement} element - The root DOM element
 * @param {Component} node - The root component function
 */
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

/**
 * Rerenders the root component, updating the DOM as needed.
 */
export const rerender = () => {
    if (rootElement && rootVNode) {
        const newNode = rootVNode();
        update(rootElement, currentVDom, newNode);
        currentVDom = newNode;
    }
};
