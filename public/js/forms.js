import LoginForm from './blocks/login/login';
import Menu from './blocks/menu/menu';
import RegistrationForm from './blocks/register/registration';

export let menuForm = new Menu({
    el: document.createElement('div'),
    data: {
        controls: [
            {
                text: 'Play',
                attrs: {
                    type: 'click',
                    class: 'btn btn-success btn-block',
                    id: 'playPressed',
                    href: '/game'
                }
            },
            {
                text: 'LeaderBoard',
                attrs: {
                    type: 'click',
                    class: 'btn btn-info btn-block',
                    id: 'leaderboardPressed',
                    href: '/leaderboard'
                }
            },
            {
                text: 'Logout',
                attrs: {
                    type: 'submit',
                    class: 'btn btn-danger btn-block',
                    id: 'logoutPressed'
                }
            }
        ]
    }
});


export let loginForm = new LoginForm({
    el: document.createElement('div'),
    data: {
        title: 'Login',
        fields: [
            {
                name: 'login',
                type: 'text',
                placeholder: 'Login'
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Password'
            }
        ],
        controls: [
            {
                text: 'Login',
                attrs: {
                    type: 'submit',
                    class: 'btn btn-success login-form__button login-form__button_red'
                }
            },
            {
                text: 'Play as guest',
                attrs: {
                    type: 'submit',
                    class: 'btn btn-default login-form__button login-form__button_red'
                }
            }
        ]
    }
});

export let registrationForm = new RegistrationForm({
    el: document.createElement('div'),
    data: {
        title: 'Registration',
        fields: [
            {
                name: 'login',
                type: 'text',
                placeholder: 'Login'
            },
            {
                name: 'email',
                type: 'email',
                placeholder: 'Email'
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Password'
            }
        ],
        controls: [
            {
                text: 'Register',
                attrs: {
                    type: 'submit',
                    class: 'btn btn-default registration-form__button registration-form__button_red'
                }
            }
        ]
    }
});