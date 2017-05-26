import './conf'
import { routerInstance } from './router';

import About from './blocks/about/about'
import serviceWorkerLoader from '../../worker_loader';

import { isLogin, setOnlyBar } from './util';

import {
    loginPack,
    mainPack
} from './controller';

(function () {
    let url = window.location.pathname;

    if(mainConfiguration.needAppCache)
        serviceWorkerLoader();

    if(isLogin()) {
        setOnlyBar();
        routerInstance.setRouterPack(mainPack);
    }
    else
        routerInstance.setRouterPack(loginPack);

    /* static text */
    const aboutPage = document.getElementById('about');
    let about = new About();
    aboutPage.innerHTML = about.getElement();

    /* start clickable all objects !!! */
    routerInstance.start();
    routerInstance.startPage(url);
    
})();
