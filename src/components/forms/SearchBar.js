import React from "react"
import { Box, TextField, IconButton } from "@mui/material"
import { Search, Clear } from "@mui/icons-material"

const SearchBar = ({ searchQuery, setSearchQuery, placeholder = "Buscar..." }) => {
	const handleClear = () => {
		setSearchQuery("")
	}

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
			<TextField
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				placeholder={placeholder}
				fullWidth
				variant="outlined"
				size="small"
				sx={{ flex: 1 }}
			/>
			{searchQuery ? (
				<IconButton onClick={handleClear} color="secondary">
					<Clear />
				</IconButton>
			) : (
				<IconButton disabled>
					<Search />
				</IconButton>
			)}
		</Box>
	)
}

export default SearchBar
