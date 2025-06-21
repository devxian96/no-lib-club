import { router, Outlet } from '@/lib/router';

import { Main } from '@/pages/main';
import { SignalDemo } from '@/pages/useSignalExample';

export const Route = () => {
    const { addRoute } = router();
    addRoute('/', Main);
    addRoute('/use-signal', SignalDemo);

    return <Outlet />;
};
