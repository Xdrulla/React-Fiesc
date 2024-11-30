import React from "react";
import { Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Logo from "../../assets/logo.webp"

const RegisterPage = () => {
	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#f4f6f8",
				padding: 2,
			}}
		>

			<Box
				component="img"
				src={Logo}
				alt="Logo Sistema de Recrutamento"
				sx={{
					width: 300,
					height: "auto",
					mb: 4,
				}}
			/>

			<Button
				variant="contained"
				startIcon={<BusinessCenterIcon />}
				sx={{
					mb: 2,
					backgroundColor: "#A5D6A7",
					color: "#000",
					"&:hover": {
						backgroundColor: "#81C784",
					},
				}}
				component={Link}
				to="/register/recruiter"
			>
				Quero me cadastrar como Recrutador
			</Button>

			{/* Botão para Candidato */}
			<Button
				variant="contained"
				startIcon={<PersonIcon />}
				sx={{
					backgroundColor: "#90CAF9",
					color: "#000",
					"&:hover": {
						backgroundColor: "#64B5F6",
					},
				}}
				component={Link}
				to="/register/candidate"
			>
				Quero me cadastrar como Candidato
			</Button>
		</Box>
	)
}

export default RegisterPage
