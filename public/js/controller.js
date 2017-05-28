import MenuView from './views/menuView'
import LoginView from './views/loginView'
import RegistrationView from './views/registrationView';
import LeaderBoardView from './views/leaderboardView';
import GameView from './views/gameView';
import AboutView from './views/aboutView';

import Auth from './auth';
import { getCookie, setCookie, setCookiesAndBar } from './util';
import { routerInstance } from './router';

import { registrationForm, loginForm, menuForm } from './forms'

let auth = new Auth();

function registrationCall(event) {
    event.preventDefault();

    const ifError = function(error) {
        document.getElementById("registration_warning").innerHTML = error;
    };

    ifError("");

    let regData = registrationForm.getFormData();

    auth.register(regData,
        () => { console.log("Success login !"); routerInstance.go("/login"); },
        () => {ifError("There is no connection to server. Try again later")},
        (data) => { ifError(data);}
    );
}

function loginCall(event) {
    event.preventDefault();

    // TODO make error
    const ifError = function(error) {
        document.getElementById("login_warning").innerHTML = error;
    };
    /* clear error */
    ifError("");

    let loginData = loginForm.getFormData();

    auth.auth(loginData,
        () => {
            auth.getMe(
                (user) => {
                    console.log("Success login !");
                    routerInstance.updateNewPackToIndex(mainPack);

                    setCookiesAndBar(true, user.login);
                },
                () => { ifError("Wrong login or password!"); console.log("cannot login in getMe!"); }
            )
        },
        () => {ifError("There is no connection to server. Try again later")},
        (data) => { ifError(data);}
    );
}
function logoutCall(event) {
    event.preventDefault();

    setCookiesAndBar(false);
    routerInstance.updateNewPackToIndex(loginPack);

    auth.logout(
        () => { console.log("success logout"); },
        () => { console.log("Error, logout!"); }
    );
}

function registrationControllerGenerator(root) {
    let registration = document.querySelector('#registration');
    registration.appendChild(registrationForm.el);

    return new RegistrationView(root);
}

function menuControllerGenerator(root) {
    let menu = document.querySelector('#menu');
    menu.appendChild(menuForm.el);

    let btnLogout = document.getElementById("logoutPressed");
    btnLogout.onclick = logoutCall;

    return new MenuView(root);
}

function loginControllerGenerator(root) {
    let login = document.querySelector('#login');

    login.appendChild(loginForm.el);

    loginForm.on('submit', loginCall);
    registrationForm.on('submit', registrationCall);

    return new LoginView(root);
}

let menuController = () => menuControllerGenerator(document.querySelector('.menu-view'));
let loginController = () => loginControllerGenerator(document.querySelector('.login-view'));
let registrationController =
    () => registrationControllerGenerator(document.querySelector('.registration-view'));

let aboutController = () => new AboutView(document.querySelector('.about-view'));
let leaderBoardController =
    () => new LeaderBoardView(document.querySelector('.leaderboard-view'));
let gameController = () => new GameView(document.querySelector('.game-view'));

export let loginPack = [
    { path: '/', generator: loginController },
    { path: '/login', generator: loginController },
    { path: '/register', generator: registrationController },
    { path: '/about', generator: aboutController }
];

export let mainPack = [
    { path: '/', generator:  menuController },
    { path: '/leaderboard', generator: leaderBoardController },
    { path: '/game', generator: gameController },
    { path: '/about', generator: aboutController }
];