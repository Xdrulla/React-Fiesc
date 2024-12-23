import React from "react"
import { useForm, Controller } from "react-hook-form"
import { TextField, Button, Box, Typography } from "@mui/material"
import { yupResolver } from "@hookform/resolvers/yup"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../service/firebase"
import { loginSchema } from "../../common/utils/validations"
import { doc, getDoc } from "firebase/firestore"
import { checkProfileCompletion } from "../../helper/login"

const Login = () => {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      const uid = userCredential.user.uid

      const isProfileComplete = await checkProfileCompletion(uid)

      if (!isProfileComplete) {
        const userDoc = await getDoc(doc(db, "users", uid))
        const userData = userDoc.data()

        navigate(
          userData.role === "recruiter" ? "/add-info/recruiter" : "/add-info/candidate"
        )
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      alert("Falha ao autenticar. Verifique suas credenciais.")
    }
  }

  return (
    <Box className="login-container">
      <Typography variant="h5" >
        Login
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button type="submit" variant="contained">
          Entrar
        </Button>
      </form>
      <Button
        variant="text"
        fullWidth
        className="register-button"
        onClick={() => navigate("/")}
      >
        Não tem uma conta? Cadastre-se
      </Button>
    </Box>
  )
}

export default Login
