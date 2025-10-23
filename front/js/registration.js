import { Api } from "./Api.js";

/**
 * Загрузка сервера
 * 
 * @returns {void}
 */
$(document).ready(function() {
    /**
     * Обработчик событий для кнопки "Войти";
     * 
     * @listens click
     * @returns {void}
     */
    $('#ent-button').on('click', function() {
        window.location.href = "../../index.html";
    });

    /**
     * Обработчик событий для кнопки "Регистрация"
     * 
     * @listens submit
     * @returns {void}
     */
    $('#login-form').on('submit', async function(e) {
        e.preventDefault();

        const ERROR_DIV = $('#error-message'); 
        
        if(!isFormFilled()) {
            ERROR_DIV.text("Ошибка! Заполнены не все поля.");
        }

        const NEW_USER = createNewUser();
        const API = new Api("../../back/registration.php"); 

        try {
            const RESULT = await API.post(NEW_USER)
            if (RESULT.success) {
                alert("Регистрация прошла успешна! Теперь вы можете войти в свою учётную запись");
                window.location.href = "../../index.html"; 
            } else {
                ERROR_DIV.text(RESULT.message || "Ошибка входа!");
            }
        } catch {
            ERROR_DIV.text("Ошибка соединения с сервером");
        }
    })

    /**
     * Функция, создающая нового пользователя
     * 
     * @returns {array} USER_PARAMS - параметры пользователя
     */
    function createNewUser () {
        const USER_PARAMS = {
            login : $('#login').val().trim(),
            password : $('#password').val().trim(),
            type : $('#type').val(), 
            company : $('#company').val().trim(),
            model : $('#model').val().trim()
        };
        return USER_PARAMS;
    }

    /**
     * Функция, проверяющая, заполнена форма или нет
     * 
     * @returns {boolean}
     */
    function isFormFilled() {
        const PARAMS = ['#login', '#password', '#type', '#company', '#model']
        for (const PARAM of PARAMS) {
            if (!$(PARAM).val())
                return false;
        }
        return true;
    }
})