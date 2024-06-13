export default class FilesManager {
    static save(dataToSave, fileName){
        const file = new Blob(dataToSave, {type: "text/plain"});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        element.click();
        URL.revokeObjectURL(element.href);
    }

    static getFileSize(fileSize) {
        if (fileSize / 1024 < 1) {
            return `${fileSize.toFixed(2)} байт`;
        } else if (fileSize / 1024 / 1024 < 1) {
            return `${(fileSize / 1024).toFixed(2)} Кб`;
        } else {
            return `${(fileSize / 1024 / 1024).toFixed(2)} Мб`;
        }
    }
}