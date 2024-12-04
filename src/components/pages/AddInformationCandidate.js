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
			const userId = user?.uid
			if (!userId) {
				console.error("Usuário não autenticado.")
				return
			}

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

			await updateDoc(doc(db, "users", userId), updateData)
			navigate("/dashboard")
		} catch (error) {
			console.error("Erro ao atualizar informações do candidato: ", error)
		}
	}

	return (
		<Box className="add-information-candidate">
			<Typography variant="h5" className="form-title">
				Completar Perfil - Candidato
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="workExperience"
					control={control}
					render={({ field, fieldState }) => (
						<Box className="field-wrapper">
							<TextField
								{...field}
								label="Experiência Profissional"
								multiline
								rows={4}
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						</Box>
					)}
				/>
				<Controller
					name="skills"
					control={control}
					render={({ field }) => (
						<Box className="field-wrapper">
							<TextField
								select
								{...field}
								label="Habilidades"
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
							<Box className="skills-wrapper">
								<TextField
									label="Adicionar Nova Habilidade"
									value={newSkill}
									onChange={(e) => setNewSkill(e.target.value)}
									className="add-skill-input"
								/>
								<Button
									variant="contained"
									className="add-skill-button"
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
						<Box className="field-wrapper">
							<TextField
								select
								{...field}
								label="Tempo de Experiência"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							>
								{experienceLevels.map((level) => (
									<MenuItem key={level} value={level}>
										{level}
									</MenuItem>
								))}
							</TextField>
						</Box>
					)}
				/>
				<Controller
					name="minSalary"
					control={control}
					render={({ field, fieldState }) => (
						<Box className="field-wrapper">
							<TextField
								{...field}
								label="Salário Mínimo"
								type="number"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						</Box>
					)}
				/>
				<Controller
					name="maxSalary"
					control={control}
					render={({ field, fieldState }) => (
						<Box className="field-wrapper">
							<TextField
								{...field}
								label="Salário Máximo"
								type="number"
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						</Box>
					)}
				/>
				<Controller
					name="phone"
					control={control}
					render={({ field, fieldState }) => (
						<Box className="field-wrapper">
							<TextField
								{...field}
								InputProps={{
									inputComponent: TextMaskCustom,
								}}
								error={!!fieldState.error}
								helperText={fieldState.error?.message}
							/>
						</Box>
					)}
				/>
				<Button type="submit" variant="contained" className="submit-button">
					Salvar
				</Button>
			</form>
		</Box>
	)
}

export default AddInformationCandidate
