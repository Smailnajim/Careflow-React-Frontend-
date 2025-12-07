import * as yup from "yup";
import type { RegisterFormValues } from "../../interfaces/IRegisterFormValues";

export const registerSchema: yup.ObjectSchema<RegisterFormValues> = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required').email("Please enter a valid email"),
    password: yup.string().required('Password is required').min(6, "Password must be at least 6 characters")
});