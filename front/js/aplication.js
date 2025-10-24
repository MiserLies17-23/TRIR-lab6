import {Api} from './Api.js'

$(document).ready(function() {

    const ACTION = localStorage.getItem('action');
    const USER_DATA = JSON.parse(localStorage.getItem('currentUser'));
    const ID = localStorage.getItem('currentApplication');

    console.log(ID);
    console.log(ACTION);
    console.log(USER_DATA);

    if (!USER_DATA) {
        alert('Пользователь не распознан! Пожалуйста, вернитесь на страницу входа...')
        localStorage.removeItem('currentUser');
        window.location.href = '../../index.html'
    }

    if (ACTION === 'add') {
        $('#header').text("Добавьте устройство")
        $('#next-button').click(addNewApplication);
    } else if (ACTION === 'edit') {
        const PARAMS = localStorage.getItem('currentApplication');
        if (!PARAMS) {
            alert('Устройство не распознано!');
            window.location.href = './cabinet.js';
        } else {
            $('#header').text("Редактируйте данные устройства");
            loadCurrentParams(ID);
            //$('#next-button').click(editApplication());
        }
    } else {
        alert('Действие не распознано!');
        window.location.href = '../../index.html';
    }

    /*function addNewApplication() {
        const APPLICATION_PARAMS = getUserParams();
        const API = new Api('../../back/addApplication.php');

    }

    function getUserParams() {
        return {
            type : $('#type').val(), 
            company : $('#company').val().trim(),
            model : $('#model').val().trim()
        };  
    }

    function editApplication() {
        loadCurrentParams();
    }*/

    function loadCurrentParams(id) {
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

    $('#back-button').click(function() {
        window.location.href = './cabinet.html';
    })
})