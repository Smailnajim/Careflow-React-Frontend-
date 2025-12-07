import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUsers, updateUser, deleteUser } from '../../services/userService';
import type { UserData, UpdateUserData } from '../../interfaces/IUser';

export default function UserManagement() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [formData, setFormData] = useState<UpdateUserData>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEdit = (userData: UserData) => {
        setEditingUser(userData);
        setFormData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone || '',
            status: userData.status,
            roleName: userData.roleName,
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setFormData({});
    };

    const handleInputChange = (field: keyof UpdateUserData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!editingUser) return;

        try {
            setSaving(true);
            await updateUser(editingUser._id, formData);
            await loadUsers();
            setEditingUser(null);
            setFormData({});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await deleteUser(userId);
            await loadUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>User Management</h1>
                    <p style={styles.subtitle}>Welcome, {user?.firstName}</p>
                </div>
                <div style={styles.headerButtons}>
                    <button onClick={() => navigate('/admin/dashboard')} style={styles.backBtn}>
                        ← Back to Dashboard
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            <div style={styles.content}>
                {error && <div style={styles.error}>{error}</div>}

                {loading ? (
                    <div style={styles.loading}>Loading users...</div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Phone</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} style={styles.tr}>
                                        <td style={styles.td}>{u.firstName} {u.lastName}</td>
                                        <td style={styles.td}>{u.email}</td>
                                        <td style={styles.td}>{u.phone || '-'}</td>
                                        <td style={styles.td}>
                                            <span style={styles.badge}>{u.roleName || '-'}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: u.status === 'active' ? '#dcfce7' : '#fef3c7',
                                                color: u.status === 'active' ? '#166534' : '#92400e'
                                            }}>
                                                {u.status || 'pending'}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button onClick={() => handleEdit(u)} style={styles.editBtn}>Edit</button>
                                            <button onClick={() => handleDelete(u._id)} style={styles.deleteBtn}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Edit Modal */}
                {editingUser && (
                    <div style={styles.modal}>
                        <div style={styles.modalContent}>
                            <h2 style={styles.modalTitle}>Edit User</h2>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>First Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName || ''}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Last Name</label>
                                <input
                                    type="text"
                                    value={formData.lastName || ''}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Role</label>
                                <select
                                    value={formData.roleName || ''}
                                    onChange={(e) => handleInputChange('roleName', e.target.value)}
                                    style={styles.input}
                                >
                                    <option value="">Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="medecin">Médecin</option>
                                    <option value="patient">Patient</option>
                                    <option value="laboratoire">Laboratoire</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Status</label>
                                <select
                                    value={formData.status || ''}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    style={styles.input}
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            <div style={styles.modalButtons}>
                                <button onClick={handleCancelEdit} style={styles.cancelBtn}>Cancel</button>
                                <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
    content: { padding: '2rem' },
    error: {
        backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem',
        borderRadius: '8px', marginBottom: '1rem'
    },
    loading: { textAlign: 'center', padding: '2rem', color: '#666' },
    tableContainer: {
        backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        padding: '1rem', textAlign: 'left', backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb', fontWeight: '600'
    },
    tr: { borderBottom: '1px solid #e5e7eb' },
    td: { padding: '1rem' },
    badge: {
        backgroundColor: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem',
        borderRadius: '20px', fontSize: '0.85rem'
    },
    statusBadge: {
        padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem'
    },
    editBtn: {
        padding: '0.4rem 0.8rem', backgroundColor: '#4f46e5', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem'
    },
    deleteBtn: {
        padding: '0.4rem 0.8rem', backgroundColor: '#ef4444', color: 'white',
        border: 'none', borderRadius: '4px', cursor: 'pointer'
    },
    modal: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
        width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto'
    },
    modalTitle: { margin: '0 0 1.5rem 0', color: '#333' },
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' },
    input: {
        width: '100%', padding: '0.75rem', border: '1px solid #ddd',
        borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box'
    },
    modalButtons: { display: 'flex', gap: '1rem', marginTop: '1.5rem' },
    cancelBtn: {
        flex: 1, padding: '0.75rem', backgroundColor: '#e5e7eb', color: '#374151',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
    },
    saveBtn: {
        flex: 1, padding: '0.75rem', backgroundColor: '#4f46e5', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
    },
};
