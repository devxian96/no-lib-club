import { render } from '@/lib/dom/client';
import { SignalDemo } from '@/pages/useSignalExample';

render(document.querySelector<HTMLDivElement>('#app')!, () => {
    return <SignalDemo />;
});
