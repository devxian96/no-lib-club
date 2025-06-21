import { render } from '@/lib/dom/client';
import { Route } from './Route';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) {
    throw new Error('App not found');
}

render(app, () => <Route />);
