export default function CurrencyConverter(e: React.ChangeEvent<HTMLInputElement>){
    const inputValue = e.target.value;
    let h = 0;
    let u = inputValue.length;
    let l = "";
    let r = ",";
    let eDot = ".";

    for (h = 0; h < u && ("0" === inputValue.charAt(h) || inputValue.charAt(h) === r); h++) {}
    for (l = ""; h < u; h++) {
        -1 !== "0123456789".indexOf(inputValue.charAt(h)) && (l += inputValue.charAt(h));
    }

    if (l === "") {
        return("");
    }

    if (l.length === 1) {
        return("0" + r + "0" + l);
    }

    if (l.length === 2) {
        return("0" + r + l);
    }

    let ajd2 = "";
    let j = 0;

    for (h = l.length - 3; h >= 0; h--) {
        3 === j && (ajd2 += eDot, j = 0);
        ajd2 += l.charAt(h);
        j++;
    }

    let finalValue = "";
    for (let i = ajd2.length - 1; i >= 0; i--) {
        finalValue += ajd2.charAt(i);
    }

    finalValue += r + l.substr(l.length - 2, l.length);

    return finalValue
}