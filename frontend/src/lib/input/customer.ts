export function phoneAdjust(p: string) {
  p = p.replace(/\D/g, ""); //Remove tudo o que não é dígito
  p = p.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
  p = p.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
  return p;
}
