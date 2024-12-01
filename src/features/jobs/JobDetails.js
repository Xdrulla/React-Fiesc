import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Box, Typography, CircularProgress, Chip, Button } from "@mui/material"
import { doc, getDoc, setDoc, collection } from "firebase/firestore"
import { auth, db } from "../../service/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { showErrorAlert, showSuccessAlert } from "../../helper/alert"

const JobDetails = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user] = useAuthState(auth)
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDoc = await getDoc(doc(db, "jobs", jobId))
        if (jobDoc.exists()) {
          setJob({ id: jobDoc.id, ...jobDoc.data() })

          if (user) {
            const applicationDoc = await getDoc(
              doc(collection(db, "applications"), `${jobId}_${user.uid}`)
            )
            setIsApplied(applicationDoc.exists())
          }
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da vaga:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId, user])

  const handleApply = async () => {
    if (!user) {
      showErrorAlert("Você precisa estar logado para se inscrever na vaga.")
      navigate("/login")
      return
    }

    try {
      await setDoc(doc(collection(db, "applications"), `${jobId}_${user.uid}`), {
        jobId,
        userId: user.uid,
        appliedAt: new Date(),
      })
      setIsApplied(true)
      showSuccessAlert("Inscrição realizada com sucesso!")
    } catch (error) {
      console.error("Erro ao se inscrever na vaga:", error)
      alert("Erro ao se inscrever. Tente novamente mais tarde.")
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!job) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="error">
          Vaga não encontrada
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "600px",
        margin: "0 auto",
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        {job.title}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Localização: {job.location}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {job.description}
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Salário
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {job.salaryMax ? `R$ ${job.salaryMax}` : "Não informado"}
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Habilidades Requeridas
      </Typography>
      {job.skillsRequired && job.skillsRequired.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {job.skillsRequired.map((skill, index) => (
            <Chip key={index} label={skill} color="primary" />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Nenhuma habilidade especificada.
        </Typography>
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Habilidades Desejáveis
      </Typography>
      {job.skillsDesired && job.skillsDesired.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {job.skillsDesired.map((skill, index) => (
            <Chip key={index} label={skill} color="secondary" />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Nenhuma habilidade desejável especificada.
        </Typography>
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
        Tempo de Experiência
      </Typography>
      <Typography variant="body1">
        {job.experienceRequired ? `${job.experienceRequired}` : "Não informado"}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Dias restantes:{" "}
        {(() => {
          const currentDate = new Date()
          const closeDate = new Date(job.closeDate)
          const daysLeft = Math.ceil(
            (closeDate - currentDate) / (1000 * 60 * 60 * 24)
          )
          return daysLeft > 0 ? `${daysLeft} dias` : "Expirado"
        })()}
      </Typography>

      {user ? (
        isApplied ? (
          <Typography
            sx={{
              mt: 3,
              color: "green",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Você já está inscrito nesta vaga.
          </Typography>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleApply}
          >
            Inscrever-se
          </Button>
        )
      ) : (
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => navigate("/login")}
        >
          Fazer Login para Inscrever-se
        </Button>
      )}
    </Box>
  )
}

export default JobDetails
