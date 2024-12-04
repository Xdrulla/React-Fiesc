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

/**
 * Exibe um alerta de sucesso.
 * @param {string} title - Título do alerta.
 * @param {string} text - Mensagem do alerta.
 */
export const showSuccessAlert = (title, text) => {
	Swal.fire({
		title,
		text,
		icon: "success",
		confirmButtonText: "Ok",
	});
};

/**
 * Exibe um alerta de erro.
 * @param {string} title - Título do alerta.
 * @param {string} text - Mensagem do alerta.
 */
export const showErrorAlert = (title, text) => {
	Swal.fire({
		title,
		text,
		icon: "error",
		confirmButtonText: "Ok",
	});
};

/**
 * Exibe um alerta de aviso.
 * @param {string} title - Título do alerta.
 * @param {string} text - Mensagem do alerta.
 */
export const showWarningAlert = (title, text) => {
	Swal.fire({
		title,
		text,
		icon: "warning",
		confirmButtonText: "Ok",
	});
};

/**
 * Exibe um alerta de confirmação com opções de confirmação/cancelamento.
 * @param {string} title - Título do alerta.
 * @param {string} text - Mensagem do alerta.
 * @returns {Promise<boolean>} - Retorna `true` se confirmado, `false` caso contrário.
 */
export const showConfirmationAlert = async (title, text) => {
	const result = await Swal.fire({
		title,
		text,
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#d33",
		cancelButtonColor: "#3085d6",
		confirmButtonText: "Sim, excluir!",
		cancelButtonText: "Cancelar",
	});
	return result.isConfirmed;
};