import React from "react"
import { Navigate } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../service/firebase"
import { CircularProgress, Box } from "@mui/material"

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth)

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute