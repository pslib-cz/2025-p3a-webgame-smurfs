import { type FC } from 'react';

type ErrorFallbackProps = {
    resetErrorBoundary: () => void;
    error: Error;
}

const ErrorFallback: FC<ErrorFallbackProps> = ({ resetErrorBoundary, error }) => {
    return (
        <div role="alert" style={{ color: 'crimson' }}>
            <p><strong>Chyba</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error)}</pre>
            <button onClick={resetErrorBoundary} style={{ marginTop: '0.5rem' }}>Zkusit znovu</button>
        </div>
    );
}

export default ErrorFallback