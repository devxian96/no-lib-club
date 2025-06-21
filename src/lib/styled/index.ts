import { h } from '@/lib/jsx/jsx-runtime';
import type { VNode } from '@/lib/jsx/jsx-runtime';

type StylesType = TemplateStringsArray;
type StyleInterpolation<T = Record<string, unknown>> = string | ((props: T & StyledProps) => string);

interface StyledProps {
    children?: VNode | VNode[];
    [key: string]: unknown;
}

type StyledFactory = {
    <T = Record<string, unknown>>(
        styles: StylesType,
        ...interpolations: StyleInterpolation<T>[]
    ): (props: T & StyledProps) => VNode;
    (styles: StylesType, ...interpolations: StyleInterpolation[]): (props: StyledProps) => VNode;
};

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

const parseCSSText = (cssText: string, className: string) => {
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

const getPropsHash = (props: StyledProps) => {
    const keys = Object.keys(props).filter((key) => key !== 'children' && key !== 'className' && key !== 'class');
    if (keys.length === 0) return '';

    const propsString = keys
        .sort()
        .map((key) => `${key}:${String(props[key])}`)
        .join('|');
    let hash = 0;
    for (let i = 0; i < propsString.length; i++) {
        const char = propsString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
};

const processCSSWithInterpolations = <T extends Record<string, unknown>>(
    styles: StylesType,
    interpolations: StyleInterpolation<T>[],
    props: T & StyledProps,
) => {
    let result = '';

    for (let i = 0; i < styles.length; i++) {
        result += styles[i];

        if (i < interpolations.length) {
            const interpolation = interpolations[i];
            if (typeof interpolation === 'function') {
                const interpolatedValue = interpolation(props);
                result += interpolatedValue || '';
            } else {
                result += interpolation || '';
            }
        }
    }

    return result;
};

export const styled: StyledInterface = new Proxy(
    {},
    {
        get(_, prop) {
            const tag = String(prop);

            return <T extends Record<string, unknown> = Record<string, unknown>>(
                styles: StylesType,
                ...interpolations: StyleInterpolation<T>[]
            ) => {
                const baseClassCounter = ++classCounter;
                const baseClassName = `${tag}-${baseClassCounter}`;

                return (props: T & StyledProps = {} as T & StyledProps) => {
                    const propsHash = getPropsHash(props);
                    const className = propsHash ? `${baseClassName}-${propsHash}` : baseClassName;

                    const styleId = `styled-${className}`;
                    if (!injectedStyles.has(styleId)) {
                        const cssText = processCSSWithInterpolations(styles, interpolations, props);
                        injectStyle(className, cssText);
                    }

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
