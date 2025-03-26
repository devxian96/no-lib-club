import type { VNode } from '@/lib/jsx/jsx-runtime';

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
            Object.entries(node.props).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    element.setAttribute(key, value);
                } else if (key.startsWith('on') && typeof value === 'function') {
                    const eventName = key.substring(2).toLowerCase();
                    element.addEventListener(eventName, value as EventListener);
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
            });
        }

        node.children.forEach((child) => {
            element.appendChild(createElement(child));
        });

        return element;
    }

    if (typeof node === 'object' && 'component' in node && typeof node.component === 'function') {
        return node.component();
    }

    return null;
};
