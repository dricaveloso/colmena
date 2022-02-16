import Swal from "sweetalert2";
import theme from "@/styles/theme";

type PropsTypeToast = "success" | "warning" | "error" | "info";

const objColor: any = {
  success: "#DCEAFB",
  warning: "#F39B10",
  error: "#F65B3A",
  info: theme.palette.variation4.main,
};

export function toast(message: string, type: PropsTypeToast = "info", customConfig = {}) {
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 5000,
    color: "#000",
    background: objColor[type],
    timerProgressBar: true,
    showCloseButton: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    ...customConfig,
  });

  Toast.fire({
    // icon: type,
    title: message,
    customClass: {
      container: "my-swal",
    },
  });
}
