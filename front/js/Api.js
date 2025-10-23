/**
 * Класс запросов Api
 */
export class Api {
    /**
     * Конструктор с парметром
     * 
     * @param {string} url путь к файлу на бэке
     */
    constructor(url) {
        this.url = url;
    }

    /**
     * Метод отправки пользовательских данных на сервер
     * 
     * @param {Array} userData пользовательсике данные
     * @returns 
     */
    post(userData) {
        return $.ajax({
            url : this.url,
            type : "POST",
            contentType: "application/json",
            data: JSON.stringify(userData),
            dataType: "json"
        });
    }

    /**
     * Метод получения данных с сервера
     * 
     * @param {Array} params параметры запросы
     * @returns 
     */
    get(params = {}) {
        return $.ajax({
            url : this.url,
            type : "GET",
            data : params,
            dataType : 'json'
        })
    }
}