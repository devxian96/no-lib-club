import type { Component } from '@/lib/jsx/jsx-runtime';
import { rerender } from '@/lib/dom/client';
import { useEffect } from '@/lib/dom/hooks/useEffect';
export { Link } from './Link';

interface Route {
    path: string;
    component: Component;
}

const routes: Route[] = [];

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

export const router = (basePath: string = '') => {
    const addRoute = (path: string, component: Component) => {
        routes.push({ path: basePath + path, component });
    };

    const navigate = (path: string) => {
        window.history.pushState({}, '', path);
        rerender();
    };

    const replace = (path: string) => {
        window.history.replaceState({}, '', path);
        rerender();
    };

    const goBack = () => {
        window.history.back();
        rerender();
    };

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
