import Swal from "sweetalert2";

type PropsTypeToast = "success" | "warning" | "error" | "info";

export function toast(message: string, type: PropsTypeToast = "info", customConfig = {}) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    showCloseButton: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    ...customConfig,
  });

  Toast.fire({
    icon: type,
    title: message,
    customClass: {
      container: "my-swal",
    },
  });
}
