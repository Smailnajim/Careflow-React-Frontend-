import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MedecinDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Médecin Dashboard</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
            <div style={styles.content}>
                <div style={styles.welcomeCard}>
                    <h2>Welcome, Dr. {user?.firstName} {user?.lastName}!</h2>
                    <p>Role: <strong>Médecin</strong></p>
                    <p>Email: {user?.email}</p>
                </div>
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h3>My Patients</h3>
                        <p>View and manage your patients</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Appointments</h3>
                        <p>Manage your appointments</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Prescriptions</h3>
                        <p>Create and view prescriptions</p>
                    </div>
                    <div style={styles.card}>
                        <h3>Lab Results</h3>
                        <p>View laboratory results</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', backgroundColor: '#059669', color: 'white'
    },
    title: { margin: 0, fontSize: '1.5rem' },
    logoutBtn: {
        padding: '0.5rem 1rem', backgroundColor: 'white', color: '#059669',
        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
    },
    content: { padding: '2rem' },
    welcomeCard: {
        backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem'
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' },
    card: {
        backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
};
