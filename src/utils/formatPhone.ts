export default function FormatPhoneNumber(event: React.ChangeEvent<HTMLInputElement>): string {
    let input = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  
    // Limita o número de caracteres a 11 (DDD + 9 dígitos)
    if (input.length > 11) {
      input = input.slice(0, 11);
    }
  
    // Formata o número conforme a quantidade de dígitos
    if (input.length <= 2) {
      input = `(${input}`;
    } else if (input.length <= 6) {
      input = `(${input.slice(0, 2)})${input.slice(2)}`;
    } else if (input.length <= 10) {
      input = `(${input.slice(0, 2)})${input.slice(2, 7)}-${input.slice(7)}`;
    } else {
      input = `(${input.slice(0, 2)})${input.slice(2, 7)}-${input.slice(7, 11)}`;
    }
  
    return input; // Retorna o valor formatado
  
}
