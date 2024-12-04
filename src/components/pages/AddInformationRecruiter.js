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
      () => navigate("/dashboard")
    )
  }, [navigate])

  const onSubmit = async (data) => {
    try {
      if (!user?.uid) {
        console.error("Usuário não autenticado.")
        return
      }

      const updateData = {
        phone: data.phone,
        position: data.position,
        company: data.company,
      }

      await updateDoc(doc(db, "users", user.uid), updateData)
      navigate("/dashboard")
    } catch (error) {
      console.error("Erro ao atualizar informações do recrutador:", error)
    }
  }

  return (
    <Box className="add-information-recruiter">
      <Typography variant="h5" className="form-title">
        Completar Perfil - Recrutador
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
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
        <Button type="submit" variant="contained" fullWidth>
          Salvar
        </Button>
      </form>
    </Box>
  )
}

export default AddInformationRecruiter
