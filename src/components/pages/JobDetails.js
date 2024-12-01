import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Typography, CircularProgress, Chip } from "@mui/material"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../service/firebase"

const JobDetails = () => {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)  

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDoc = await getDoc(doc(db, "jobs", jobId))
        if (jobDoc.exists()) {
          setJob({ id: jobDoc.id, ...jobDoc.data() })
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da vaga:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

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
    </Box>
  )
}

export default JobDetails
