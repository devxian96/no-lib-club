declare namespace JSX {
    interface IntrinsicElements {
        // document structure
        html?: HtmlAttributes;
        head?: HtmlAttributes;
        body?: HtmlAttributes;
        title?: HtmlAttributes;
        meta?: HtmlAttributes;
        link?: LinkAttributes;
        script?: ScriptAttributes;
        style?: HtmlAttributes;

        // section
        header?: HtmlAttributes;
        footer?: HtmlAttributes;
        main?: HtmlAttributes;
        section?: HtmlAttributes;
        article?: HtmlAttributes;
        nav?: HtmlAttributes;
        aside?: HtmlAttributes;

        // text content
        h1?: HtmlAttributes;
        h2?: HtmlAttributes;
        h3?: HtmlAttributes;
        h4?: HtmlAttributes;
        h5?: HtmlAttributes;
        h6?: HtmlAttributes;
        p?: HtmlAttributes;
        blockquote?: HtmlAttributes;
        pre?: HtmlAttributes;
        code?: HtmlAttributes;

        // inline
        span?: HtmlAttributes;
        strong?: HtmlAttributes;
        em?: HtmlAttributes;
        br?: HtmlAttributes;
        mark?: HtmlAttributes;
        small?: HtmlAttributes;
        sub?: HtmlAttributes;
        sup?: HtmlAttributes;

        // link
        a?: AnchorAttributes;

        // list
        ul?: HtmlAttributes;
        ol?: HtmlAttributes;
        li?: HtmlAttributes;
        dl?: HtmlAttributes;
        dt?: HtmlAttributes;
        dd?: HtmlAttributes;

        // form elements
        form?: HtmlAttributes;
        input?: InputAttributes;
        textarea?: TextareaAttributes;
        select?: SelectAttributes;
        option?: OptionAttributes;
        label?: HtmlAttributes;
        button?: ButtonAttributes;
        fieldset?: HtmlAttributes;
        legend?: HtmlAttributes;

        // table
        table?: HtmlAttributes;
        thead?: HtmlAttributes;
        tbody?: HtmlAttributes;
        tfoot?: HtmlAttributes;
        tr?: HtmlAttributes;
        th?: HtmlAttributes;
        td?: HtmlAttributes;
        caption?: HtmlAttributes;
        colgroup?: HtmlAttributes;
        col?: HtmlAttributes;

        // media
        img?: ImgAttributes;
        audio?: MediaAttributes;
        video?: MediaAttributes;
        source?: SourceAttributes;
        track?: HtmlAttributes;
        canvas?: HtmlAttributes;
        iframe?: HtmlAttributes;

        // other
        hr?: HtmlAttributes;
        div?: HtmlAttributes;

        // allow custom tags
        [elemName: string]: string | number | boolean | undefined | HtmlAttributes | HtmlAttributes[];
    }

    interface HtmlAttributes {
        id?: string;
        class?: string;
        title?: string;
        style?: string | Record<string, string | number>;
        hidden?: boolean;
        tabindex?: number;
        role?: string;
        children?: ElementChildren;
        [attr: string]:
            | string
            | number
            | boolean
            | undefined
            | ((event?: Event) => void)
            | ElementChildren
            | Record<string, string>;
    }

    interface AnchorAttributes extends HtmlAttributes {
        href?: string;
        target?: string;
        rel?: string;
        download?: boolean | string;
    }

    interface ImgAttributes extends HtmlAttributes {
        src?: string;
        alt?: string;
        width?: number | string;
        height?: number | string;
        loading?: 'lazy' | 'eager';
    }

    interface InputAttributes extends HtmlAttributes {
        type?: string;
        name?: string;
        value?: string | number;
        placeholder?: string;
        checked?: boolean;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        step?: number;
        min?: number | string;
        max?: number | string;
    }

    interface TextareaAttributes extends HtmlAttributes {
        name?: string;
        rows?: number;
        cols?: number;
        placeholder?: string;
        disabled?: boolean;
        readonly?: boolean;
        required?: boolean;
    }

    interface SelectAttributes extends HtmlAttributes {
        name?: string;
        multiple?: boolean;
        disabled?: boolean;
        required?: boolean;
    }

    interface OptionAttributes extends HtmlAttributes {
        value?: string;
        selected?: boolean;
        disabled?: boolean;
        label?: string;
    }

    interface ButtonAttributes extends ButtonEvent, HtmlAttributes {
        type?: 'submit' | 'reset' | 'button';
        disabled?: boolean;
    }

    interface MediaAttributes extends HtmlAttributes {
        src?: string;
        autoplay?: boolean;
        controls?: boolean;
        loop?: boolean;
        muted?: boolean;
    }

    interface SourceAttributes extends HtmlAttributes {
        src?: string;
        type?: string;
    }

    interface LinkAttributes extends HtmlAttributes {
        rel?: string;
        href?: string;
        type?: string;
        media?: string;
    }

    interface ScriptAttributes extends HtmlAttributes {
        src?: string;
        type?: string;
        async?: boolean;
        defer?: boolean;
    }

    interface ButtonEvent {
        onClick?: (event: MouseEvent) => void;
    }
}
