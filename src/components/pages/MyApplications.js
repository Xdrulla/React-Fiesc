import React, { useEffect, useState } from "react"
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { db, auth } from "../../service/firebase"
import { collection, getDocs } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"

const MyApplications = () => {
	const [applications, setApplications] = useState([])
	const [user] = useAuthState(auth)

	useEffect(() => {
		const fetchApplications = async () => {
			if (!user) return

			try {
				const applicationsRef = collection(db, "applications")
				const applicationDocs = await getDocs(applicationsRef)
				const userApplications = applicationDocs.docs
					.map((doc) => doc.data())
					.filter((app) => app.userId === user.uid)

				const jobsRef = collection(db, "jobs")
				const jobDocs = await getDocs(jobsRef)
				const jobDetails = jobDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

				const enrichedApplications = userApplications.map((app) => {
					const job = jobDetails.find((j) => j.id === app.jobId)
					return {
						...app,
						jobTitle: job?.title || "Vaga não encontrada",
						jobLocation: job?.location || "Localização desconhecida",
					}
				})

				setApplications(enrichedApplications)
			} catch (error) {
				console.error("Erro ao buscar inscrições:", error)
			}
		}

		fetchApplications()
	}, [user])

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h5" sx={{ mb: 3 }}>
				Minhas Inscrições
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Título da Vaga</TableCell>
							<TableCell>Localização</TableCell>
							<TableCell>Data de Inscrição</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{applications.map((app) => (
							<TableRow key={`${app.jobId}_${app.userId}`}>
								<TableCell>{app.jobTitle}</TableCell>
								<TableCell>{app.jobLocation}</TableCell>
								<TableCell>{new Date(app.appliedAt.seconds * 1000).toLocaleDateString()}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	)
}

export default MyApplications
