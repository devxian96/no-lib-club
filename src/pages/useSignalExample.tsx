import { styled } from '@/lib/styled';
import { useSignal, createSignal } from '@/lib/dom/hooks/useSignal';

const Button = styled.button`
    background-color: red;
    :hover {
        opacity: 0.5;
    }
`;

const CounterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

interface CounterProps {
    initialCount?: number;
}

const [globalCountSignal, setGlobalCount] = createSignal(0);

export const Counter = ({ initialCount = 0 }: CounterProps) => {
    const [countSignal, setCount] = useSignal(initialCount);

    const handleIncrement = () => {
        setCount((prev) => prev + 1);
    };

    const handleGlobalIncrement = () => {
        setGlobalCount((prev) => prev + 1);
    };

    return (
        <CounterContainer>
            <h2 style={{ color: 'blue' }}>useSignal 카운터 예제</h2>

            <div className="local-counter">
                <h3>지역 카운터: {countSignal.value}</h3>
                <Button onClick={handleIncrement}>지역 카운트 증가</Button>
            </div>

            <div className="global-counter">
                <h3>전역 카운터: {globalCountSignal.value}</h3>
                <Button onClick={handleGlobalIncrement}>전역 카운트 증가</Button>
            </div>
        </CounterContainer>
    );
};

export const GlobalCountDisplay = () => {
    return (
        <div className="global-display">
            <h3>다른 컴포넌트에서 전역 카운터: {globalCountSignal.value}</h3>
            <p>Counter 컴포넌트에서 "전역 카운트 증가" 버튼을 클릭하면 이 값도 변경됩니다.</p>
        </div>
    );
};

export const SignalDemo = () => {
    return (
        <div className="signal-demo">
            <h1>Signal 상태 관리 데모</h1>
            <Counter initialCount={5} />
            <hr />
            <GlobalCountDisplay />
        </div>
    );
};
