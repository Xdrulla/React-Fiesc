export const calculateCandidateScore = (candidate, job) => {
    let skillWeight = 0.5
    let experienceWeight = 0.3
    let salaryWeight = 0.2
  
    if (!candidate.salaryRange) {
      skillWeight = 0.65
      experienceWeight = 0.35
      salaryWeight = 0
    }
  
    const minSkills = job.skillsRequired || []
    const desiredSkills = job.skillsDesired || []
    const candidateSkills = candidate.skills || []
  
    const minSkillValue = minSkills.length > 0 ? 100 / minSkills.length : 0
    const desiredSkillValue = minSkillValue / 2
  
    let skillScore = 0
    skillScore += minSkills
      .filter((skill) => candidateSkills.includes(skill))
      .length * minSkillValue
    skillScore += desiredSkills
      .filter((skill) => candidateSkills.includes(skill))
      .length * desiredSkillValue
  
    const candidateExperience = parseFloat(candidate.experienceLevel?.replace(/[^\d]/g, "")) || 0
    const requiredExperience = parseFloat(job.experienceRequired?.replace(/[^\d]/g, "")) || 0
  
    let experienceScore = 0
    if (candidateExperience >= requiredExperience) {
      experienceScore = 100
    } else if (requiredExperience > 0) {
      experienceScore = (candidateExperience / requiredExperience) * 100
    }
  
    let salaryScore = 0
    if (candidate.salaryRange && job.salaryMin && job.salaryMax) {
      const candidateSalary = parseFloat(candidate.salaryRange)
      const jobSalaryMin = parseFloat(job.salaryMin)
      const jobSalaryMax = parseFloat(job.salaryMax)
  
      salaryScore = candidateSalary >= jobSalaryMin && candidateSalary <= jobSalaryMax ? 100 : 0
    }
  
    const finalScore =
      skillScore * skillWeight +
      experienceScore * experienceWeight +
      salaryScore * salaryWeight
  
    return finalScore.toFixed(2)
  }
  