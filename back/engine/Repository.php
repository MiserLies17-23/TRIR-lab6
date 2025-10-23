<?php

require_once 'Validator.php';
/**
 * Класс Repository для работы с данными
 */
class Repository {
    private $file;
    public array $data;

    /**
     * Конструктор класса
     * 
     * @param string $filePath - путь к базе данных
     * @return void
     */
    public function __construct(string $filePath) {
        $this->file = $filePath;
        $this->loadData();
    }
    
    /**
     * Загрузка данных из файла
     * 
     * @return void
     */
    private function loadData(): void {
        $contents = file_get_contents($this->file);
        if (!$contents) 
            $this->data = [];
        else
            $this->data = json_decode($contents, true);
    }

    /**
     * Функция проверки логина пользователя
     * 
     * @param string $username - логин пользователя
     * @param string $password - пароль пользователя
     * @return void
     */
    public function loginVerification(string $username, string $password): void {
        $result = [
            'success' => false,
            'message' => 'Неверный логин или пароль!',
            'user' => null
        ];
        foreach($this->data as &$user) {
            if ($user['login'] === $username && $user['password'] === $password) {
                $user['visits']++;
                $result = [
                    'success' => true,
                    'message' => 'Успешный вход!',
                    'user' => [
                        'login' => $user['login'], 
                        'visits' => $user['visits'],
                        'applications' => $user['applications'] ?? []
                    ]
                ];
                $this->saveData();
                break;
            }
        }
        echo json_encode($result);
    }

    /**
     * Метод загрузки данных пользователя на странице 
     * 
     * @param string $userName - имя пользователя
     * @return void
     */
    public function loadUserData(string $userName) : void {
        $result = [
            'success' => false,
            'message' => 'Пользователь не распознан!',
            'user' => null
        ];
        foreach($this->data as $user) {
            if ($user['login'] === $userName) {
                $result = [
                    'success' => true,
                    'message' => 'Данные успешно загружены!',
                    'user' => [
                        'login' => $user['login'], 
                        'visits' => $user['visits'],
                        'applications' => $user['applications']
                    ]
                ];
                break;
            }
        }
        echo json_encode($result);
    }

    /**
     * Функция добавляет нового пользователя
     * 
     * @param array $userdata - ввелдённые пользователем данные
     * @return void
     */
    public function addManager(array $userdata): void {
        foreach($this->data as $user) {
            if ($user['login'] === $userdata['login']) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Пользователь с таким именем уже есть!'
                ]);
                exit;
            }
        }

        $newUser = $this->createNewUser($userdata);
        $this->saveNewUser($newUser);
    }

    /**
     * Функция создаёт нового пользователя
     * 
     * @param array $userdata - введённые пользователем данные
     * @return array
     */
    public function createNewUser(array $userdata): array {
        return [
            'login' => $userdata['login'],
            'password' => $userdata['password'],
            'visits' => 0,
            'application' => [
                'type' => $userdata['type'],
                'company' => $userdata['company'],
                'model' => $userdata['model']
            ]
        ];
    }

    /**
     * Функция сохраняет нового пользователя
     * 
     * @param array $newUser - пользовательские данные
     * @return void
     */
    public function saveNewUser(array $newUser): void {
        
        if(!$this->validationCheck($newUser)) {
            return;
        };
        
        $this->data[] = $newUser; 
        if ($this->saveData()) {
            echo json_encode([
                'success' => true,
                'message' => 'Регистрация успешна! Теперь вы можете войти.',
                'user' => [
                    'login' => $newUser['login'],
                    'application' => $newUser['application']
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Ошибка сохранения данных!'
            ]);
        }
    }

    /**
     * Валидация всех введённых пользователем параметров
     * 
     * @param array $userData - данные пользователя
     * @return bool - флаг обработки ошибок
     */
    public function validationCheck(array $userData) : bool {
        $loginValidation = Validator::loginValidate($userData['login']);
        $passwordValidation = Validator::passwordValidate($userData['password']);

        $allErrors = array_merge(
            $loginValidation['errors'],
            $passwordValidation['errors'], 
        );

        if (!empty($allErrors)) {
            echo json_encode([
                'success' => false,
                'message' => $allErrors[0]
            ]);
            return false;
        }
        return true;
    }

    /**
     * Функция сохраняет данные пользователя
     * 
     * @return void
     */
    public function saveData(): bool {
        return file_put_contents($this->file, json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
    }
}