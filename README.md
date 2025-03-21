<p align="center">
<img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo">
</p>

# Laravel Timing App


## Install

```
{bun/deno/npm} install
```

```
composer install
```

```
php artisn key:generate
```

```
php artisan storage:link
```

```
php artisan migrate
```

```
php artisan db:seed
```

## Start
##### No SQLite Database:

```
docker compose -f ./docker-compose.yml up -d
```

##### Run

```
{bun/deno/npm} run dev
```

```
php artisan serve
```

```
php artisan queue:work
```

```
php artisan reverb:start
```

##### OR

```
composer run dev
```


## License
open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
