import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterFormValues } from "../../interfaces/IRegisterFormValues";
import { registerSchema } from "../../yup/Schema/registerSchema";
import { register as registerUser } from "../../services/authService";

export default function RegisterForm() {
    const [apiError, setApiError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormValues>({
        resolver: yupResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setApiError(null);
        setIsLoading(true);

        try {
            const response = await registerUser(data);
            if (response.valid) {
                // Redirect to login page after successful registration
                navigate('/login');
            }
        } catch (error) {
            setApiError(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <h2 style={styles.title}>Create Account</h2>

            {apiError && <div style={styles.error}>{apiError}</div>}

            <div style={styles.inputGroup}>
                <label htmlFor="firstName" style={styles.label}>First Name</label>
                <input
                    id="firstName"
                    type="text"
                    {...register("firstName")}
                    style={styles.input}
                    placeholder="Enter your first name"
                />
                {errors.firstName && <span style={styles.fieldError}>{errors.firstName.message}</span>}
            </div>

            <div style={styles.inputGroup}>
                <label htmlFor="lastName" style={styles.label}>Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    {...register("lastName")}
                    style={styles.input}
                    placeholder="Enter your last name"
                />
                {errors.lastName && <span style={styles.fieldError}>{errors.lastName.message}</span>}
            </div>

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
                    placeholder="Enter your password (min 6 characters)"
                />
                {errors.password && <span style={styles.fieldError}>{errors.password.message}</span>}
            </div>

            <button type="submit" disabled={isLoading} style={styles.button}>
                {isLoading ? 'Creating Account...' : 'Register'}
            </button>

            <p style={styles.linkText}>
                Already have an account?{' '}
                <a href="/login" style={styles.link}>Login here</a>
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