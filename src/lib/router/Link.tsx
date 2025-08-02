import { router } from 'rapid/router';
import type { PropsWithChildren } from 'rapid';

/**
 * Props for the Link component.
 * @typedef {Object} Props
 * @property {string} href - The target URL to navigate to
 * @property {VNode} [children] - The link contents
 */
interface Props extends PropsWithChildren {
    href: string;
}

/**
 * A client-side navigation link component.
 * Prevents default anchor behavior and uses router navigation.
 * @param {Props} props - The props for the Link component
 * @returns {VNode} The anchor element
 */
export const Link = ({ href, children }: Props) => {
    const { navigate } = router();

    /**
     * Handles click event to perform client-side navigation.
     * @param {MouseEvent} event - The click event
     */
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
