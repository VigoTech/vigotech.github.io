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
git update-index --assume-unchanged content/page/proxectos.md
git update-index --assume-unchanged content/page/videos.md
git update-index --assume-unchanged content/post/vigotech-proxectos.md
git update-index --assume-unchanged content/post/vigotech-charlas.md
hugo server
```

Dirache unha URL que podes abrir no navegador. Según fagas cambios, actualizanse no navegador de forma automática (a maior parte das veces).

## Engadir proxectos

Se queres que un proxecto de código aberto apareza na web, só tes que facer o seguinte:

- Segue os pasos da sección previa: Traballar na web.
- Abre no teu editor favorito o archivo `content/page/proxectos.md`.
- Engade unha nova "github-card" baixo a sección (linguaxe) correspondente.

A sintaxe para engadir unha nova "github-card" é moi sinxela:

```html
<div class="github-card" data-user="USUARIO" data-repo="REPOSITORIO"></div>
```

Substituíndo `USUARIO` e `REPOSITORIO` polos nomes do proxecto que queiras engadir.

Se tes algunha dúbida podes fixarte nas "github-cards" xa existentes.

- Se non existe unha sección coa linguaxe do teu proxecto, engádea:

```markdown
### Nome da linguaxe
---
Espazo para as "github-cards"
---
```

- Unha ver remates de engadir os proxectos desexados, comproba o resultado localmente e inicia
o Pull Request.

## Xeración automática de contidos

A parte dos videos xenérase automáticamente (fan falta credenciais propias de Google Cloud). Tamén a parte dos proxectos.

A configuración está na carpeta scripts (channels.json e projects.json) e o script que teñe toda a lóxica é `vigotech.go`.

### Añadir un video

Os vídeos de YouTube se xeneran automáticamente con frecuencia diaria. Se o teu canal non está dado de alta, fai unha PR añadindo o novo canal o ficheiro `scripts/channels.json`.

Se non é un canal de YouTube, terás que añadilo cada vez creando una PR o ficheiro `scripts/scripts/videosNoYoutube.txt`

### Añadir un proxecto

Os proxectos se xeneran automáticamente a partir dun arquivo JSON. Desta forma, é doado mostrar aleatoriamente (frecuencia diaria) proxectos aleatorios na páxina principal. 

Se queres añadir algún, fai un PR añadindo o proxecto o ficheiro `scripts/projects.json`.


## Despliegue Automático

Unha vez o cambio súbese a `source`, [Travis](https://travis-ci.org/VigoTech/vigotech.github.io) encárgase de desplegalo. Non hai nada que facer nesa parte.

Ver [rcoedo web](http://rcoedo.com/post/hugo-static-site-generator/) para máis información.
