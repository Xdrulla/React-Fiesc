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
import { calculateCandidateScore } from "../../helper/scoreMath"
import Pagination from "../navigation/Pagination"

const CandidateList = () => {
	const [candidates, setCandidates] = useState([])
	const [sortField, setSortField] = useState("name")
	const [sortOrder, setSortOrder] = useState("asc")
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(5)
	const [user] = useAuthState(auth)
	const navigate = useNavigate()
	const { jobId } = useParams()

	useEffect(() => {
		const fetchCandidates = async () => {
			try {
				if (!user) return

				const jobDoc = await getDoc(doc(db, "jobs", jobId))
				const jobData = jobDoc.exists() ? jobDoc.data() : null

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
					const userData = userDoc.exists() ? userDoc.data() : {}
					const score = calculateCandidateScore(userData, jobData)

					return {
						...application,
						name: userData.name || "Usuário desconhecido",
						email: userData.email || "E-mail não disponível",
						score: score || "N/A",
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

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedCandidates = sortedCandidates.slice(startIndex, endIndex)

	const handlePageChange = (page) => {
		setCurrentPage(page)
	}

	const handleItemsPerPageChange = (value) => {
		setItemsPerPage(value)
		setCurrentPage(1)
	}

	const handleViewDetails = (candidateId) => {
		navigate(`/candidate-details/${candidateId}`)
	}

	return (
		<Box sx={{ p: 3, pb: "80px" }}>
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
						{paginatedCandidates.map((candidate) => (
							<TableRow key={candidate.id}>
								<TableCell>{candidate.name}</TableCell>
								<TableCell>{candidate.email}</TableCell>
								<TableCell>{candidate.score}</TableCell>
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
			<Pagination
				totalItems={sortedCandidates.length}
				itemsPerPage={itemsPerPage}
				currentPage={currentPage}
				onPageChange={handlePageChange}
				onItemsPerPageChange={handleItemsPerPageChange}
			/>
		</Box>
	)
}

export default CandidateList
