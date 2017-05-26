'use strict';

import Button from '../button/button';

class RegistrationForm {

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

        return fields.map(field => { return `<div class="registration-form"><input type="${field.type}" name="${field.name}" placeholder="${field.placeholder}" class="form-control registration-form__input"></div>` }).join(' ');
    }

    /**
     * Обновить html компонента
     */
    _updateHtml () {
        this.el.innerHTML = `
            <form class="form-horizontal col-md-6">
                <h1>${this.data.title || ''}</h1>
                <div class="form-group form-input">
                    ${this._getFields()}
                </div>
                <div class="js-controls">
                </div>
                <div id="BackButton" style="padding-top: 20px;">
                    <a href="/login">Back</a>
                </div>
                <div style="color: red;" id="registration_warning"></div>
            </form>
        `;
    }

    /**
     * Вставить управляющие элементы в форму
     */
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


}

export default RegistrationForm;