<?php

/**
 * Класс валидации
 */
abstract class Validator {

    //public static $errors = [];
    /**
     * Статический метод проверки логина на допустимые символы
     * 
     * @param string $login - логин пользователя
     * @return array $errors - список ошибок
     */
    public static function loginValidate(string $login) : array {
        $errors = [];
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $login)) {
            $errors[] = 'Логин может содержать только символы латиницы, цифр и поодчёркиваний!';
        } else if (preg_match('/^[0-9_]+$/', $login)) {
            $errors[] = 'Логин обязательно должен содержать символы латиницы!';
        } else if (strlen($login) < 6){
            $errors[] = 'Логин не может быть короче 6 символов!';
        }
        return [
            'isValide' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Статический метод проверки пароля на допустимые символы
     * 
     * @param string $password - пароль
     * @return array $errors - список ошибок
     */
    public static function passwordValidate(string $password) : array {
        $errors = [];
        if (strlen($password) < 6) {
            $errors[] = 'Пароль должен содержать не менее 6 символов!';
        } else if (str_contains($password, ' ') || str_contains($password, '.')) {
            $errors[] = 'Пароль не может содержать пробелы и точки!';
        }
        return [
            'isValide' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Статический метод проверки данных компании и устройства
     * 
     * @param string $appParam - строка названия компании/модели
     * @return array $errors - список ошибок
     */
    public static function applicationValidate(string $appParam) : array {
        $errors = []; 
        if (strlen($appParam) <= 1) {
            $errors[] = 'Название компании и модели не может быть меньше 2 символов!';
        } else if (!preg_match('/^[a-zA-Z0-9]+$/', $appParam)) {
            $errors[] = 'В названии компании и модели могут быть только латинские символы и цифры!';
        } else if (!preg_match('/^[a-zA-Z]/', $appParam[0])) {
            $errors[] = 'Названия компании и модели должны начинаться с символов латиницы!';
        }
        return [
            'isValide' => empty($errors),
            'errors' => $errors
        ];
    }
}