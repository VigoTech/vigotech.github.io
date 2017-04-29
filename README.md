[![Build Status](https://travis-ci.org/VigoTech/vigotech.github.io.svg?branch=master)](https://travis-ci.org/VigoTech/vigotech.github.io)

# Introducción

Este repositorio contén a páxina web de VigoTech Alliance.

## Traballar na web

A web está feita usando [Hugo](https://gohugo.io/). O que fai é coller os ficheiros markdown da carpeta `content` e o tema da carpeta `themes` e xenera unha web estática en `docs`.

Se queres contribuir:

- Instala Hugo: https://gohugo.io/overview/installing/
- Se vas facer una Pull Request, fai un Fork do repositorio: https://help.github.com/articles/fork-a-repo/
- Clona o repositorio GitHub: https://help.github.com/articles/cloning-a-repository/
- Sempre traballa no branch `source`, o master reservase para o contido final.

Na carpeta do repositorio executa:

```bash
git checkout source
hugo server
```

Dirache unha URL que podes abrir no navegador. Según fagas cambios, actualizanse no navegador de forma automática (a maior parte das veces).

## Xeración automática de contidos 

A parte dos videos xenérase automáticamente. Aínda non está integrado co despliegue... polo de agora faino @antonmry a man (fan falta credenciais propias de Google Cloud) e despóis o fara Travis.

## Despliegue Automático

Unha vez o cambio súbese a `source`, [Travis](https://travis-ci.org/VigoTech/vigotech.github.io) encárgase de desplegalo. Non hai nada que facer nesa parte.

Ver [rcoedo web](http://rcoedo.com/post/hugo-static-site-generator/) para máis información.
