export default function PriceToNumber(value:string) {
    const numberValue = value
    .replace('R$', '')           
    .replace(/\./g, '')          
    .replace(',', '.')           
    .trim();  
    return parseFloat(numberValue);
}