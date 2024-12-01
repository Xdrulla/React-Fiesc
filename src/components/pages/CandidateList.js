import React, { useEffect, useState } from "react"
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Button,
	Select,
	MenuItem,
	Paper,
} from "@mui/material"
import { ArrowUpward, ArrowDownward } from "@mui/icons-material"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate, useParams } from "react-router-dom"
import { db, auth } from "../../service/firebase"

const CandidateList = () => {
	const [candidates, setCandidates] = useState([])
	const [sortField, setSortField] = useState("name")
	const [sortOrder, setSortOrder] = useState("asc")
	const [user] = useAuthState(auth)
	const navigate = useNavigate()
	const { jobId } = useParams()

	useEffect(() => {
		const fetchCandidates = async () => {
			try {
				if (!user) return

				const applicationsQuery = query(
					collection(db, "applications"),
					where("jobId", "==", jobId)
				)
				const applicationsDocs = await getDocs(applicationsQuery)

				const applicationsData = applicationsDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))

				const usersDataPromises = applicationsData.map(async (application) => {
					const userDoc = await getDoc(doc(db, "users", application.userId))
					return {
						...application,
						name: userDoc.exists() ? userDoc.data().name : "Usuário desconhecido",
						email: userDoc.exists() ? userDoc.data().email : "E-mail não disponível",
					}
				})

				const candidatesData = await Promise.all(usersDataPromises)

				setCandidates(candidatesData)
			} catch (error) {
				console.error("Erro ao buscar candidatos:", error)
			}
		}

		fetchCandidates()
	}, [jobId, user])

	const handleSortChange = (field) => {
		const isAsc = sortField === field && sortOrder === "asc"
		setSortField(field)
		setSortOrder(isAsc ? "desc" : "asc")
	}

	const sortedCandidates = [...candidates].sort((a, b) => {
		const valueA = a[sortField]?.toString().toLowerCase() || ""
		const valueB = b[sortField]?.toString().toLowerCase() || ""
		return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
	})

	const handleViewDetails = (candidateId) => {
		navigate(`/candidate-details/${candidateId}`)
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h5" sx={{ mb: 3 }}>
				Lista de Candidatos
			</Typography>
			<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
				<Select
					value={sortField}
					onChange={(e) => handleSortChange(e.target.value)}
					displayEmpty
					sx={{ width: 200, mr: 2 }}
				>
					<MenuItem value="name">Nome</MenuItem>
					<MenuItem value="score">Score</MenuItem>
				</Select>
				<IconButton onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
					{sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
				</IconButton>
			</Box>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Nome Completo</TableCell>
							<TableCell>E-mail</TableCell>
							<TableCell>Score</TableCell>
							<TableCell>Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedCandidates.map((candidate) => (
							<TableRow key={candidate.id}>
								<TableCell>{candidate.name}</TableCell>
								<TableCell>{candidate.email}</TableCell>
								<TableCell>{candidate.score || "Não disponível"}</TableCell>
								<TableCell>
									<Button
										variant="text"
										color="primary"
										onClick={() => handleViewDetails(candidate.id)}
									>
										Ver detalhes
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	)
}

export default CandidateList
