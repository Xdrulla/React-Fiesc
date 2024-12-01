import React, { useEffect, useState } from "react"
import { AppBar, Toolbar, Button, Typography, Menu, MenuItem, IconButton } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { AccountCircle } from "@mui/icons-material"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../../service/firebase"

const Header = () => {
  const [user] = useAuthState(auth)
  const [userName, setUserName] = useState("Usuário")
  const [userRole, setUserRole] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserName(userData.name || "Usuário")
            setUserRole(userData.role || "candidate")
          } else {
            console.error("Usuário não encontrado na coleção users.")
          }
        } catch (error) {
          console.error("Erro ao buscar os dados do usuário no Firestore:", error)
        }
      }
    }

    fetchUserData()
  }, [user])

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      navigate("/login")
    } catch (error) {
      console.error("Erro ao sair:", error)
    }
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Sistema de Recrutamento
        </Typography>
        {user ? (
          <div>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
              aria-controls="user-menu"
              aria-haspopup="true"
            >
              <AccountCircle />
              <Typography variant="body1" sx={{ ml: 1 }}>
                {userName}
              </Typography>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => navigate("/profile")}>Meu Perfil</MenuItem>
              {userRole === "recruiter" ? (
                <MenuItem onClick={() => navigate("/dashboard")}>Minhas Vagas</MenuItem>
              ) : (
                <MenuItem onClick={() => navigate("/my-applications")}>
                  Minhas Inscrições
                </MenuItem>
              )}
              {userRole === "candidate" && (
                <MenuItem onClick={() => navigate("/dashboard")}>Vagas</MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/login"
            variant="outlined"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Header
