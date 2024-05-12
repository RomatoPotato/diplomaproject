export default class FilesManager {
    static save(dataToSave, fileName){
        const file = new Blob(dataToSave, {type: "text/plain"});
        const element = document.createElement("a");
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        element.click();
        URL.revokeObjectURL(element.href);
    }
}