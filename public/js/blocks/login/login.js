
'use strict';

import Button from '../button/button';

class LoginForm {

    /**
     * Конструктор класса Form
     */
    constructor (options = { data: {} }) {
        this.data = options.data;
        this.el = options.el;

        this.render();
    }

    render () {
        this._updateHtml();
        this._installControls();
    }

    /**
     * Вернуть поля формы
     * @return {string}
     */
    _getFields () {
        let { fields = [] } = this.data;

        return fields.map(field => { return `<div class="login-form"><input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" class="form-control login-form__input"></div>` }).join(' ');
    }


    /**
     * Обновить html компонента
     */
    _updateHtml () {
        this.el.innerHTML = `
            <div class="col-md-3"></div>
                <form class="form-horizontal col-md-6 login-form">
                <h1>${this.data.title || ''}</h1>
                <div class="form-group form-input">
                    ${this._getFields()}
                </div>
                <div class="js-controls">
                </div>
                <div class="create_new_account_link" style="margin-top: 10px;" id="RegisterPageId" >
                    <a href="/register">
                        Create new account
                     </a>
                 </div>
                 <div id="login_warning" style="color: red;"></div>
                </form>
            <div class="col-md-3"></div>
        `;
    }

    _installControls () {
        let { controls = [] } = this.data;

        controls.forEach(data => {
            let control = new Button(data).render();
            this.el.querySelector('.js-controls').appendChild(control.el);
        });
    }

    /**
     * Подписка на событие
     * @param {string} type - имя события
     * @param {function} callback - коллбек
     */
    on (type, callback) {
        this.el.addEventListener(type, callback);
    }

    /**
     * Взять данные формы
     * @return {object}
     */
    getFormData () {
        let form = this.el.querySelector('form');
        let elements = form.elements;
        let fields = {};

        Object.keys(elements).forEach(element => {
            let name = elements[element].name;
            let value = elements[element].value;

            if (!name) {
                return;
            }

            fields[name] = value;
        });

        return fields;
    }

    getControlls () {
        return this.data.controls;
    }

    addClickById(id, callback) {
        document.getElementById(id).addEventListener('click', callback);
    }

}

export default LoginForm;