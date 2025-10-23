<?php

/**
 * Класс валидации
 */
abstract class Validator {

    /**
     * Статический метод проверки логина на допустимые символы
     */
    public static function loginValidate(string $login) : array {
        $errors = [];
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $login)) {
            $errors[] = 'Логин может содержать только символы латиницы, цифры и поодчёркивания!';
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

    
}