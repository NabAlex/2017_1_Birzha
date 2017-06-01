class Router {
    constructor(node) {
        this.node = node;
        this.routes = {};
    }

    register(route, view) {
        this.routes[route] = view;
    }

    _getViewByRoute(href) {
        return this.routes[href];
    }

    destruct() {
        for (let index in this.routes) {
            this.routes[index].hide();
        }

        delete this.routes;
    }

    setRouterPack(pack) {
        this.destruct();

        this.routes = {};
        for (let viewController of pack) {
            this.register(viewController.path,
                viewController.generator());
        }
    }

    updateNewPackToIndex(pack) {
        this.setRouterPack(pack);

        this.currentView = this._getViewByRoute('/');
        this.startPage('/');
    }

    onRouteChange(event) {
        if (!event.target instanceof HTMLAnchorElement) {
            return;
        }

        let nextHref = event.target.getAttribute('href');
        if (nextHref && this.go(nextHref))
            event.preventDefault();

    }

    start() {
        this.node
            .addEventListener('click', event => this.onRouteChange(event));

        this.currentView = this._getViewByRoute(location.pathname);
    }

    go(path) {
        if(path === '')
            path = '/';

        if(path === '/back'){
            window.history.back();
            return true;
        }

        let view = this._getViewByRoute(path);

        if(!path)
            view = this._getViewByRoute('/'); // TODO 404

        if (!view) {
            view = this.routes['/'];
            location.pathname = '/';
            path = '/';
        }

        if (this.currentView === view) {
            return true;
        }

        view.show();
        let back = location.pathname;
        if(back != path) {
            window.history.pushState(null, '', path);
        }
        if(this.currentView) {
            this.currentView.hide();
        }

        this.currentView = view;
        return true;
    }

    startPage(url) {
        let view = this._getViewByRoute(url);
        if (!view) {
            view = this.routes['/'];
            location.pathname = '/';
            url = '/';
        }
        view.show();

        window.history.pushState(null, '', url);

        window.onpopstate = function (event) {
            console.log(location.pathname);
            this.go(location.pathname);
        }.bind(this);
    }

}

    export let routerInstance = new Router(window.document.documentElement);
