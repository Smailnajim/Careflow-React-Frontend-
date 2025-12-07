import * as yup from "yup";
import type { LoginFormValues } from "../../interfaces/ILoginFormValues";

export const loginSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
    email: yup.string().required('Email is required').email("Please enter a valid email"),
    password: yup.string().required('Password is required').min(6, "Password must be at least 6 characters")
});
