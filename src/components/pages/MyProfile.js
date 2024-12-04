import React, { useEffect, useState } from "react"
import { Box, TextField, Typography, Button, Grid } from "@mui/material"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../service/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

const MyProfile = () => {
  const [user] = useAuthState(auth)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const data = userDoc.data()
            setProfileData(data)
            setFormData(data)
          } else {
            console.error("Usuário não encontrado na coleção users.")
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do usuário no Firestore:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchProfileData()
  }, [user])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!hasChanges || !user) return

    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, formData)
      setProfileData(formData)
      setHasChanges(false)
      setIsEditing(false)
    } catch (error) {
      console.error("Erro ao salvar os dados no Firestore:", error)
    }
  }

  if (loading) {
    return <Typography>Carregando...</Typography>
  }

  if (!profileData) {
    return <Typography>Erro ao carregar os dados do perfil.</Typography>
  }

  return (
    <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Meu Perfil
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nome"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            fullWidth
            InputProps={{
              readOnly: !isEditing,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            fullWidth
            InputProps={{
              readOnly: !isEditing,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Telefone"
            value={formData.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            fullWidth
            InputProps={{
              readOnly: !isEditing,
            }}
          />
        </Grid>
        {formData.role === "recruiter" ? (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Empresa"
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cargo"
                value={formData.position || ""}
                onChange={(e) => handleInputChange("position", e.target.value)}
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nível de Experiência"
                value={formData.experienceLevel || ""}
                onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Faixa Salarial"
                value={formData.salaryRange || ""}
                onChange={(e) => handleInputChange("salaryRange", e.target.value)}
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Habilidades"
                value={formData.skills?.join(", ") || ""}
                onChange={(e) => handleInputChange("skills", e.target.value.split(",").map((s) => s.trim()))}
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Experiência Profissional"
                value={formData.workExperience || ""}
                onChange={(e) => handleInputChange("workExperience", e.target.value)}
                fullWidth
                InputProps={{
                  readOnly: !isEditing,
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        {isEditing ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Salvar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setFormData(profileData)
                setIsEditing(false)
                setHasChanges(false)
              }}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default MyProfile
