import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material"
import { yupResolver } from "@hookform/resolvers/yup"
import { candidateAdditionalSchema } from "../../common/utils/validations"
import { auth, db } from "../../service/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { showProfileCompletionAlert } from "../../helper/alert"
import { useAuthState } from "react-firebase-hooks/auth"
import TextMaskCustom from "../../common/MaskedInput"

const AddInformationCandidate = () => {
	const [user] = useAuthState(auth)
	const navigate = useNavigate()
	const { control, handleSubmit } = useForm({
		resolver: yupResolver(candidateAdditionalSchema),
		defaultValues: {
			phone: "",
		},
	})

	const [experienceLevels, setExperienceLevels] = useState([])
	const [skills, setSkills] = useState([])
	const [newSkill, setNewSkill] = useState("")

	useEffect(() => {
		const fetchSettings = async () => {
			try {
				const settingsRef = doc(db, "settings", "global")
				const settingsSnap = await getDoc(settingsRef)

				if (settingsSnap.exists()) {
					const data = settingsSnap.data()
					setExperienceLevels(data.experienceLevels || [])
					setSkills(data.skills || [])
				}
			} catch (error) {
				console.error("Erro ao buscar configurações:", error)
			}
		}

		fetchSettings()

		showProfileCompletionAlert(
			() => console.log("Usuário escolheu completar agora."),
			() => navigate("/dashboard")
		)
	}, [navigate])

	const handleNewSkill = () => {
		if (newSkill && !skills.includes(newSkill)) {
			setSkills([...skills, newSkill])
			setNewSkill("")
		}
	}

	const onSubmit = async (data) => {
		try {
			console.log("Dados enviados:", data);
			const userId = user?.uid
			if (!userId) {
				console.error("Usuário não autenticado.")
				return
			}

			console.log("ID do usuário:", userId)

			const updateData = {
				workExperience: data.workExperience,
				skills: data.skills,
				experienceLevel: data.experienceLevel,
				salaryRange: {
					min: data.minSalary,
					max: data.maxSalary,
				},
				phone: data.phone,
			}

			console.log("Dados para atualizar:", updateData)

			await updateDoc(doc(db, "users", userId), updateData)
			console.log("Informações adicionais adicionadas com sucesso!")
			navigate("/dashboard")
		} catch (error) {
			console.error("Erro ao atualizar informações do candidato: ", error)
		}
	}

	return (
		<Box
			sx={{
				maxWidth: 600,
				mx: "auto",
				mt: 5,
				p: 3,
				boxShadow: 3,
				borderRadius: 2,
				backgroundColor: "#fff",
			}}
		>
			<Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
				Completar Perfil - Candidato
			</Typography>
			<form
				onSubmit={(e) => {
					console.log("Formulário enviado")
					handleSubmit(onSubmit)(e)
				}}
			>
				<Controller
					name="workExperience"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Experiência Profissional"
							fullWidth
							margin="normal"
							multiline
							rows={4}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)}
				/>
				<Controller
					name="skills"
					control={control}
					render={({ field }) => (
						<Box>
							<TextField
								select
								{...field}
								label="Habilidades"
								fullWidth
								margin="normal"
								SelectProps={{
									multiple: true,
									value: field.value || [],
									onChange: (event) => field.onChange(event.target.value),
								}}
							>
								{skills.map((skill) => (
									<MenuItem key={skill} value={skill}>
										{skill}
									</MenuItem>
								))}
							</TextField>
							<Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
								<TextField
									label="Adicionar Nova Habilidade"
									value={newSkill}
									onChange={(e) => setNewSkill(e.target.value)}
									fullWidth
									margin="normal"
								/>
								<Button
									variant="contained"
									sx={{ marginLeft: 2, height: "56px" }}
									onClick={handleNewSkill}
								>
									Adicionar
								</Button>
							</Box>
						</Box>
					)}
				/>
				<Controller
					name="experienceLevel"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							select
							{...field}
							label="Tempo de Experiência"
							fullWidth
							margin="normal"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						>
							{experienceLevels.map((level) => (
								<MenuItem key={level} value={level}>
									{level}
								</MenuItem>
							))}
						</TextField>
					)}
				/>
				<Controller
					name="minSalary"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Salário Mínimo"
							type="number"
							fullWidth
							margin="normal"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)}
				/>
				<Controller
					name="maxSalary"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							label="Salário Máximo"
							type="number"
							fullWidth
							margin="normal"
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)}
				/>
				<Controller
					name="phone"
					control={control}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							fullWidth
							margin="normal"
							InputProps={{
								inputComponent: TextMaskCustom,
							}}
							error={!!fieldState.error}
							helperText={fieldState.error?.message}
						/>
					)}
				/>
				<Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
					Salvar
				</Button>
			</form>
		</Box>
	)
}

export default AddInformationCandidate
