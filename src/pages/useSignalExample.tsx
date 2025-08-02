import { styled } from '@/lib/styled';
import { router } from '@/lib/router';
import { useSignal, createSignal } from '@/lib/dom/hooks/useSignal';
import { useEffect } from '@/lib/dom/hooks/useEffect';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

const Button = styled.button<ButtonProps>`
    padding: ${(props) => {
        switch (props.size) {
            case 'small':
                return '0.25em 0.5em';
            case 'large':
                return '0.75em 1.5em';
            default:
                return '0.5em 1em';
        }
    }};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    background-color: ${(props) => {
        switch (props.variant) {
            case 'primary':
                return '#007bff';
            case 'secondary':
                return '#6c757d';
            case 'danger':
                return '#dc3545';
            default:
                return '#007bff';
        }
    }};

    color: ${(props) => (props.variant === 'secondary' ? '#fff' : '#fff')};

    :hover {
        opacity: 0.8;
        transform: translateY(-1px);
    }

    :active {
        transform: translateY(0);
    }
`;

const CounterContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

interface CounterProps {
    initialCount?: number;
}

const [globalCountSignal, setGlobalCount] = createSignal(0);

const Counter = ({ initialCount = 0 }: CounterProps) => {
    const [countSignal, setCount] = useSignal(initialCount);
    useEffect(() => {
        console.log('countSignal changed', countSignal.value);
    }, [countSignal.value]);

    const handleIncrement = () => {
        setCount((prev) => prev + 1);
    };

    const handleDecrement = () => {
        setCount((prev) => prev - 1);
    };

    const handleReset = () => {
        setCount(0);
    };

    const handleGlobalIncrement = () => {
        setGlobalCount((prev) => prev + 1);
    };

    return (
        <CounterContainer>
            <h2 style={{ color: '#333', margin: 0 }}>useSignal 카운터 예제</h2>

            <div className="local-counter" style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#555', margin: '0 0 1rem 0' }}>지역 카운터: {countSignal.value}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <Button variant="danger" size="small" onClick={handleDecrement}>
                        지역 카운트 감소
                    </Button>
                    <Button variant="primary" onClick={handleIncrement}>
                        지역 카운트 증가
                    </Button>
                    <Button variant="secondary" size="small" onClick={handleReset}>
                        초기화
                    </Button>
                </div>
            </div>

            <div className="global-counter" style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#555', margin: '0 0 1rem 0' }}>전역 카운터: {globalCountSignal.value}</h3>
                <Button variant="primary" size="large" onClick={handleGlobalIncrement}>
                    전역 카운트 증가
                </Button>
            </div>
        </CounterContainer>
    );
};

const GlobalCountDisplay = () => {
    return (
        <div className="global-display" style={{ textAlign: 'center', padding: '1rem' }}>
            <h3 style={{ color: '#333' }}>다른 컴포넌트에서 전역 카운터: {globalCountSignal.value}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Counter 컴포넌트에서 "전역 카운트 증가" 버튼을 클릭하면 이 값도 변경됩니다.
            </p>
        </div>
    );
};

const ColorButton = styled.button<{ color: string }>`
    background-color: ${(props) => props.color};
    color: #fff;
    border: none;
    padding: 0.5em 1em;
    border-radius: 4px;
`;

const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const RandomColorButton = () => {
    const [color, setColor] = useSignal('#000000');

    useEffect(() => {
        setColor(getRandomColor());
    }, []);

    return (
        <ColorButton color={color.value} onClick={() => setColor(getRandomColor())}>
            Random Color
        </ColorButton>
    );
};

export const SignalDemo = () => {
    const { navigate } = router();

    const handleNavigate = (url: string) => () => {
        navigate(url);
    };

    return (
        <div className="signal-demo" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '2rem' }}>Signal 상태 관리 데모</h1>
            <Counter initialCount={5} />
            <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #eee' }} />
            <GlobalCountDisplay />
            <RandomColorButton />
            <Button onClick={handleNavigate('/')}>메인 페이지로 이동</Button>
        </div>
    );
};
