import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Correo inválido')
    .required('El correo es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
});

export const registerStudentValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'El nombre es muy corto')
    .max(50, 'El nombre es muy largo')
    .required('El nombre es obligatorio'),
  email: Yup.string()
    .email('Correo inválido')
    .required('El correo es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  subject: Yup.string()
    .required('La materia es obligatoria'),
});
