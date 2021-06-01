# How to integrate widgets

Widgets need two files in order to work : 

[app.css](https://widgets.dashboard.covid19.data.gouv.fr/css/app.css)

[app.js](https://widgets.dashboard.covid19.data.gouv.fr/js/app.js)

Add those two files to your html head.

The CSS file of the DSE is expected to be present on the hosting page.

Widgets can now be called directly into the page as custom html elements.

## Box with number

![](screenshot-box.png)

```
<data-box ></data-box>
```

This widget expect one parameter *indicateur*. The value should be a string corresponding to the name of a JSON file available in [this repository](https://data.widgets.dashboard.covid19.data.gouv.fr/).

```
<data-box indicateur="cas_positifs"></data-box>
```

## Line chart