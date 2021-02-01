# How to integrate widgets

Widgets need to file in order to work : 
[app.css](https://widgets.barometre-resultats.data.gouv.fr/js/app.js)
[app.js](https://widgets.barometre-resultats.data.gouv.fr/css/app.css)
Add those to file to your html head.

The CSS file of the DSE is expected to be present on the hosting page.

Widgets can now be called directly into the page as custom html elements.

## Box with number

```
<databox></databox>
```

## Region and departement list

```
<geo-lists></geo-lists>
```

See [Configuration Reference](https://cli.vuejs.org/config/).