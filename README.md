# Colmena project

Colmena is a software solution to create and share content, developed together with local and community media from the Global South. The digital toolbox enables communicators to extend local offline collaborations like interviews, live broadcasting, audio and text edition and into participatory online workflows. Colmena is a free to use, commonly owned and 100% open source. Amont it main features are;



- toolbox for community radios with audio recording and editing tools

- offline mode which allows some tools to be used without Internet

- collaborative space with chat and file sharing

- secure content synchronization to the Colmena cloud


# Getting started - front end

Welcome To Colmena, The one platform/application that empowers journalists around the world with all the necessary tools they need at their fingertips. The project is open-source, which means anyone is welcome to make contributions to improve the codebase.

## Installation

You start by cloning the project in some local directory by running the following command

```bash
git clone https://git.colmena.network/maia/frontend.git 
```

And then install the project dependencies as follows

```bash
yarn
```

Note: We use yarn as the package manager, if you use npm, please download yarn
[from this link](https://classic.yarnpkg.com/lang/en/docs/install)

## Running the project

To run the project, at the root of the project, run the following command

```bash
yarn dev
```

The command will build the application and run it on the browser (Port 3008)

## Architecture Notes

This repository represents the frontend side of the Colmena project. Which is built with nextjs framework (A framework for reactjs with many features).

Note: As a contributor please ensure to always:

- Encapsulate your code and make it self-explanatory.
- Follow the best practices of the tool or framework we use.

## UI/UX

Colmena is a user centerd design progressive web app (PWA) solution for mobile/desktop environments that work both online and offline.

Summary on the installed tech;

- Material UI (With Extra RTL plugins)
- TailwindCSS (With Extra RTL plugins)

For user interfaces, we primarily use the official MaterialUI (MUI) framework. Please refer to [the official docs and review all the available components and UIs](https://mui.com/getting-started/usage/)

When we try to create a user interface (UI) which does not have an equivalent in MUI, we then build it from scratch with framework [TailwindCSS.](https://tailwindcss.com/)

Note: TailwindCSS and MUI are already installed and configured and you can start using them directly.

### RTL

Colmena has an international  audience and thus we support `Right-To-left (RTL)` languages such as Arabic, Hebrew, and Persian. So when making contributions, please be aware of that.

Please learn more about [RTL integration with MUI here](https://mui.com/guides/localization/#rtl-support)

TailwindCSS does also offer RTL features with the help of  [tailwindcss-rtl plugin](https://www.npmjs.com/package/tailwindcss-rtl) which we installed already.

Both integrations rely on a special attribute called `dir="rtl"` or `dir="ltr"` in one of the parent divs. If the direction is `rtl` then MUI-RTL and TailwindCSS-RTL will render the UI from right to left instead of left to right.
The `dir="{direction}"` attribute is already placed in the `Container` component and a few other components, which means that you as a developer, in most situations assume that it is there and you build your inner UI accordingly. (You can see it if you use the chrome tool and inspect elements).

Most MUI components are good to go with RTL, but for tailwindCSS, please rely on this table to substitute classes to make your UI RTL-aware.

TailwindCss Class | What you should use instead | Comment
--|-|--
pl-[X] | ps-[X] | Left padding is now left on `ltr` and right on `rtl`
pr-[X] | pe-[X] | Right padding is now right on `ltr` and left on `rtl`
ml-[X] | ms-[X] | Left Margin is now left on `ltr` and right on `rtl`
mr-[X] | me-[X] | Right Margin is now right on `ltr` and left on `rtl`
...|...|...|
------
Please review the reset of the changes at [the offical tailwindcss-rtl plugin docs](https://www.npmjs.com/package/tailwindcss-rtl)

### Colors

Colmena's Primary and secondary colors (And other helper colors) are defined in the `src/styles/colors.js` file. Those colors are configured to work with TailwindCSS. For example, to print a hello world `h1` in the primary dark color, secondary main color, and variant1 light color respectively,  here is an example.
```html
<h1 className="text-primary-dark">Hello world Colmena</h1>
<h1 className="text-secondary-main">Hello world Colmena</h1>
<h1 className="text-variant1-light">Hello world Colmena</h1>
```
If you are curious to know how we did it, please check [the official docs](https://www.npmjs.com/package/tailwindcss-rtl)

## Building and deployment

At colmena, we use gitlab as the main DEVOPS platform, where we build, test, and deploy each version independently and test it before merges occur.

The building process happens with the help of docker, where we use the main `Dockerfile` to containerize your codebase. (We use node:16-alpine image and as a result, we recommend that you also use node-16 on your local machine as well to ensure version compatibility...)
Your application will be tested (Work in progress) and then pushed to docker with a unique id (we call it `tag` in docker and it is the same as the git `commit_ref_id`)


## Documentation

People can get help with your project consulting [gitlab documentation](https://git.colmena.network/maia/frontend/)

Colmena nitiative was born as a response to the Covid-19 pandemic. In January 2021 DW Akademie and the Mexican NGO Redes por la Diversidad, Equidad y Sustentabilidad A.C. teamed up with a group of brazilian developers to prepare the ground for the first phase of the project: a one year co-creation sprint, together with media partners from Africa, the Middle East and Latin America. The work was supported by the German Federal Ministry of Economic development and Cooperation (BMZ) as part of the Global Crisis Initiative (GKI). With the launch of the first version in April 2022.

## List of contributors 

(alphabetical order)

Adriana Veloso Meireles
Carlos Henrique Gontijo Paulino
Jean Habib
Nidhal Abidi
Nilson Rocha
Patrick Oliveira
Rafael Diniz
Thalita Coutinho
Vinicius Gusmão
Wafi Ben Jeddou


