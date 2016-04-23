EpiPen
===

### Inject your own JS, CSS or HTML strings into Axure.


## Installation
1. Clone the repo
2. Copy or create a symlink of the repo's plugin/EpiPen folder to the plugins folder of your output or Axure 8's source code folder (Mac:/Applications/Axure RP 8.app/Contents/Resources/DefaultSettings/Prototype_Files/plugins). 
3. In Axure, load the EpiPen.rplib library.
4. Drag the EpiPen widget onto your page. Do not change the name of this widget.
5. Open the widget. In the repeater dataset input your data to be loaded.

### Usage
#### Repeater Dataset Values

**type: js / css / html / class**

This is the type of content you'll be injecting

**src: js / myScript.js**

This is either a relative or absolute URL to your script or css. If your type was HTML, an HTML string is valid here.

**target: external / internal / @widgetName**

This tells the epi.js script where to insert your content. In most cases you want to specify head however you can also replace the contents of a widget when you set the type to HTML. Just specify the widget ID (with the @ symbol first) and that widget will be replaced with the string passed in the src field.

