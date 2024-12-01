import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { TextField, Button, Box, Typography } from "@mui/material"
import { yupResolver } from "@hookform/resolvers/yup"
import { recruiterAdditionalSchema } from "../../common/utils/validations"
import { auth, db } from "../../service/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { showProfileCompletionAlert } from "../../helper/alert"
import { useAuthState } from "react-firebase-hooks/auth"
import TextMaskCustom from "../../common/MaskedInput"

const AddInformationRecruiter = () => {
  const navigate = useNavigate()
  const [user] = useAuthState(auth)

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(recruiterAdditionalSchema),
    defaultValues: {
      phone: "",
      position: "",
      company: "",
    },
  })

  useEffect(() => {
    showProfileCompletionAlert(
      () => console.log("Usuário escolheu completar agora."),
      () => navigate("/dashboard")
    )
  }, [navigate])

  const onSubmit = async (data) => {
    try {
      if (!user?.uid) {
        console.error("Usuário não autenticado.")
        return
      }

      console.log("Dados enviados:", data)

      const updateData = {
        phone: data.phone,
        position: data.position,
        company: data.company,
      }

      console.log("Dados para atualizar:", updateData)

      await updateDoc(doc(db, "users", user.uid), updateData)
      console.log("Informações adicionais do recrutador salvas com sucesso!")
      navigate("/dashboard")
    } catch (error) {
      console.error("Erro ao atualizar informações do recrutador:", error)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Completar Perfil - Recrutador
      </Typography>
      <form
        onSubmit={(e) => {
          console.log("Formulário enviado")
          handleSubmit(onSubmit)(e)
        }}
      >
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Telefone"
              fullWidth
              margin="normal"
              InputProps={{
                inputComponent: TextMaskCustom,
              }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="position"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Cargo/Função no RH"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="company"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Empresa"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Salvar
        </Button>
      </form>
    </Box>
  )
}

export default AddInformationRecruiter
