import React from "react"
import { Box, TextField, IconButton } from "@mui/material"
import { Search, Clear } from "@mui/icons-material"

const SearchBar = ({ searchQuery, setSearchQuery, placeholder = "Buscar..." }) => {
	const handleClear = () => {
		setSearchQuery("")
	}

	return (
		<Box className="search-bar">
			<TextField
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				placeholder={placeholder}
				fullWidth
				variant="outlined"
				size="small"
				className="text-field"
			/>
			{searchQuery ? (
				<IconButton onClick={handleClear} color="secondary" className="icon-button">
					<Clear />
				</IconButton>
			) : (
				<IconButton disabled className="icon-button">
					<Search />
				</IconButton>
			)}
		</Box>
	)
}

export default SearchBar
