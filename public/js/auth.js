/**
 * Created by algys on 13.04.17.
 */

import Request from "./request";

class Auth {
    constructor() {
        this.logged = false;
    }

    getMe(success, error) {
        new Request(conf.ip[conf.baseIP].prefix + conf.ip[conf.baseIP].host + conf.ip[conf.baseIP].port + '/api')
            .addResponse(function (response) {
                console.log(response);
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    error();
                    return;
                }
                response.json().then(function (data) {
                    success(data);
                });
            }.bind(this))
            .addJson(null)
            .error(function (err) {
                console.log("[ERROR] Error response in login");
            })
            .request("/user", {
                method: 'GET'
            });
    }

    auth(data, success, errorServer, errorClient) {
        let status = false;
        new Request(conf.ip[conf.baseIP].prefix + conf.ip[conf.baseIP].host + conf.ip[conf.baseIP].port + '/api')
            .addResponse(function (response) {
                console.log(response);
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    response.json().then((json) => {
                        errorClient(json.status);
                    });
                    return;
                }
                this.logged = true;
                success();
            }.bind(this))
            .addJson(data)
            .error(function (err) {
                errorServer();
            }.bind(this))
            .request('/login', {
                method: 'POST'
            });

        return status;
    }


    checkAuth(success, error) {
        let status = false;
        if (this.logged) {
            success();
            return true;
        }
        new Request(conf.ip[conf.baseIP].prefix + conf.ip[conf.baseIP].host + conf.ip[conf.baseIP].port + '/api')
            .addResponse(function (response) {
                console.log(response);
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    error();
                    return;
                }
                this.logged = true;
                success();
            }.bind(this))
            .addJson(null)
            .error(function (err) {
                console.log("[ERROR] Error response in login");
                error();
            }.bind(this))
            .request('/login', {
                method: 'GET'
            });

        return status;
    }

    register(data, success, errorServer, errorClient) {
        let status = false;
        new Request(conf.ip[conf.baseIP].prefix + conf.ip[conf.baseIP].host + conf.ip[conf.baseIP].port + '/api')
            .addResponse(function (response) {
                console.log(response);
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    response.json().then((json) => {
                        errorClient(json.status);
                    });
                    return;
                }
                this.logged = true;
                success();
            }.bind(this))
            .addJson(data)
            .error(function (err) {
                errorServer();
            }.bind(this))
            .request('/user', {
                method: 'PUT'
            });

        return status;
    }

    logout(success, error) {
        new Request(conf.ip[conf.baseIP].prefix + conf.ip[conf.baseIP].host + conf.ip[conf.baseIP].port + '/api')
            .addResponse(function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    error();
                    return;
                }
                this.logged = false;
                success();
            }.bind(this))
            .addJson(null)
            .error(function (err) {
                console.log("[ERROR] Error response in logout");
                error();
            })
            .request("/login", {
                method: 'DELETE'
            });
    }

    isAuth() {
        return this.logged;
    }
}

export default Auth;