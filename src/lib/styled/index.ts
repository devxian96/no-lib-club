import { h } from '@/lib/jsx/jsx-runtime';
import type { VNode } from '@/lib/jsx/jsx-runtime';

type StylesType = TemplateStringsArray;
interface StyledProps {
    children?: VNode | VNode[];
    [key: string]: unknown;
}

type StyledFactory = (styles: StylesType) => (props: StyledProps) => VNode;

interface StyledInterface {
    [tag: string]: StyledFactory;
}

let classCounter = 0;

const injectedStyles = new Set<string>();

const injectStyle = (className: string, cssText: string) => {
    const styleId = `styled-${className}`;

    if (injectedStyles.has(styleId)) {
        return;
    }

    const processedCSS = parseCSSText(cssText, className);

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = processedCSS;

    document.head.appendChild(styleElement);
    injectedStyles.add(styleId);
};

const parseCSSText = (cssText: string, className: string): string => {
    const rules: string[] = [];
    const normalProperties: string[] = [];

    const lines = cssText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line?.includes('{') && (line.startsWith(':') || line.startsWith('&'))) {
            const selector = line.replace('{', '').trim();
            const nestedProperties: string[] = [];
            i += 1;

            while (i < lines.length) {
                const currentLine = lines[i];
                if (currentLine?.includes('}')) {
                    break;
                }

                if (currentLine?.includes(':')) {
                    const [property, value] = currentLine
                        .replace(';', '')
                        .split(':')
                        .map((s) => s.trim());
                    if (property && value) {
                        const kebabProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
                        nestedProperties.push(`  ${kebabProperty}: ${value};`);
                    }
                }
                i += 1;
            }

            if (nestedProperties.length > 0) {
                rules.push(`.${className}${selector} {\n${nestedProperties.join('\n')}\n}`);
            }
        } else if (line?.includes(':') && !line.includes('{') && !line.includes('}')) {
            const [property, value] = line
                .replace(';', '')
                .split(':')
                .map((s) => s.trim());
            if (property && value) {
                const kebabProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
                normalProperties.push(`  ${kebabProperty}: ${value};`);
            }
        }
    }

    if (normalProperties.length > 0) {
        rules.unshift(`.${className} {\n${normalProperties.join('\n')}\n}`);
    }

    return rules.join('\n\n');
};

export const styled: StyledInterface = new Proxy(
    {},
    {
        get(_, prop) {
            const tag = String(prop);

            return (styles: StylesType) => {
                classCounter += 1;
                const className = `${tag}-${classCounter}`;
                const cssText = styles[0];

                injectStyle(className, cssText);

                return (props: StyledProps = {}) => {
                    const childrenArray = props.children
                        ? Array.isArray(props.children)
                            ? props.children
                            : [props.children]
                        : [];

                    const { class: existingClass, ...restProps } = props;

                    const existingClassName = restProps.className || existingClass || '';
                    const newClassName = existingClassName ? `${existingClassName} ${className}` : className;

                    const newProps = {
                        ...restProps,
                        className: newClassName,
                    };

                    return h(tag, newProps, ...childrenArray);
                };
            };
        },
    },
);
