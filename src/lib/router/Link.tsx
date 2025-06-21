import { router } from '@/lib/router';
import type { VNode } from '@/lib/jsx/jsx-runtime';

interface Props {
    href: string;
    children?: VNode;
}

export const Link = ({ href, children }: Props) => {
    const { navigate } = router();

    const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        navigate(href);
    };

    return (
        <a href="#" onClick={handleClick}>
            {children}
        </a>
    );
};
