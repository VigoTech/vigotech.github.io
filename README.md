# vigotech.github.io

> VigoTech Alliance Website

## Build Setup

``` bash
# install dependencies
$ yarn install

# rename .env.example to .env and edit using your own config

# prepare required static/vigotech-generated.json
$ yarn run prepare-json

# serve with hot reload at localhost:3000
$ yarn run dev

# generate static project
$ yarn run generate
```

## Instruccións para engadir información

En primeiro lugar para engadir ou editar un membro o grupo, debe modificarse únicamente *static/vigotech.json*
Este fichero ten un *schema* no fichero *static/vigotech-schema.json* cando se xere a parte de front mediante ```yarn prepare``` este validarase polo que debe asegurarse que estea correcto.

A estructura dun membro (como exemplo collemos un existente) é:

```
"aindustriosa": {
      "name": "A Industriosa",
      "logo": "https://vigotech.org/images/aindustriosa.png",
      "links": {
        "web": "https://aindustriosa.org/",
        "twitter": "https://twitter.com/aindustriosa",
        "meetup": "https://www.meetup.com/es-ES/AIndustriosa/",
        "youtube": "https://www.youtube.com/channel/UC9DPKfcLiNd7SEU-QLlIG7A"
      },
      "events": {
        "type": "meetup",
        "meetupid": "AIndustriosa"
      },
      "videos": [
        {
          "type": "youtube",
          "channel_id": "UC9DPKfcLiNd7SEU-QLlIG7A"
        }
      ]
    }
```

O apartado *events* pode ter duas formas

* Para eventos que se extraen mediante a api de Meetup
```
"events": {
  "type": "meetup",
  "meetupid": "AIndustriosa"
}
```
* Para eventos que se extraen mediante a api de Eventbrite
```
"events": {
  "type": "eventbrite",
  "eventbriteid": "17365087639"
}
```
* Ou para eventos extraido dun json externo
```
"events": {
  "type": "json",
  "source": "https://www.python-vigo.es/events.json"
},
```


Coa forma
```
{
    "title": "Reunión del Grupo el 18/11/2018",
    "date": 1542569580000,
    "url": "https://www.python-vigo.es/posts/reunion-del-grupo-el-20181018/"
}

```




