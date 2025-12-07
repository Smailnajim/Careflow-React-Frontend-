import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../services/userService';
import { getDashboardUrl } from '../services/authService';
import type { UpdateUserData } from '../interfaces/IUser';

export default function ProfilePage() {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UpdateUserData>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
            });
        }
    }, [user]);

    const handleInputChange = (field: keyof UpdateUserData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setError(null);
        setSuccess(null);
        setSaving(true);

        try {
            const updatedUser = await updateUser(user.id, formData);

            // Update form with new data from server
            setFormData({
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                phone: updatedUser.phone || '',
            });

            // Update auth context user data
            setUser({
                ...user,
                firstName: updatedUser.firstName || user.firstName,
                lastName: updatedUser.lastName || user.lastName,
                email: updatedUser.email || user.email,
                phone: updatedUser.phone
            });

            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleBack = () => {
        if (user?.role) {
            navigate(getDashboardUrl(user.role));
        } else {
            navigate('/');
        }
    };

    if (!user) {
        return <div style={styles.container}>Please login to view your profile.</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>My Profile</h1>
                    <p style={styles.subtitle}>Update your account information</p>
                </div>
                <div style={styles.headerButtons}>
                    <button onClick={handleBack} style={styles.backBtn}>← Back to Dashboard</button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>First Name</label>
                        <input
                            type="text"
                            value={formData.firstName || ''}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Last Name</label>
                        <input
                            type="text"
                            value={formData.lastName || ''}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Phone</label>
                        <input
                            type="text"
                            value={formData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            style={styles.input}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div style={styles.info}>
                        <p><strong>Role:</strong> {user.role}</p>
                    </div>

                    <button type="submit" disabled={saving} style={styles.saveBtn}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: { minHeight: '100vh', backgroundColor: '#f3f4f6' },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2rem', backgroundColor: '#4f46e5', color: 'white'
    },
    title: { margin: 0, fontSize: '1.5rem' },
    subtitle: { margin: 0, opacity: 0.8, fontSize: '0.9rem' },
    headerButtons: { display: 'flex', gap: '1rem' },
    backBtn: {
        padding: '0.5rem 1rem', backgroundColor: 'transparent', color: 'white',
        border: '1px solid white', borderRadius: '6px', cursor: 'pointer'
    },
    logoutBtn: {
        padding: '0.5rem 1rem', backgroundColor: 'white', color: '#4f46e5',
        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'
    },
    content: {
        display: 'flex', justifyContent: 'center', padding: '2rem'
    },
    form: {
        backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '500px'
    },
    error: {
        backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem',
        borderRadius: '8px', marginBottom: '1rem'
    },
    success: {
        backgroundColor: '#dcfce7', color: '#166534', padding: '1rem',
        borderRadius: '8px', marginBottom: '1rem'
    },
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' },
    input: {
        width: '100%', padding: '0.75rem', border: '1px solid #ddd',
        borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box'
    },
    info: {
        backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '8px',
        marginBottom: '1rem', color: '#555'
    },
    saveBtn: {
        width: '100%', padding: '0.875rem', backgroundColor: '#4f46e5', color: 'white',
        border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'
    },
    loading: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', fontSize: '1.2rem', color: '#666'
    },
};
