import React, { useState, useEffect } from "react"
import {
	Box,
	Button,
	TextField,
	Typography,
	IconButton,
	Select,
	MenuItem,
	InputAdornment,
	Modal,
} from "@mui/material"
import Swal from "sweetalert2"
import { Add, Close, ContentCopy } from "@mui/icons-material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { auth, db } from "../../service/firebase"
import { collection, doc, setDoc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { jobSchema } from "../../helper/validations"

const InsertJob = () => {
	const navigate = useNavigate()
	const [skills, setSkills] = useState([])
	const [contractTypes, setContractTypes] = useState([])
	const [experienceLevels, setExperienceLevels] = useState([])
	const [newSkillDesired, setNewSkillDesired] = useState("")
	const [newSkillRequired, setNewSkillRequired] = useState("")
	const [requiredSkills, setRequiredSkills] = useState([])
	const [desiredSkills, setDesiredSkills] = useState([])
	const [jobData, setJobData] = useState([])
	const [link, setLink] = useState("")
	const [isModalOpen, setIsModalOpen] = useState(false)


	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(jobSchema),
		defaultValues: {
			title: "",
			description: "",
			experienceRequired: "",
			location: "",
			openDate: "",
			closeDate: "",
			salaryMin: "",
			salaryMax: "",
			contractType: "",
			skillsRequired: [],
			skillsDesired: [],
		},
	})

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const settingsRef = doc(db, "settings", "global")
				const settingsSnap = await getDoc(settingsRef)

				if (settingsSnap.exists()) {
					const data = settingsSnap.data()
					setSkills(data.skills || [])
					setContractTypes(data.contractTypes || [])
					setExperienceLevels(data.experienceLevels || [])
				}
			} catch (error) {
				console.error("Erro ao buscar configurações:", error)
			}
		}

		fetchSettings()
	}, [])

	const handleAddRequiredSkill = () => {
		if (newSkillRequired && !requiredSkills.includes(newSkillRequired)) {
			setRequiredSkills([...requiredSkills, newSkillRequired])
			setValue("skillsRequired", [...requiredSkills, newSkillRequired])
			setNewSkillRequired("")
		}
	}

	const handleAddDesiredSkill = () => {
		if (newSkillDesired && !desiredSkills.includes(newSkillDesired)) {
			setDesiredSkills([...desiredSkills, newSkillDesired])
			setNewSkillDesired("")
		}
	}

	const handleRemoveRequiredSkill = (skill) => {
		setRequiredSkills(requiredSkills.filter((s) => s !== skill))
	}

	const handleRemoveDesiredSkill = (skill) => {
		setDesiredSkills(desiredSkills.filter((s) => s !== skill))
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setJobData((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const onSubmit = async (data) => {
		try {
			// Verificar autenticação
			if (!auth.currentUser) {
				console.error("Usuário não autenticado.")
				alert("Você precisa estar autenticado para salvar uma vaga.")
				return
			}

			const jobsCollection = collection(db, "jobs")
			const jobId = `job-${Date.now()}`
			const jobDoc = {
				...data,
				creatorId: auth.currentUser?.uid,
				openDate: new Date(data.openDate).toISOString(),
				closeDate: new Date(data.closeDate).toISOString(),
			}

			await setDoc(doc(jobsCollection, jobId), jobDoc)

			const generatedLink = `${window.location.origin}/job-details/${jobId}`
			setLink(generatedLink)
			setIsModalOpen(true)

		} catch (error) {
			console.error("Erro ao salvar vaga:", error)
			alert("Ocorreu um erro ao salvar a vaga. Por favor, tente novamente.")
		}
	}

	const handleCancel = () => {
		reset()
		navigate("/dashboard")
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(link)
		Swal.fire({
			position: "top-end",
			icon: "success",
			title: "Link copiado com sucesso!",
			showConfirmButton: false,
			timer: 1500,
			toast: true,
		})
		navigate("/dashboard")
	}

	const closeModalAndRedirect = () => {
		setIsModalOpen(false)
		navigate("/dashboard")
	}

	return (
		<Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
			<Typography variant="h5" sx={{ mb: 3 }}>
				Inserir Vagas
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="title"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Título da vaga"
							fullWidth
							margin="normal"
							error={!!errors.title}
							helperText={errors.title?.message}
						/>
					)}
				/>

				<Controller
					name="description"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Descrição"
							fullWidth
							margin="normal"
							multiline
							rows={4}
							error={!!errors.description}
							helperText={errors.description?.message}
						/>
					)}
				/>

				<Controller
					name="experienceRequired"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							fullWidth
							displayEmpty
							error={!!errors.experienceRequired}
							sx={{ mt: 2, mb: 2 }}
						>
							<MenuItem value="" disabled>
								Selecione o nível de experiência
							</MenuItem>
							{experienceLevels.map((level) => (
								<MenuItem key={level} value={level}>
									{level}
								</MenuItem>
							))}
						</Select>
					)}
				/>
				<Typography color="error" variant="caption">
					{errors.experienceRequired?.message}
				</Typography>

				<Box sx={{ display: "flex", gap: 2 }}>
					<Box sx={{ flex: 1 }}>
						<Typography>Habilidades Requeridas</Typography>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
							<TextField
								fullWidth
								value={newSkillRequired}
								onChange={(e) => setNewSkillRequired(e.target.value)}
								placeholder="Adicionar ou selecionar habilidade"
								label="Habilidade"
								InputProps={{
									endAdornment: (
										<IconButton color="primary" onClick={handleAddRequiredSkill}>
											<Add />
										</IconButton>
									),
								}}
							/>
							<Select
								value=""
								onChange={(e) => setNewSkillRequired(e.target.value)}
								displayEmpty
							>
								<MenuItem value="" disabled>
									Selecionar da lista
								</MenuItem>
								{skills.map((skill) => (
									<MenuItem key={skill} value={skill}>
										{skill}
									</MenuItem>
								))}
							</Select>
						</Box>
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
							{requiredSkills.map((skill) => (
								<Box
									key={skill}
									sx={{
										display: "flex",
										alignItems: "center",
										backgroundColor: "#f0f0f0",
										px: 1,
										borderRadius: 1,
									}}
								>
									<Typography>{skill}</Typography>
									<IconButton
										size="small"
										onClick={() => handleRemoveRequiredSkill(skill)}
									>
										<Close fontSize="small" />
									</IconButton>
								</Box>
							))}
						</Box>
						<Typography color="error" variant="caption">
							{errors.skillsRequired?.message}
						</Typography>
					</Box>
					<Box sx={{ flex: 1 }}>
						<Typography>Habilidades Desejáveis</Typography>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
							<TextField
								fullWidth
								value={newSkillDesired}
								onChange={(e) => setNewSkillDesired(e.target.value)}
								placeholder="Adicionar ou selecionar habilidade"
								label="Habilidade"
								InputProps={{
									endAdornment: (
										<IconButton color="primary" onClick={handleAddDesiredSkill}>
											<Add />
										</IconButton>
									),
								}}
							/>
							<Select
								value=""
								onChange={(e) => setNewSkillDesired(e.target.value)}
								displayEmpty
							>
								<MenuItem value="" disabled>
									Selecionar da lista
								</MenuItem>
								{skills.map((skill) => (
									<MenuItem key={skill} value={skill}>
										{skill}
									</MenuItem>
								))}
							</Select>
						</Box>
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
							{desiredSkills.map((skill) => (
								<Box
									key={skill}
									sx={{
										display: "flex",
										alignItems: "center",
										backgroundColor: "#f0f0f0",
										px: 1,
										borderRadius: 1,
									}}
								>
									<Typography>{skill}</Typography>
									<IconButton
										size="small"
										onClick={() => handleRemoveDesiredSkill(skill)}
									>
										<Close fontSize="small" />
									</IconButton>
								</Box>
							))}
						</Box>
					</Box>
				</Box>
				<Controller
					name="location"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Localização"
							fullWidth
							margin="normal"
							placeholder="Exemplo: Remoto, Presencial, Híbrido"
							error={!!errors.location}
							helperText={errors.location?.message}
						/>
					)}
				/>
				<Controller
					name="openDate"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Data de abertura"
							type="date"
							fullWidth
							margin="normal"
							InputLabelProps={{ shrink: true }}
							error={!!errors.openDate}
							helperText={errors.openDate?.message}
						/>
					)}
				/>

				<Controller
					name="closeDate"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Data de fechamento"
							type="date"
							fullWidth
							margin="normal"
							InputLabelProps={{ shrink: true }}
							error={!!errors.closeDate}
							helperText={errors.closeDate?.message}
						/>
					)}
				/>
				<Box sx={{ display: "flex", gap: 2 }}>
					<TextField
						label="Salário Mínimo"
						name="salaryMin"
						type="number"
						fullWidth
						margin="normal"
						value={jobData.salaryMin}
						onChange={handleChange}
						InputProps={{
							startAdornment: <InputAdornment position="start">R$</InputAdornment>,
						}}
						error={!!errors.salaryMin}
						helperText={errors.salaryMin?.message}
					/>
					<TextField
						label="Salário Máximo"
						name="salaryMax"
						type="number"
						fullWidth
						margin="normal"
						value={jobData.salaryMax}
						onChange={handleChange}
						InputProps={{
							startAdornment: <InputAdornment position="start">R$</InputAdornment>,
						}}
						error={!!errors.salaryMax}
						helperText={errors.salaryMax?.message}
					/>
				</Box>
				<Controller
					name="contractType"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							fullWidth
							displayEmpty
							error={!!errors.contractType}
							sx={{ mt: 2 }}
						>
							<MenuItem value="" disabled>
								Selecione o tipo de contrato
							</MenuItem>
							{contractTypes.map((type) => (
								<MenuItem key={type} value={type}>
									{type}
								</MenuItem>
							))}
						</Select>
					)}
				/>
				<Typography color="error" variant="caption">
					{errors.contractType?.message}
				</Typography>

				<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
					<Button variant="outlined" color="secondary" onClick={handleCancel}>
						Cancelar
					</Button>
					<Button type="submit" variant="contained" color="primary">
						Salvar Vaga
					</Button>
				</Box>
			</form>

			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
					}}
				>
					<Typography variant="h6" sx={{ mb: 2 }}>
						Compartilhar Link da Vaga
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<TextField
							value={link}
							fullWidth
							InputProps={{
								readOnly: true,
							}}
						/>
						<IconButton onClick={handleCopy} color="primary">
							<ContentCopy />
						</IconButton>
					</Box>
					<Button
						fullWidth
						variant="contained"
						sx={{ mt: 2 }}
						onClick={closeModalAndRedirect}
					>
						Fechar
					</Button>
				</Box>
			</Modal>
		</Box>
	)
}

export default InsertJob
