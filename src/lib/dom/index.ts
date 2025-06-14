import type { VNode } from '@/lib/jsx/jsx-runtime';
import { eventDelegation } from './utils/eventDelegation';

export const createElement = (node: VNode) => {
    if (node === null || node === undefined) {
        return document.createDocumentFragment();
    }

    if (typeof node === 'string' || typeof node === 'number') {
        return document.createTextNode(node.toString());
    }

    if (typeof node === 'object' && 'component' in node && typeof node.component === 'string') {
        const element = document.createElement(node.component);
        if (node.props) {
            for (const [key, value] of Object.entries(node.props)) {
                if (key === 'children') {
                    continue;
                }

                if (typeof value === 'string') {
                    if (key === 'className') {
                        element.setAttribute('class', value);
                    } else if (key === 'htmlFor') {
                        element.setAttribute('for', value);
                    } else {
                        element.setAttribute(key, value);
                    }
                } else if (key === 'style' && typeof value === 'object' && value !== null) {
                    for (const [cssKey, cssValue] of Object.entries(value as Record<string, string>)) {
                        element.style.setProperty(cssKey.replace(/([A-Z])/g, '-$1').toLowerCase(), cssValue);
                    }
                } else if (typeof value === 'boolean' && value) {
                    element.setAttribute(key, '');
                } else if (key.startsWith('on') && typeof value === 'function') {
                    const eventName = key.substring(2).toLowerCase();
                    eventDelegation.addEventListener(element, eventName, value as EventListener);
                } else {
                    try {
                        (element as HTMLElement & Record<string, unknown>)[key] = value;
                    } catch (event) {
                        /**
                         * failed to set attribute: onClick
                         * TypeError: Failed to execute 'addEventListener' on 'Element': 2 arguments are required.
                         */
                        console.error(`failed to set attribute: ${key}`, event);
                    }
                }
            }
        }

        for (const child of node.children) {
            element.appendChild(createElement(child));
        }

        return element;
    }

    if (typeof node === 'object' && 'component' in node && typeof node.component === 'function') {
        return node.component();
    }

    return null;
};
