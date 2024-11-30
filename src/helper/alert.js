import Swal from "sweetalert2";

export const showProfileCompletionAlert = (onContinue, onSkip) => {
  Swal.fire({
    title: "Completar Perfil",
    text: "Deseja completar seu perfil agora ou continuar mais tarde?",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Completar Agora",
    cancelButtonText: "Mais Tarde",
  }).then((result) => {
    if (result.isConfirmed) {
      onContinue()
    } else {
      onSkip()
    }
  })
}
