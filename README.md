## Перед использованием
* Нужен активный folder в YandexCloud ([подробнее](https://cloud.yandex.ru/docs/vision/quickstart)) 

## Использование

``` bash 
node script <yandexOauthToken> <yandexCloudFolderId>
```

## Пример запуска скрипта

``` bash
node script qwerty12345 asdf54321 | grep text
```

### Вывод:

```
"textDetection": {
        "text": "PENGUINS",
        "text": "CROSSING",
        "text": "SLOW",
```

## Используемые зависимости
* axios
* screenshot-desktop