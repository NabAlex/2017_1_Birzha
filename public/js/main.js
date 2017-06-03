import './conf'
import { routerInstance } from './router';

import About from './blocks/about/about'
import serviceWorkerLoader from '../../worker_loader';

import { isLogin, setOnlyBar, setCookiesAndBar } from './util';

import {
    loginPack,
    mainPack
} from './controller';

import { authInstance } from './auth';

if (window.location.protocol != "https:" && window.location.host === "cyclicgame.herokuapp.com") {
    window.location.protocol = "https:";
//    window.location.reload();
}

(function () {
    if (isLogin())
        authInstance.getMe(
            () => {
                /* success */
                console.log("cookies is true");
            },
            () => {
                /* fail */
                console.log("cookies is wrong");
                setCookiesAndBar(false);
                routerInstance.updateNewPackToIndex(loginPack);
            }
        );

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
