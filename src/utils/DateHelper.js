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
    static getDayMonth(stringDate){
        const [day, month, ] = stringDate.split(".");

        return `${day} ${months[Number(month) - 1]}`;
    }
}