import LoginForm from '../components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div style={styles.container}>
            <LoginForm />
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '1rem',
    },
};
