const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
]

export default class DateHelper {
    static getFormattedDay(stringDate){
        const [, month, day] = stringDate.split(".");

        return `${day} ${months[Number(month) - 1]}`;
    }

    static getFormattedDate(date){
        const stringDate = new Intl.DateTimeFormat().format(new Date(date));
        const dateInArray = stringDate.split(".");

        return dateInArray.reverse().join(".");
    }
}