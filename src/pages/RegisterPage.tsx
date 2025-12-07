import RegisterForm from '../components/auth/RegisterForm';

export default function RegisterPage() {
    return (
        <div style={styles.container}>
            <RegisterForm />
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
