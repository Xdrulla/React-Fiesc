import React from "react"
import { Routes, Route } from "react-router-dom"
import RegisterPage from "../components/pages/RegisterPage"
import RecruiterRegisterPage from "../components/pages/RecruiterPage"
import CandidateRegisterPage from "../components/pages/CandidatePage"
import Login from "../components/pages/Login"
import AddInformationRecruiter from "../components/pages/AddInformationRecruiter"
import AddInformationCandidate from "../components/pages/AddInformationCandidate"
import ProtectedRoute from "./ProtectedRoute"
import Dashboard from "../components/pages/Dashboard"
import MyProfile from "../components/pages/MyProfile"
import CandidateList from "../components/pages/CandidateList"
import CandidateDetails from "../components/pages/CandidateDetails"
import MyApplications from "../components/pages/MyApplications"
import JobDetails from "../components/pages/JobDetails"

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/recruiter" element={<RecruiterRegisterPage />} />
      <Route path="/register/candidate" element={<CandidateRegisterPage />} />
      <Route path="/candidates/:jobId" element={<CandidateList />} />
      <Route path="/candidate-details/:candidateId" element={<CandidateDetails />} />
      <Route path="/job-details/:jobId" element={<JobDetails />} />
      <Route
        path="/add-info/recruiter"
        element={
          <ProtectedRoute>
            <AddInformationRecruiter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-info/candidate"
        element={
          <ProtectedRoute>
            <AddInformationCandidate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-applications"
        element={
          <ProtectedRoute>
            <MyApplications />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes
