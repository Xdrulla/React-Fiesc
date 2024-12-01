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
	Select,
	MenuItem,
	Modal,
} from "@mui/material"
import { Edit, Delete, Share, Visibility, ArrowUpward, ArrowDownward } from "@mui/icons-material"
import { db, auth } from "../../service/firebase"
import { collection, getDocs, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore"
import Pagination from "../navigation/Pagination"
import InsertJob from "./InsertJob"
import { showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmationAlert } from "../../helper/alert"
import { useAuthState } from "react-firebase-hooks/auth"
import { useLocation, useNavigate } from "react-router-dom"
import ShareModal from "./Modal"
import SearchBar from "../navigation/SearchBar"

const Dashboard = () => {
	const [jobs, setJobs] = useState([])
	const [filteredJobs, setFilteredJobs] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(5)
	const [sortField, setSortField] = useState("title")
	const [sortOrder, setSortOrder] = useState("asc")
	const [searchQuery, setSearchQuery] = useState("")
	const [user] = useAuthState(auth)
	const [userRole, setUserRole] = useState(null)
	const [isShareModalOpen, setIsShareModalOpen] = useState(false)
	const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
	const [shareLink, setShareLink] = useState("")
	const [editingJob, setEditingJob] = useState(null)
	const [selectedJob, setSelectedJob] = useState(null)

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
				setFilteredJobs(jobsData)
			} catch (error) {
				showErrorAlert("Erro", "Erro ao buscar vagas.")
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
					showErrorAlert("Erro", "Erro ao buscar dados do usuário.")
					console.error("Erro ao buscar dados do usuário:", error)
				}
			}
		}

		fetchJobs()
		fetchUserRole()
	}, [user, userRole])

	useEffect(() => {
		if (searchQuery) {
			const filtered = jobs.filter((job) =>
				job.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
			setFilteredJobs(filtered)
		} else {
			setFilteredJobs(jobs)
		}
	}, [searchQuery, jobs])

	const handlePageChange = (page) => {
		setCurrentPage(page)
	}

	const handleItemsPerPageChange = (value) => {
		setItemsPerPage(value)
		setCurrentPage(1)
	}

	const handleSortChange = (field) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc")
		} else {
			setSortField(field)
			setSortOrder("asc")
		}
	}

	const sortedJobs = [...jobs].sort((a, b) => {
		if (sortField === "daysLeft") {
			const daysLeftA = Math.ceil((new Date(a.closeDate) - new Date()) / (1000 * 60 * 60 * 24))
			const daysLeftB = Math.ceil((new Date(b.closeDate) - new Date()) / (1000 * 60 * 60 * 24))
			return sortOrder === "asc" ? daysLeftA - daysLeftB : daysLeftB - daysLeftA
		} else {
			const valueA = a[sortField]?.toString().toLowerCase() || ""
			const valueB = b[sortField]?.toString().toLowerCase() || ""
			return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
		}
	})

	const handleDeleteJob = async (job) => {
		if (job.applicantsCount > 0) {
			showWarningAlert(
				"Não é possível excluir",
				"Esta vaga possui candidatos inscritos. Remova os candidatos antes de excluir."
			)
			return
		}

		const confirmed = await showConfirmationAlert(
			"Você tem certeza?",
			"Esta ação não poderá ser desfeita."
		)
		if (confirmed) {
			try {
				await deleteDoc(doc(db, "jobs", job.id))
				setJobs((prevJobs) => prevJobs.filter((j) => j.id !== job.id))
				showSuccessAlert("Excluído!", "A vaga foi excluída com sucesso.")
			} catch (error) {
				showErrorAlert("Erro", "Não foi possível excluir a vaga.")
				console.error("Erro ao excluir vaga:", error)
			}
		}
	}

	const handleShare = (job) => {
		setShareLink(`${window.location.origin}/job-details/${job.id}`)
		setIsShareModalOpen(true)
	}

	const handleEditJob = (job) => {
		setEditingJob(job)
		navigate("#edit")
	}

	const handleOpenModal = async (job) => {
		let isApplied = false

		try {
			const applicationsRef = collection(db, "applications")
			const applicationDoc = await getDoc(doc(applicationsRef, `${job.id}_${user.uid}`))
			isApplied = applicationDoc.exists()
		} catch (error) {
			console.error("Erro ao verificar inscrição:", error)
		}

		setSelectedJob({
			...job,
			isApplied,
		})
		setIsApplyModalOpen(true)
	}

	const handleCloseShareModal = () => {
		setIsShareModalOpen(false)
	}

	const handleCloseApplyModal = () => {
		setSelectedJob(null)
		setIsApplyModalOpen(false)
	};

	const handleApply = async () => {
		if (!user) return;

		try {
			const applicationsRef = collection(db, "applications");
			await setDoc(doc(applicationsRef, `${selectedJob.id}_${user.uid}`), {
				jobId: selectedJob.id,
				userId: user.uid,
				appliedAt: new Date(),
			});

			showSuccessAlert("Sucesso", "Você se inscreveu na vaga com sucesso!");

			setSelectedJob((prev) => ({
				...prev,
				isApplied: true,
			}));
		} catch (error) {
			showErrorAlert("Erro", "Não foi possível se inscrever na vaga.");
			console.error("Erro ao salvar inscrição:", error);
		}

		handleCloseShareModal()
		handleCloseApplyModal()
	}

	return (
		<Box sx={{ p: 3 }}>
			{isCreatingJob || editingJob ? (
				<InsertJob
					job={editingJob}
					onClose={() => {
						setEditingJob(null)
						navigate("/dashboard")
					}}
				/>
			) : (
				<>
					<Typography variant="h5" sx={{ mb: 3 }}>
						Dashboard de Vagas
					</Typography>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 2,
						}}
					>
						<Box sx={{ flex: 1, maxWidth: "300px" }}>
							<SearchBar
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								placeholder="Buscar vagas..."
							/>
						</Box>
						{userRole === "recruiter" && (
							<Button
								variant="contained"
								color="primary"
								onClick={() => navigate("#create")}
							>
								Cadastrar Nova Vaga
							</Button>
						)}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								ml: "auto",
							}}
						>
							<Select
								value={sortField}
								onChange={(e) => handleSortChange(e.target.value)}
								displayEmpty
								sx={{ width: 200 }}
							>
								<MenuItem value="title">Título</MenuItem>
								<MenuItem value="status">Status</MenuItem>
								<MenuItem value="daysLeft">Dias Restantes</MenuItem>
							</Select>
							<IconButton
								onClick={() =>
									setSortOrder(sortOrder === "asc" ? "desc" : "asc")
								}
							>
								{sortOrder === "asc" ? <ArrowUpward /> : <ArrowDownward />}
							</IconButton>
						</Box>
					</Box>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell onClick={() => handleSortChange("title")}>
										Título {sortField === "title" && (sortOrder === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
									</TableCell>
									<TableCell>Localização</TableCell>
									<TableCell onClick={() => handleSortChange("status")}>
										Status {sortField === "status" && (sortOrder === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
									</TableCell>
									<TableCell>Nº Inscritos</TableCell>
									<TableCell onClick={() => handleSortChange("daysLeft")}>
										Dias para Fechamento {sortField === "daysLeft" && (sortOrder === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />)}
									</TableCell>
									<TableCell>Ações</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{sortedJobs.map((job) => (
									<TableRow key={job.id}>
										<TableCell>
											{userRole === "candidate" ? (
												<Typography
													sx={{
														cursor: "pointer",
														color: "blue",
														textDecoration: "underline",
													}}
													onClick={() => handleOpenModal(job)}
												>
													{job.title}
												</Typography>
											) : (
												job.title
											)}
										</TableCell>
										<TableCell>{job.location}</TableCell>
										<TableCell>
											{(() => {
												const currentDate = new Date()
												const closeDate = new Date(job.closeDate)
												const daysLeft = Math.ceil(
													(closeDate - currentDate) /
													(1000 * 60 * 60 * 24)
												)
												return daysLeft > 0 ? "Ativo" : "Fechado"
											})()}
										</TableCell>
										<TableCell>{job.applicantsCount || 0}</TableCell>
										<TableCell>
											{(() => {
												const currentDate = new Date()
												const closeDate = new Date(job.closeDate)
												const daysLeft = Math.ceil(
													(closeDate - currentDate) /
													(1000 * 60 * 60 * 24)
												)
												return daysLeft > 0 ? `${daysLeft} dias` : "Expirado"
											})()}
										</TableCell>
										<TableCell>
											{userRole === "recruiter" && (
												<>
													<IconButton
														color="primary"
														onClick={() => handleEditJob(job)}
													>
														<Edit />
													</IconButton>
													<IconButton
														color="secondary"
														onClick={() => handleDeleteJob(job)}
													>
														<Delete />
													</IconButton>
													<IconButton
														color="default"
														onClick={() => handleShare(job)}
													>
														<Share />
													</IconButton>
													<IconButton
														color="info"
														onClick={() =>
															navigate(`/candidates/${job.id}`)
														}
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
						totalItems={filteredJobs.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={handlePageChange}
						onItemsPerPageChange={handleItemsPerPageChange}
					/>
				</>
			)}
			<ShareModal
				open={isShareModalOpen}
				onClose={handleCloseShareModal}
				link={shareLink}
			/>
			<Modal open={isApplyModalOpen} onClose={handleCloseApplyModal}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						boxShadow: 24,
						borderRadius: 2,
						p: 4,
					}}
				>
					<Typography variant="h6" sx={{ mb: 2 }}>
						{selectedJob?.title}
					</Typography>
					<Typography variant="subtitle1" sx={{ mb: 2 }}>
						{selectedJob?.location}
					</Typography>
					<Typography variant="body1" sx={{ mb: 3 }}>
						{selectedJob?.description}
					</Typography>

					{selectedJob?.isApplied ? (
						<Typography
							variant="body2"
							sx={{
								color: "green",
								fontWeight: "bold",
								textAlign: "center",
								backgroundColor: "#e8f5e9",
								padding: "8px",
								borderRadius: "4px",
							}}
						>
							Você está inscrito na vaga
						</Typography>
					) : (
						<Button
							variant="contained"
							color="success"
							fullWidth
							onClick={handleApply}
							disabled={selectedJob?.status === "Fechado"}
						>
							Inscrever-se
						</Button>
					)}
				</Box>
			</Modal>
		</Box>

	)
}

export default Dashboard
