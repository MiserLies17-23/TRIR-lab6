import {Api} from "./Api.js"

/**
 * Добавить следующие функции: 
 * - Обработчик событий на кнопку "Выйти";
 * - Обработчик событий на кнопку "Добавить устройства"
 */
$(document).ready(function() {
    
    const USER_DATA = JSON.parse(localStorage.getItem('currentUser'));

    if (!USER_DATA) {
        alert('Пользователь не распознан! Пожалуйста, вернитесь на страницу входа...')
        localStorage.removeItem('currentUser');
        window.location.href = '../../index.html'
    } 

    loadUserData();
    getTime(); 
    setInterval(getTime, 1000);

    $('#add-button').click(()=> {
        localStorage.setItem('action', 'add');
        window.location.href = "./application.html";
    })

    $('#exit-button').click(() => {
        localStorage.removeItem('currentUser');
        window.location.href="../../index.html";
    })

    async function loadUserData() {
        const API = new Api('../../back/cabinet.php');

        const RESULT = await API.get({login : USER_DATA.login});

        if (RESULT.success) {
            localStorage.setItem('currentUser', JSON.stringify(RESULT.user));
            displayDataInfo(RESULT);
            console.log('Загрузка прошла успешно!');
        } else {
            alert('Ошибка загрузки пользовательских данных!');
            window.location.href = '../../index.html';
        }
    }

    function displayDataInfo(result) {
 
        $('#name').text("Пользователь: " + result.user.login);
        $('#visits').text("Посещения: " + result.user.visits);
        
        let table = $('#applications');
        let applications = result.user.applications;
        applications.forEach(application => {
            table.append(
                `<tr>
                    <td>${application.type}</td>
                    <td>${application.company}</td>
                    <td>${application.model}</td>
                    <td>
                        <button class="edit-button" id="app${application.id}">Редактировать</button>
                        <button class="delete-button" id="app${application.id}">Удалить</button>
                    </td>
                </tr>`
            );
        });

        addEditAction();
        //addDeleteAction();
    }

    /**
     * Метод загрузки серверного времени
     */
    async function getTime() {
        const API = new Api('../../back/time.php');
        let timeResult = await API.get();
        if (timeResult.success) {
            $('#time').text("Время: " + timeResult.currentTime);
        }
    }

    function addEditAction() {
        const EDIT_BUTTONS = $('.edit-button');
        EDIT_BUTTONS.each(function() {
            
            $(this).click(() => {
                const BUTTON_ID = this.id;
                const ID = BUTTON_ID.replace('app', '');

                localStorage.setItem('currentApplication', ID);
                localStorage.setItem('action', 'edit');
                window.location.href = "./application.html";
            });
        });
    }

    function addDeleteAction() {
        const DELETE_BUTTONS = $('.delete-button');
        DELETE_BUTTONS.forEach(button => {
            button.click(async function() {
                const API = new Api('../../back/deleteApplication.php');
                const RESULT = await API.post();
                //....
                if (RESULT.success) {
                    location.reload();
                } else {
                    console.log(RESULT.message);
                }
            })
        })
    }

})


    
