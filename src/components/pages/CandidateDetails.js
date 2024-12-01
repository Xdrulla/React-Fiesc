import React, { useEffect, useState } from "react"
import { Box, Typography, Grid, Paper, Button } from "@mui/material"
import { useParams, useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../service/firebase"
import { calculateCandidateScore } from "../../helper/scoreMath" 

const CandidateDetails = () => {
  const { candidateId } = useParams()
  const [candidate, setCandidate] = useState(null)
  const [score, setScore] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const applicationDoc = await getDoc(doc(db, "applications", candidateId))
        if (applicationDoc.exists()) {
          const { userId, jobId } = applicationDoc.data()

          const userDoc = await getDoc(doc(db, "users", userId))
          const jobDoc = await getDoc(doc(db, "jobs", jobId))

          if (userDoc.exists() && jobDoc.exists()) {
            const userData = userDoc.data()
            const jobData = jobDoc.data()

            const calculatedScore = calculateCandidateScore(userData, jobData)

            setCandidate({ ...userData })
            setScore(calculatedScore)
          } else {
            console.error("Usuário ou vaga não encontrados")
          }
        } else {
          console.error("Inscrição não encontrada")
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do candidato:", error)
      }
    }

    fetchCandidateDetails()
  }, [candidateId])

  if (!candidate) {
    return <Typography>Carregando detalhes do candidato...</Typography>
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Detalhes do Candidato
      </Typography>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Nome Completo</Typography>
            <Typography>{candidate.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">E-mail</Typography>
            <Typography>{candidate.email}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Telefone</Typography>
            <Typography>{candidate.phone}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Habilidades</Typography>
            <Typography>{candidate.skills?.join(", ")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Score</Typography>
            <Typography>{score || "Não disponível"}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(`/candidates/${candidateId.split("_")[0]}`)}
      >
        Voltar
      </Button>
    </Box>
  )
}

export default CandidateDetails
