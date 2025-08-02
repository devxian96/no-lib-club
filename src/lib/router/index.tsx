import type { Component } from '@/lib/jsx/jsx-runtime';
import { rerender } from '@/lib/dom/client';
import { useEffect } from '@/lib/dom/hooks/useEffect';
export { Link } from './Link';

interface Route {
    path: string;
    component: Component;
}

const routes: Route[] = [];

/**
 * Renders the component matching the current route path.
 * Listens to popstate events for navigation.
 * @returns {VNode | null} The matched route's component or null
 */
export const Outlet = () => {
    const currentPath = window.location.pathname;
    const Route = routes.find((route) => route.path === currentPath);

    useEffect(() => {
        window.addEventListener('popstate', rerender);
        return () => {
            window.removeEventListener('popstate', rerender);
        };
    }, []);

    if (Route) {
        return <Route.component />;
    }
    return null;
};

/**
 * Creates a router instance for managing client-side routes.
 * @param {string} [basePath=''] - The base path for all routes
 * @returns {{
 *   addRoute: (path: string, component: Component) => void,
 *   navigate: (path: string) => void,
 *   replace: (path: string) => void,
 *   goBack: () => void,
 *   goForward: () => void
 * }} Router API
 */
export const router = (basePath: string = '') => {
    /**
     * Registers a new route.
     * @param {string} path - The route path
     * @param {Component} component - The component to render for this path
     */
    const addRoute = (path: string, component: Component) => {
        routes.push({ path: basePath + path, component });
    };
    /**
     * Navigates to a new path, pushing it to the history stack.
     * @param {string} path - The path to navigate to
     */
    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        rerender();
    };
    /**
     * Replaces the current path in the history stack.
     * @param {string} path - The path to replace with
     */
    const replace = (path: string) => {
        window.history.replaceState({}, '', path);
        rerender();
    };
    /**
     * Navigates back in the history stack.
     */
    const goBack = () => {
        window.history.back();
        rerender();
    };
    /**
     * Navigates forward in the history stack.
     */
    const goForward = () => {
        window.history.forward();
        rerender();
    };

    return {
        addRoute,
        navigate,
        replace,
        goBack,
        goForward,
    };
};
