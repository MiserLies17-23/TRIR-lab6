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
     * Метод проверки логина пользователя
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
     * Метод добавляет нового пользователя
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
     * Метод создаёт нового пользователя
     * 
     * @param array $userdata - введённые пользователем данные
     * @return array
     */
    public function createNewUser(array $userdata): array {
        return [
            'login' => $userdata['login'],
            'password' => $userdata['password'],
            'visits' => 0,
            'applications' => [
                [
                    'id' => 0,
                    'type' => $userdata['type'],
                    'company' => $userdata['company'],
                    'model' => $userdata['model']
                ]
            ]
        ];
    }

    /**
     * Метод сохраняет нового пользователя
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
                    'applications' => $newUser['applications']
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
        $companyValidation = Validator::applicationValidate($userData['applications'][0]['company']);
        $modelValidation = Validator::applicationValidate($userData['applications'][0]['model']);

        $allErrors = array_merge(
            $loginValidation['errors'],
            $passwordValidation['errors'], 
            $companyValidation['errors'],
            $modelValidation['errors']
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
     * Метод поиска индекса пользователя по логину
     * 
     * @param string $login - логин пользователя
     * @return int $index - индекс пользователя
     */
    private function findUserIndex(string $login): int {
        foreach ($this->data as $index => $user) {
            if ($user['login'] === $login) {
                return $index;
            }
        }
        return -1;
    }

    /**
     * Метод изменения данных об устройстве
     * 
     * @param array $userEditParams - пользовательские данные
     * @return void
     */
    public function editApplication(array $userEditParams) : void {
        $currentIndex = $this->findUserIndex($userEditParams['login']);

        if ($currentIndex === -1) {
            echo json_encode([
                'success' => false,
                'message' => 'Пользователь не найден!'
            ]);
            return;
        }
        
        $applicationIndex = (int)$userEditParams['id'];
        
        if (!isset($this->data[$currentIndex]['applications'][$applicationIndex])) {
            echo json_encode([
                'success' => false,
                'message' => 'Устройство не существует!'
            ]);
            return;
        }
        
        $this->data[$currentIndex]['applications'][$applicationIndex] = [
            'id' => $applicationIndex,
            'type' => $userEditParams['type'],
            'company' => $userEditParams['company'],
            'model' => $userEditParams['model']
        ];

        if ($this->saveData()) {
            echo json_encode([
                'success' => true,
                'message' => 'Данные успешно обнавлены!'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Ошибка обнавления данных!'
            ]);
        }
    }

    /**
     * Метод добавления нового устройства 
     * 
     * @param array $userAddParams - пользовательские данные
     * @return void
     */
    public function addApplication(array $userAddParams) : void {
        $currentIndex = $this->findUserIndex($userAddParams['login']);
        if ($currentIndex === -1) {
            echo json_encode([
                'success' => false,
                'message' => 'Пользователь не найден!'
            ]);
            return;
        }

        $errors = array_merge(
            Validator::applicationValidate($userAddParams['company'])['errors'],
            Validator::applicationValidate($userAddParams['model'])['errors']
        );
        
        if (!empty($errors)) {
            echo json_encode([
                'success' => false,
                'message' => $errors[0]
            ]);
            return;
        }

        $newApplication = [
            'id' => $userAddParams['id'],
            'type' => $userAddParams['type'],
            'company' => $userAddParams['company'],
            'model' => $userAddParams['model']
        ];

        array_push($this->data[$currentIndex]['applications'], $newApplication);

        if ($this->saveData()) {
            echo json_encode([
                'success' => true,
                'message' => 'Устройство добавлено!'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Ошибка добавления устройства!'
            ]);
        }
    }

    /**
     * Метод удаления устрйоства
     * 
     * @param array $deleteParams - необходимые данные для удаления
     * @return void
     */
    public function deleteApplication(array $deleteParams) : void {
        $currentIndex = $this->findUserIndex($deleteParams['login']);
        if ($currentIndex === -1) {
            echo json_encode([
                'success' => false,
                'message' => 'Пользователь не найден!'
            ]);
            return;
        }

        $id = $deleteParams['id'];
        if (0 > $id || $id >= count($this->data[$currentIndex]['applications'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Устройство не найдено!'
            ]);
            return;
        }

        if (count($this->data[$currentIndex]['applications']) == 1) {
            echo json_encode([
                'success' => false,
                'message' => 'В аккаунте должно остаться хотя бы одно устройтство! Измените существующее'
            ]);
            return;
        }

        array_splice($this->data[$currentIndex]['applications'], $id, 1);
        
        foreach ($this->data[$currentIndex]['applications'] as $index => &$application) {
            $application['id'] = $index;
        }

        if ($this->saveData()) {
            echo json_encode([
                'success' => true,
                'message' => 'Устройство удалено!'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Ошибка удаления устройства!'
            ]);
        }
    }

    /**
     * Функция сохраняет данные пользователя
     * 
     * @return bool
     */
    public function saveData() : bool {
        return file_put_contents($this->file, json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) !== false;
    }
}