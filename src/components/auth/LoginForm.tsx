import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginFormValues } from "../../interfaces/ILoginFormValues";
import { loginSchema } from "../../yup/Schema/loginSchema";
import { login as loginUser, getDashboardUrl } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginForm() {
    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormValues) => {
        setApiError(null);
        setIsLoading(true);

        try {
            const response = await loginUser(data);
            if (response.user) {
                login(response.user);
                // Redirect to role-based dashboard
                const dashboardUrl = getDashboardUrl(response.user.role);
                navigate(dashboardUrl);
            }
        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <h2 style={styles.title}>Welcome Back</h2>

            {apiError && <div style={styles.error}>{apiError}</div>}

            <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <input
                    id="email"
                    type="email"
                    {...register("email")}
                    style={styles.input}
                    placeholder="Enter your email"
                />
                {errors.email && <span style={styles.fieldError}>{errors.email.message}</span>}
            </div>

            <div style={styles.inputGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <input
                    id="password"
                    type="password"
                    {...register("password")}
                    style={styles.input}
                    placeholder="Enter your password"
                />
                {errors.password && <span style={styles.fieldError}>{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={isLoading} style={styles.button}>
                {isLoading ? 'Signing in...' : 'Login'}
            </button>

            <p style={styles.linkText}>
                Don't have an account?{' '}
                <a href="/register" style={styles.link}>Register here</a>
            </p>
        </form>
    );
}

const styles: Record<string, React.CSSProperties> = {
    form: {
        maxWidth: '400px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#333',
        fontSize: '1.75rem',
    },
    inputGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#555',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    button: {
        width: '100%',
        padding: '0.875rem',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '1rem',
        transition: 'background-color 0.2s',
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        padding: '0.75rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    fieldError: {
        color: '#dc2626',
        fontSize: '0.875rem',
        marginTop: '0.25rem',
        display: 'block',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '1rem',
        color: '#666',
    },
    link: {
        color: '#4f46e5',
        textDecoration: 'none',
        fontWeight: '500',
    },
};
