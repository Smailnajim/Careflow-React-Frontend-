import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Welcome to Careflow</h1>
                    <p style={styles.text}>Please login or register to continue.</p>
                    <div style={styles.buttonGroup}>
                        <a href="/login" style={styles.button}>Login</a>
                        <a href="/register" style={styles.buttonOutline}>Register</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Welcome, {user?.firstName}!</h1>
                <p style={styles.text}>You are successfully logged in.</p>
                <p style={styles.email}>Email: {user?.email}</p>
                <button onClick={logout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>
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
    card: {
        maxWidth: '500px',
        padding: '2.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    title: {
        marginBottom: '1rem',
        color: '#333',
        fontSize: '2rem',
    },
    text: {
        color: '#666',
        marginBottom: '1.5rem',
    },
    email: {
        color: '#888',
        marginBottom: '2rem',
        fontSize: '0.9rem',
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
    },
    button: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
    },
    buttonOutline: {
        padding: '0.75rem 1.5rem',
        backgroundColor: 'transparent',
        color: '#4f46e5',
        border: '2px solid #4f46e5',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
    },
    logoutButton: {
        padding: '0.75rem 2rem',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
};
