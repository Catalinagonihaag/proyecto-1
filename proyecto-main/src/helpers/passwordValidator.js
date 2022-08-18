export function passwordValidator(password) {
  if (!password) return "Esto no puede quedar vacío."
  if (password.length < 5) return 'Las contraseñas deben tener al menos 5 caracteres.'
  return ''
}
