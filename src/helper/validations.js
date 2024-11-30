import * as yup from "yup";

export const candidateSchema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
  password: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .required("A senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas devem ser iguais")
    .required("A confirmação de senha é obrigatória"),
});

export const recruiterSchema = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  password: yup
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .required("A senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "As senhas devem ser iguais")
    .required("A confirmação de senha é obrigatória"),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

export const candidateAdditionalSchema = yup.object().shape({
  workExperience: yup
    .string()
    .required("O histórico profissional é obrigatório."),
  skills: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione ou adicione pelo menos uma habilidade."),
  experienceLevel: yup
    .string()
    .required("O tempo de experiência é obrigatório."),
  phone: yup
    .string()
    .matches(
      /^\+55 \d{2} \d{5}-\d{4}$/,
      "O telefone deve estar no formato +55 XX XXXXX-XXXX."
    )
    .required("O telefone é obrigatório."),
  salaryRange: yup
    .object()
    .shape({
      minSalary: yup
        .number()
        .nullable()
        .min(0, "O salário mínimo deve ser um número positivo."),
      maxSalary: yup
        .number()
        .nullable()
        .when("minSalary", (minSalary, schema) =>
          schema.min(minSalary, "O salário máximo deve ser maior que o mínimo.")
        ),
    })
    .required("Informe uma faixa salarial, se necessário."),
});

export const recruiterAdditionalSchema = yup.object().shape({
  position: yup
    .string()
    .required("O cargo ou função no RH é obrigatório."),
  company: yup
    .string()
    .required("O nome da empresa é obrigatório."),
  phone: yup
    .string()
    .matches(
      /^\+55 \d{2} \d{5}-\d{4}$/,
      "O telefone deve estar no formato +55 XX XXXXX-XXXX."
    )
    .required("O telefone é obrigatório."),
});

export const jobSchema = yup.object().shape({
  title: yup.string().required("O título da vaga é obrigatório."),
  description: yup
    .string()
    .required("A descrição da vaga é obrigatória."),
  experienceRequired: yup
    .string()
    .required("O nível de experiência é obrigatório."),
  location: yup.string().required("A localização é obrigatória."),
  openDate: yup.date().required("A data de abertura é obrigatória."),
  closeDate: yup
    .date()
    .required("A data de fechamento é obrigatória.")
    .min(yup.ref("openDate"), "A data de fechamento deve ser após a data de abertura."),
    salaryMin: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .typeError("O salário mínimo deve ser um número.")
    .min(0, "O salário mínimo deve ser positivo."),
  
  salaryMax: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable()
    .typeError("O salário máximo deve ser um número.")
    .min(yup.ref("salaryMin"), "O salário máximo deve ser maior que o mínimo."),  
  contractType: yup.string().required("O tipo de contrato é obrigatório."),
  skillsRequired: yup
    .array()
    .of(yup.string())
    .min(1, "Selecione ou adicione pelo menos uma habilidade requerida.")
    .required("As habilidades requeridas são obrigatórias."),
})

