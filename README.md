# Affinity Sprite Sheet Generator



This application converts SVG icons into a single SVG file and colours each path. 

The purpose of this is application is for creating a single file that can be imported into Affinity Designer for easy import into the applications Asset panel. 



## Instructions

![https://i.imgur.com/SNUe7R3.png](https://i.imgur.com/SNUe7R3.png)



1. Click on the colour picker to choose the colour that will be applied to each
2. Choose the files that you wish to add as assets
3. Choose a file name for the output file
4. press create

The application will **try** to extract as many of the icons as possible, but it will not be able to extract all. All paths will be named according to their original filename (so you may need to preprocess the filenames e.g. material icons are all named 24px.svg)

> Any errors in icon extraction will be logged to the console (F12)



### Importing the Icons as assets

Create a new Category, then click the menu again to rename the menu.

![https://i.imgur.com/K5XkRFC.png](https://i.imgur.com/K5XkRFC.png)

Drag the SVG you just created onto the canvas **(it will import as an embedded document)**. Double click on the embedded document in the layer panel

![https://i.imgur.com/QXcmRoV.png](https://i.imgur.com/QXcmRoV.png)

In the window that pops up press **CTRL + A** to select all the layers. 

Resize the icons so they fit inside the canvas (which will be 64px X 64px) - this will ensure all your icon packs are the same size.

![https://i.imgur.com/jyZg4OQ.png](https://i.imgur.com/jyZg4OQ.png)

With all of the assets still selected, click on the Assets subcategory menu and click "Add from Selection". The icons will appear in the asset panel and will be searchable.

![https://i.imgur.com/JkbWtNK.png](https://i.imgur.com/JkbWtNK.png)