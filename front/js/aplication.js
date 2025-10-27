import {Api} from './Api.js'

$(document).ready(function() {

    const ERROR_CONTEINER = $('#error-message');

    const ACTION = localStorage.getItem('action');
    let USER_DATA = JSON.parse(localStorage.getItem('currentUser'));
    const ID = parseInt(localStorage.getItem('currentApplication'));

    console.log(ID);
    console.log(ACTION);
    console.log(USER_DATA);

    try {
        if (!USER_DATA) {
            alert('Пользователь не распознан! Пожалуйста, вернитесь на страницу входа...')
            localStorage.removeItem('currentUser');
            window.location.href = '../../index.html'
        }

        if (ACTION === 'add') {
            $('#header').text("Добавьте устройство")
            $('#next-button').click(addApplication);
        
        } else if (ACTION === 'edit') {
            const PARAMS = localStorage.getItem('currentApplication');
            if (!PARAMS) {
                alert('Устройство не распознано!');
                window.location.href = './cabinet.html';
            } else {
                $('#header').text("Редактируйте данные устройства");
                loadCurrentParams();
                $('#next-button').click(editApplication);
            }
        } else {
            alert('Действие не распознано!');
            window.location.href = '../../index.html';
        }
    } catch {
        alert("Ошибка загрузки данных!");
        window.location.href = "./cabinet.html";
    }

    async function addApplication() {
        const USER_PARAMS = {
            login : USER_DATA.login,
            id : USER_DATA.applications.length,
            type : $('#type').val(),
            company : $('#company').val().trim(),
            model : $('#model').val().trim()
        }

        const API = new Api('../../back/addApplication.php');
        const RESULT = await API.post(USER_PARAMS); 
        if (RESULT.success) {
            updateLocalStorage(USER_PARAMS);
            alert(RESULT.message);
            window.location.href = "./cabinet.html";
        } else {
            ERROR_CONTEINER.text(RESULT.message || 'Ошибка добавления данных!');
        }

    }

    async function editApplication() {
        const USER_PARAMS = {
            login : USER_DATA.login,
            id : ID,
            type : $('#type').val(),
            company : $('#company').val().trim(),
            model : $('#model').val().trim()
        }
        try {
            const API = new Api('../../back/editApplication.php');
            const RESULT = await API.post(USER_PARAMS); 
            if (RESULT.success) {
                updateLocalStorage(USER_PARAMS);
                alert(RESULT.message);
                window.location.href = "./cabinet.html";
            } else {
                ERROR_CONTEINER.text(RESULT.message || 'Ошибка сохранения данных!');
            }
        } catch {
            ERROR_CONTEINER.text("Ошибка загрузки данных");
        }
        
    }

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

    $('#back-button').click(function() {
        window.location.href = './cabinet.html';
    })
})