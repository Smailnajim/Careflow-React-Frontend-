import * as yup from "yup";
import type { RegisterFormValues } from "../../interfaces/IRegisterFormValues";

const registerSchema: yup.SchemaOf<RegisterFormValues> = yup.object({
    firstName: yup.string().required('first Name is required'),
    lastName: yup.string().required('lastName Name is required'),
    email: yup.string().required('email is required').email("this is not email forma"),
    password: yup.string().required('password is required').min(6, "password must be 6 charecters or big")
});