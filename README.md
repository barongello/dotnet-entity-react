# .NET (C#) + Entity Framework + React.js Todo App

Todo App built as an example to showcase some skills. It is using:

- .NET (C#) for the back-end
- Entity Framework for the database (in-memory)
- React.js for the front-end
- REST API to communicate between back-end and front-end
- Vite to compile and bundle the front-end
- Docker for containerization
- NGINX as reverse proxy

## Online version

The up and running app can be found [here](https://barongello.dev/dotnet-entity-react/)

## Disclaimer

Despite being a simple application, I separated many CSS properties into variables and splitted the React code into separate componentes

## How to run

1. Install Docker
2. Clone this repository
3. Run `./build_and_run.sh`
4. Configure NGINX

The server will be running in the port `20001`

It will be running under `/dotnet-entity-react/` subfolder

Here is the NGINX configuration:

```nginx
server {
    listen 80;
    server_name <server> www.<server>;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name <server> www.<server>;

    ssl_certificate <fullchain.pem>;
    ssl_certificate_key <privkey.pem>;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /dotnet-entity-react/ {
        proxy_pass http://127.0.0.1:20001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Change `<server>` to the real host (i.e. example.com)

Change `<fullchain.pem>` to the path of the `fullchain.pem` file

Change the `<privkey.pem>` to the path of the `privkey.pem`
