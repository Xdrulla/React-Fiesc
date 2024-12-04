import React from "react"
import { useForm, Controller } from "react-hook-form"
import { TextField, Button, Box, Typography } from "@mui/material"
import { yupResolver } from "@hookform/resolvers/yup"
import { candidateSchema } from "../../common/utils/validations"
import { useNavigate } from "react-router-dom"
import { db, auth } from "../../service/firebase"
import { doc, setDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"

const CandidateRegisterPage = () => {
  const navigate = useNavigate()

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(candidateSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      const uid = userCredential.user.uid

      await setDoc(doc(db, "users", uid), {
        name: data.name,
        email: data.email,
        role: "candidate",
        createdAt: new Date(),
      })

      reset()
      navigate("/login")
    } catch (error) {
      console.error("Erro ao cadastrar candidato: ", error)
    }
  }

  return (
    <Box className="candidate-register-page">
      <Typography variant="h5" className="title">
        Cadastro de Candidato
      </Typography>

      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        className="back-button"
      >
        Voltar para a tela de cadastro
      </Button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Nome Completo"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="E-mail"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="password"
              label="Senha"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="password"
              label="Confirme sua Senha"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained">
          Cadastrar
        </Button>
      </form>
    </Box>
  )
}

export default CandidateRegisterPage
