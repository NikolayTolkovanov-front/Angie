## Инструкция для установки (backend) на сервере

>Note: Инструкция предназначена только для `Nginx`!!!

>Note: Инструкция предназначена только для `Ubuntu`!!!

>Note: Вам нужен `python` не ниже `3.10`

>Note: Перед установкой измените значение `isDev` на `false` в `_static/js/app.js`

1)Зайдите на ваш сервер где будет лежать сайт, и введите команду:
```shell
nano /etc/nginx/sites-available/default
```

2)Откроется окно редактирования, отройте след. секцию:
```shell
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /opt/angie/docs/build;

        index index.html index.htm index.nginx-debian.html;

        server_name _;

        index index.html;

        location / {
        try_files $uri $uri/ $uri.html /404.html /500.html;
    }
}
```

3)После этого, конце строки после location добавьте этот кусок кода:
>Note: Если у вас установлен SSL сертификат (https) найдите блок с кодом который слушает порт 443 и так же вставьте после location

```shell
location /api {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
}
```

3)Далее нажмите `CTRL+X` а за тем введите `Y` и нажмите `ENTER`, после введите эти команды:
```shell
sudo nginx -t && systemctl restart nginx.service
```

4)После этого зайдите в директорию где у вас лежит (backend) и введите эту команду:
```shell
python3 -m venv venv && source venv/bin/activate && pip install -r ../requirements.txt && sudo chmod +x create_service.sh && ./create_service.sh
```
### После этого все должно заработать.
