let tax = 0;
const eng = {
    name: "Manish",
    sal: 5000000
}

if (eng.sal <= 500000) {
    tax = eng.sal * 0.1;
} else if (eng.sal <= 1000000) {
    tax = 500000 * 0.1 + (eng.sal - 500000) * 0.15;
} else if (eng.sal <= 1700000) {
    tax = 500000 * 0.1 + 500000 * 0.15 + (eng.sal - 1000000) * 0.25;
} else if (eng.sal <= 2700000) {
    tax = 500000 * 0.1 + 500000 * 0.15 + 700000 * 0.25 + (eng.sal - 1700000) * 0.3;
} else {
    tax = 500000 * 0.1 + 500000 * 0.15 + 700000 * 0.25 + 1000000 * 0.3 + (eng.sal - 2700000) * 0.36;
}

console.log("Tax Amount:");
console.log(tax);
console.log("Monthly Salary:");
console.log((eng.sal - tax) / 12);
console.log("Annual Salary:");
console.log(eng.sal - tax);
