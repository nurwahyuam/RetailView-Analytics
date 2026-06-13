import Swal from "sweetalert2";

const toast = Swal.mixin({
  confirmButtonColor: "#37575a", 
  cancelButtonColor: "#64748b",
  fontFamily: "'Outfit', sans-serif",
});

export const useAlert = {
  success(message, title = "Berhasil!") {
    return toast.fire({
      icon: "success",
      title: title,
      text: message,
    });
  },

  error(message, title = "Gagal!") {
    return toast.fire({
      icon: "error",
      title: title,
      text: message,
    });
  },

  confirm(message, title = "Apakah kamu yakin?") {
    return toast.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Lanjutkan!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });
  },
};
