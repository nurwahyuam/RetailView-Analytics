import Swal from "sweetalert2";

const toast = Swal.mixin({
  confirmButtonColor: "#dc2626",
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

  async confirm(message, title = "Apakah kamu yakin?") {
    const result = await toast.fire({
      title: title,
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Lanjutkan!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    return result.isConfirmed;
  },
};
