import React from "react"
import { Box, Button, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material"

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleGoToPage = (event) => {
    const page = parseInt(event.target.value, 10)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderTop: "1px solid #ccc",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
      }}
    >
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Itens por Página</InputLabel>
        <Select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value, 10))}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Voltar
        </Button>
        <Typography>
          Página {currentPage} de {totalPages}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Avançar
        </Button>
      </Box>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Ir para Página</InputLabel>
        <Select value={currentPage} onChange={handleGoToPage}>
          {Array.from({ length: totalPages }, (_, index) => (
            <MenuItem key={index + 1} value={index + 1}>
              {index + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default Pagination
