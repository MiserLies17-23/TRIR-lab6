import {Api} from "./Api.js"

/**
 * Функционал кабинета пользователя
 * 
 * @returns {void}
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

    /**
     * Обработчик событий для кнопки добавления нового устройства
     * 
     * @listens click
     * @returns {void}
     */
    $('#add-button').click(()=> {
        localStorage.setItem('action', 'add');
        window.location.href = "./application.html";
    })

    /**
     * Обработчик событий для кнопки выхода
     * 
     * @listens click 
     * @returns {void}
     */
    $('#exit-button').click(() => {
        localStorage.removeItem('currentUser');
        window.location.href="../../index.html";
    })

    /**
     * функция загрузки пользовательских данных
     * 
     * @async
     * @returns {void}
     */
    async function loadUserData() {
        const API = new Api('../../back/endpoint/cabinet.php');

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

    /**
     * Функция вывода пользовательских данных
     * 
     * @param {array} result
     * @returns {void} 
     */
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
                        <button class="delete-button" id="del${application.id}">Удалить</button>
                    </td>
                </tr>`
            );
        });

        addEditAction();
        addDeleteAction();
    }

    /**
     * Функция загрузки серверного времени
     * 
     * @async
     * @returns {void}
     */
    async function getTime() {
        const API = new Api('../../back/endpoint/time.php');
        let timeResult = await API.get();
        if (timeResult.success) {
            $('#time').text("Время: " + timeResult.currentTime);
        }
    }

    /**
     * Функция добавления события для кнопок изменения данных устройств
     * 
     * @returns {void}
     */
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

    /**
     * Функция добавления события для кнопок удаления устройств 
     * 
     * @returns {void}
     */
    function addDeleteAction() {
        const DELETE_BUTTONS = $('.delete-button');
        DELETE_BUTTONS.each(function() {
            $(this).click(async function() {
                const BUTTON_ID = this.id;
                const ID = parseInt(BUTTON_ID.replace('del', ''));
                
                const USER_PARAMS = {
                    login : USER_DATA.login,
                    id : ID,
                }
                
                const confirmation = confirm("Вы уверены, что хотите удалить устрйоство?");
                if (confirmation == true) {
                    const API = new Api('../../back/endpoint/deleteApplication.php');
                    const RESULT = await API.post(USER_PARAMS);
                    if (RESULT.success) {
                        location.reload();
                    } else {
                        alert(RESULT.message);
                    }
                } else {
                    console.log("Действие отменено")
                }
            })
        })
    }
})


    
