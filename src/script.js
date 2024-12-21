"use strict";
// initialising years
(() => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear];
    for (let i = 1; i <= 3; i++) {
        years.push(currentYear - i);
    }
    const yearSelect = document.querySelector("#year");
    if (!yearSelect)
        return;
    years.forEach((year) => {
        const option = document.createElement("option");
        const yearStr = year.toString();
        option.value = yearStr;
        option.text = yearStr;
        yearSelect.appendChild(option);
    });
})();
