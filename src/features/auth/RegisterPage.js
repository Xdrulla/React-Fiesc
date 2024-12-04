import React from "react"
import { Box, Button } from "@mui/material"
import { Link } from "react-router-dom"
import PersonIcon from "@mui/icons-material/Person"
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter"
import Logo from "../../assets/images/logo.webp"

const RegisterPage = () => {
	return (
		<Box className="register-container">
			<Box
				component="img"
				src={Logo}
				alt="Logo Sistema de Recrutamento"
				className="logo"
			/>

			<Button
				variant="contained"
				startIcon={<BusinessCenterIcon />}
				className="recruiter-button"
				component={Link}
				to="/register/recruiter"
			>
				Quero me cadastrar como Recrutador
			</Button>

			<Button
				variant="contained"
				startIcon={<PersonIcon />}
				className="candidate-button"
				component={Link}
				to="/register/candidate"
			>
				Quero me cadastrar como Candidato
			</Button>
		</Box>
	)
}

export default RegisterPage
