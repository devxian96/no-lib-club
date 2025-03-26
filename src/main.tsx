import { render } from '@/lib/dom/client';
import { Main } from '@/pages/main';

render(document.querySelector<HTMLDivElement>('#app')!, <Main />);
