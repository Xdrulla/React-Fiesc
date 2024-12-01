import React from "react"
import {
	Box,
	Button,
	TextField,
	Typography,
	IconButton,
	Modal,
} from "@mui/material"
import { ContentCopy } from "@mui/icons-material"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const ShareModal = ({ open, onClose, link }) => {
	const navigate = useNavigate()

	const handleCopyAndClose = () => {
		navigator.clipboard.writeText(link)
		Swal.fire({
			position: "top-end",
			icon: "success",
			title: "Link copiado com sucesso!",
			showConfirmButton: false,
			timer: 1500,
			toast: true,
		})
		onClose()
		navigate("/dashboard")
	}

	const handleClose = () => {
		onClose()
		navigate("/dashboard")
	}

	return (
		<Modal open={open} onClose={handleClose}>
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
					<IconButton onClick={handleCopyAndClose} color="primary">
						<ContentCopy />
					</IconButton>
				</Box>
				<Button
					fullWidth
					variant="contained"
					sx={{ mt: 2 }}
					onClick={handleClose}
				>
					Fechar
				</Button>
			</Box>
		</Modal>
	)
}

export default ShareModal
