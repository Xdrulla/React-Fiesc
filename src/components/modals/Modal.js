import React from "react"
import { Box, Button, TextField, Typography, IconButton, Modal } from "@mui/material"
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
			<Box className="share-modal">
				<Typography variant="h6" className="modal-title">
					Compartilhar Link da Vaga
				</Typography>
				<Box className="modal-content">
					<TextField
						value={link}
						className="read-only-text"
						InputProps={{
							readOnly: true,
						}}
					/>
					<IconButton onClick={handleCopyAndClose} className="copy-button">
						<ContentCopy />
					</IconButton>
				</Box>
				<Button fullWidth variant="contained" className="close-button" onClick={handleClose}>
					Fechar
				</Button>
			</Box>
		</Modal>
	)
}

export default ShareModal
