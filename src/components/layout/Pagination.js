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
    <Box className="pagination">
      <FormControl className="pagination-form-control" size="small">
        <InputLabel>Itens por Página</InputLabel>
        <Select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(parseInt(e.target.value, 10))}
          className="pagination-select"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>

      <Box className="pagination-actions">
        <Button
          variant="outlined"
          size="small"
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Voltar
        </Button>
        <Typography className="pagination-text">
          Página {currentPage} de {totalPages}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Avançar
        </Button>
      </Box>

      <FormControl className="pagination-form-control" size="small">
        <InputLabel>Ir para Página</InputLabel>
        <Select
          value={currentPage}
          onChange={handleGoToPage}
          className="pagination-select"
        >
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
