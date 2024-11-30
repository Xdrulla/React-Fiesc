import React, { useEffect, useState } from "react"
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Typography,
	Paper,
} from "@mui/material"
import { Edit, Delete, Share, Visibility } from "@mui/icons-material"
import { db, auth } from "../../service/firebase"
import { collection, getDocs } from "firebase/firestore"
import Pagination from "../navigation/Pagination"
import InsertJob from "./InsertJob"
import { useAuthState } from "react-firebase-hooks/auth"
import { useLocation, useNavigate } from "react-router-dom"

const Dashboard = () => {
	const [jobs, setJobs] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(5)
	const [user] = useAuthState(auth)
	const [userRole, setUserRole] = useState(null)

	const navigate = useNavigate()
	const location = useLocation()
	const isCreatingJob = location.hash === "#create"

	useEffect(() => {
		const fetchJobs = async () => {
			try {
				if (!user) return
				const jobsCollection = collection(db, "jobs")
				const jobDocs = await getDocs(jobsCollection)
				let jobsData = jobDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}))

				if (userRole === "recruiter") {
					jobsData = jobsData.filter((job) => job.creatorId === user.uid)
				}

				setJobs(jobsData)
			} catch (error) {
				console.error("Erro ao buscar vagas:", error)
			}
		}

		const fetchUserRole = async () => {
			if (user) {
				try {
					const userDoc = await getDocs(collection(db, "users"))
					const currentUserData = userDoc.docs
						.map((doc) => ({ id: doc.id, ...doc.data() }))
						.find((u) => u.id === user.uid)
					if (currentUserData) {
						setUserRole(currentUserData.role)
					}
				} catch (error) {
					console.error("Erro ao buscar dados do usuário:", error)
				}
			}
		}

		fetchJobs()
		fetchUserRole()
	}, [user, userRole, jobs])

	const handlePageChange = (page) => {
		setCurrentPage(page)
	}

	const handleItemsPerPageChange = (value) => {
		setItemsPerPage(value)
		setCurrentPage(1)
	}

	const paginatedJobs = jobs.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	return (
		<Box sx={{ p: 3 }}>
			{isCreatingJob ? (
				<InsertJob onClose={() => navigate("/dashboard")} />
			) : (
				<>
					<Typography variant="h5" sx={{ mb: 3 }}>
						Dashboard de Vagas
					</Typography>
					{userRole === "recruiter" && (
						<Button
							variant="contained"
							color="primary"
							sx={{ mb: 2 }}
							onClick={() => navigate("#create")}
						>
							Cadastrar Nova Vaga
						</Button>
					)}
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Título</TableCell>
									<TableCell>Localização</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Nº Inscritos</TableCell>
									<TableCell>Dias para Fechamento</TableCell>
									<TableCell>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{paginatedJobs.map((job) => (
									<TableRow key={job.id}>
										<TableCell
											sx={{
												color: userRole === "candidate" ? "blue" : "inherit",
												cursor: userRole === "candidate" ? "pointer" : "default",
											}}
											onClick={() => {
												if (userRole === "candidate") navigate(`/job-details/${job.id}`)
											}}
										>
											{job.title}
										</TableCell>
										<TableCell>{job.location}</TableCell>
										<TableCell>
											{(() => {
												const currentDate = new Date()
												const closeDate = new Date(job.closeDate)
												const daysLeft = Math.ceil((closeDate - currentDate) / (1000 * 60 * 60 * 24))
												return daysLeft > 0 ? "Ativo" : "Fechado"
											})()}
										</TableCell>
										<TableCell>{job.applicantsCount || 0}</TableCell>
										<TableCell>
											{(() => {
												const currentDate = new Date()
												const closeDate = new Date(job.closeDate)
												const daysLeft = Math.ceil((closeDate - currentDate) / (1000 * 60 * 60 * 24))
												return daysLeft > 0 ? `${daysLeft} dias` : "Expirado"
											})()}
										</TableCell>
										<TableCell>
											{userRole === "recruiter" && (
												<>
													<IconButton
														color="primary"
														onClick={() => console.log("Editar", job)}
													>
														<Edit />
													</IconButton>
													<IconButton
														color="secondary"
														onClick={() => console.log("Excluir", job)}
													>
														<Delete />
													</IconButton>
													<IconButton
														color="default"
														onClick={() => console.log("Compartilhar", job)}
													>
														<Share />
													</IconButton>
													<IconButton
														color="info"
														onClick={() => console.log("Inscritos", job)}
													>
														<Visibility />
													</IconButton>
												</>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Pagination
						totalItems={jobs.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={handlePageChange}
						onItemsPerPageChange={handleItemsPerPageChange}
					/>
				</>
			)}
		</Box>
	)
}

export default Dashboard
