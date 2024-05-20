## BEE-Game

### The Project idea: <br/>
The aim of this project is to implement a game which uses THREE.js library. This 
game is about a bee which can fly in the sky and eat coins to increase its score and should 
not hit rocks because it loses its life


### Technology
2-1 Language
This project includes three different main languages.
 JavaScript: It is a programming language commonly used for handling objects, 
events and general dynamic behaviors. This has been the most used language in our 
project to implement structures.
 HTML5: Is a markup language used for structuring and presenting content on the 
World Wide Web. I use this language to create buttons and put audios for the game.
 CSS: Is a style-sheet language utilized for the definition of the presentation of the 
document, strictly combined with HTML5.
2-2 Library
For this project, THREE.js was used, following the indications and requirements for the 
development of the project.
 THREE.js: It is a cross-browser JavaScript library and an Application 
Programming Interface (API) widely utilized for 3D Graphic Modelling in Web 
Browser usingWebGL.
2-3 Tools
In this part, I want to introduce all tools which were used during implementation.
 GitHub: It is a provider of internet hosting for software development and version 
debugging using Git. It provides the possibility to create multiple branches for 
parallel working on single project and multiple operations in order to handle 
repositories and branches.
 Visual Studio Code: I decided to use it as editor for the development of our project 
because it allows to underline the syntax of every programming language.


### Game Design
 Fly
The game is a bee that can move with the up and down keys of the keyboard so as not to 
hit any of the rocks. With every 100 points, the speed of the game increases. The user starts 
the game with three lives and loses his life by hitting any obstacle and finally loses. the 
Press button for stopping the game and Exit button to end the game.
3-2 Audio
I defined the sounds in the HTML file and used them in the following sections in the 
JavaScript code.
1. The sound of the game screen
2. The sound of a coin eating by a bee
3. The sound of losing the game


### Animations
The animation started when in the function init() is invoked the method loop().
5-1 The Bee
Function updateBee() is essentially used to update the variable beeSpeed, used in the loop 
function, and to modify the structure of the Bee hierarchical model. The Bee has wings that 
simulate the movement up and down and has the tail that rotates right and left.
In function move(), the movement is allowed by two variables UP and DOWN that enable 
to update the y position of the bee and its inclination in the scene updating the rotation over 
the z axis.
5-2 Coins and Rockes
To control the movement of objects inside the screen, such as rocks and coins, deltaTime 
is checked. During the game, the movement of the objects inside the screen is controlled 
so that the rock and the coin are not in the same place at the same time. addCoin() and 
addSphere() methods are used to add coins and rocks. These two function are about 
identical. For coins is generated a random number of elements that will be added in this 
iteration, for spheres the number is always equal to 1 becuase I do not want to generate 
many barriers in the page.
 coinAnimation(): Checking the position and placement of coins on the page. If the 
bee approaches the coin, the score will increase, the text "increase the score" will be 
displayed and the eaten coin will disappear.
 sphereAnimation(): Check if there are rocks as obstacles on the page. If the bee 
approaches the rock, the life is updated and decremented by calling the updateLife() 
method. "Loss of life" message is displayed on the page. Additionally, when hitting 
a rock, the bee is updated on the x-axis and subtracts -30 from its current position, 
and is shown to simulate the blinking effect. The rock is removed from the screen.

### Result of BEE-Game

### DashBoard
![Dashboard of BEE-Game](https://github.com/AsfandAliMemon25/BEE-Game/assets/154571318/de4937f2-2600-4a0e-a291-76090322973d)
### BEE-Game Display
![Game](https://github.com/AsfandAliMemon25/BEE-Game/assets/154571318/281f5bea-ee7e-427a-8829-a5e26a77ab8f)

















