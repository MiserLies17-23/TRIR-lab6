import {Api} from "./Api.js";

/**
 * Обработчик событий для кнопки "Регистрация"
 * 
 * @listens click
 * @returns {void}
 */
$(document).ready(function() {
    $('#reg-button').on('click', function() {
        window.location.href = "front/html/registration.html";
    });

    /**
     * Обработчик событий для формы
     * 
     * @listens submit
     * @returns {void}
     */
    $('#login-form').on('submit', async function(e) {
        e.preventDefault();
        
        const ERROR_CONTEINER = $('#error-message'); 
        const LOGIN = $('#login');
        const PASSWORD = $('#password');

        const USER_DATA = {
            login: LOGIN.val().trim(), 
            password: PASSWORD.val().trim(),
        }; 

        const API = new Api("../back/endpoint/login.php");

        try {
            const RESULT = await API.post(USER_DATA);
            console.log(RESULT);

            if (RESULT.success) {
                localStorage.setItem('currentUser', JSON.stringify(RESULT.user))
                window.location.href = "front/html/cabinet.html"; 
            } else {
                ERROR_CONTEINER.text(RESULT.message || "Неверный логин или пароль");
            }
        } catch (error) {
            ERROR_CONTEINER.text("Ошибка соединения с сервером");
        }
    });
});