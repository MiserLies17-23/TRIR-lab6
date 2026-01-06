import {Api} from './Api.js'

/**
 * Функционал страницы редактирования/добавления устройств 
 * 
 * @returns {void}
 */
$(document).ready(function() {

    const ERROR_CONTEINER = $('#error-message');
    const HEADER = $('#header');

    const ACTION = localStorage.getItem('action');
    let USER_DATA = JSON.parse(localStorage.getItem('currentUser'));
    const ID = parseInt(localStorage.getItem('currentApplication'));

    loadFormParams();

    /**
     * Функция заполнения формы 
     * 
     * @returns {void}
     */
    function loadFormParams() {
        if (ACTION === 'add')
            HEADER.text("Добавьте устройство");
        else if (ACTION === 'edit') {
            HEADER.text("Редактируйте данные устройства");
            const PARAMS = localStorage.getItem('currentApplication');
            if (!PARAMS) {
                alert('Устройство не распознано!');
                window.location.href = './cabinet.html';
            }
            loadCurrentParams();
        } else {
            alert('Действие не распознано!');
            window.location.href = '../../index.html';
        }
    }

    /**
     * Обработчик событий для кнопки "Сохранить"
     * 
     * @listens submit
     * @returns {void}
     */
    $('#application-form').on('submit', async function(e) {
        e.preventDefault();

        try {
            if (!USER_DATA) {
                alert('Пользователь не распознан! Вы будете возвращены на страницу входа...')
                localStorage.removeItem('currentUser');
                window.location.href = '../../index.html'
            }

            if (ACTION === 'add') {
                $('#next-button').click(addApplication());
            } else if (ACTION === 'edit') {
                $('#next-button').click(editApplication());
            } else {
                alert('Действие не распознано!');
                window.location.href = '../../index.html';
            }
        } catch {
            alert("Ошибка загрузки данных!");
            window.location.href = "./cabinet.html";
        }
    })

    /**
     * Функция добавления нового устройства
     * 
     * @async
     * @returns {void}
     */
    async function addApplication() {
        const USER_PARAMS = {
            login : USER_DATA.login,
            id : USER_DATA.applications.length,
            type : $('#type').val(),
            company : $('#company').val().trim(),
            model : $('#model').val().trim()
        };

        try {
            const API = new Api('../../back/endpoint/addApplication.php');
            const RESULT = await API.post(USER_PARAMS); 
            if (RESULT.success) {
                updateLocalStorage(USER_PARAMS);
                alert(RESULT.message);
                window.location.href = "./cabinet.html";
            } else {
                ERROR_CONTEINER.text(RESULT.message || 'Ошибка добавления данных!');
            }
        } catch (error) {
            ERROR_CONTEINER.text("Ошибка добавления данных");
            console.log(error);
        }
    }

    /**
     * Функция изменения данных об устройстве
     * 
     * @async
     * @returns {void}
     */
    async function editApplication() {
        const USER_PARAMS = {
            login : USER_DATA.login,
            id : ID,
            type : $('#type').val(),
            company : $('#company').val().trim(),
            model : $('#model').val().trim()
        }
        try {
            const API = new Api('../../back/endpoint/editApplication.php');
            const RESULT = await API.post(USER_PARAMS); 
            if (RESULT.success) {
                updateLocalStorage(USER_PARAMS);
                alert(RESULT.message);
                window.location.href = "./cabinet.html";
            } else {
                ERROR_CONTEINER.text(RESULT.message || 'Ошибка сохранения данных!');
            }
        } catch (error) {
            ERROR_CONTEINER.text("Ошибка загрузки данных");
            console.log(error);
        }
    }

    /**
     * Функция вывода данных пользователя
     * 
     * @returns {void}
     */
    function loadCurrentParams() {
        try {
            let currentId = parseInt(ID);

            let application = USER_DATA.applications[currentId];

            let currentType = application.type;
            let currentCompany = application.company;
            let currentModel = application.model;

            $('#type').val(currentType || '');
            $('#company').val(currentCompany || '');
            $('#model').val(currentModel || '');
        } catch (error) {
            console.log("Ошибка загрузки данных: ", error);
        }
        
    }

    /**
     * Метод обновления пользовательтских данных в localStorage
     * 
     * @param {array} updatedParams обновлённые данные пользователя
     * @returns {void}
     */
    function updateLocalStorage(updatedParams) {
        
        const updatedUserData = {...USER_DATA};
        
        // Проверяем существование applications
        if (!updatedUserData.applications) {
            updatedUserData.applications = [];
        }
        
        // Обновляем данные устройства
        if (updatedUserData.applications[ID]) {
            updatedUserData.applications[ID] = {
                type: updatedParams.type,
                company: updatedParams.company,
                model: updatedParams.model
            };
        }
        
        // Сохраняем обновленные данные в localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
    }

    /**
     * Функция для кнопки возвращения
     * 
     * @listens click
     * @returns {void}
     */
    $('#back-button').click(function() {
        window.location.href = './cabinet.html';
    })
    
})