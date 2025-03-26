const MyComponent = ({ className }: { className: string }) => {
    return <div className={className}>Hello World!!!</div>;
};

export const Main = () => {
    return (
        <div>
            <MyComponent className="myClass" />
        </div>
    );
};
