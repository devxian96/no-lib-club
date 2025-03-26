import type { VNode } from '@/lib/jsx/jsx-runtime';

export const router = (element: HTMLElement, children: VNode) => {
    console.log(children, element);
};
