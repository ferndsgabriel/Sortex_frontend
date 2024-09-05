export default function DateConverter(date: string | Date) {

    if (typeof date === 'string'){
        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Retorna no formato dd/mm/yyyy
    return `${addAzero(day)}/${addAzero(month + 1)}/${year}`;
}
function addAzero (number:number){
    if (number < 10){
        return `0${number}`
    }else{
        return number;
    }
}