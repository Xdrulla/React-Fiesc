import React, { useEffect, useState } from "react"
import { Box, Typography, Grid, Paper } from "@mui/material"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../service/firebase"

const CandidateDetails = () => {
  const { candidateId } = useParams()
  const [candidate, setCandidate] = useState(null)

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const candidateDoc = await getDoc(doc(db, "candidates", candidateId))
        if (candidateDoc.exists()) {
          setCandidate(candidateDoc.data())
        } else {
          console.error("Candidato não encontrado")
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
      <Paper sx={{ p: 3 }}>
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
            <Typography variant="h6">Experiência Profissional</Typography>
            <Typography>{candidate.workExperience}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Habilidades</Typography>
            <Typography>{candidate.skills?.join(", ")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Tempo de Experiência</Typography>
            <Typography>{candidate.experienceLevel}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Faixa Salarial Esperada</Typography>
            <Typography>R$ {candidate.salaryRange}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Score</Typography>
            <Typography>{candidate.score}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default CandidateDetails
