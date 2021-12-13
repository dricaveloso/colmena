import Swal from "sweetalert2";

type PropsTypeToast = "success" | "warning" | "error" | "info";

export function toast(message: string, type: PropsTypeToast = "info") {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: type,
    title: message,
    customClass: {
      container: "my-swal",
    },
  });
}
