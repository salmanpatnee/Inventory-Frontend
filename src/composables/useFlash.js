export function useFlash() {
  function flash(message, type) {
    Toast.fire({
      icon: type,
      title: message,
    });
  }

  function flashSuccess(message = "Done") {
    flash(message, "success");
  }

  function flashError(message = "An unexpected error occurred.") {
    flash(message, "error");
  }

  function confirmAtts() {
    return {
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    };
  }
  return { flash, flashSuccess, flashError, confirmAtts };
}
