// i'd make an actual ddos protection with captcha like what cloudflare did if i had a web server

spamRefresh = localStorage.getItem("spamRefresh");
unixTS = localStorage.getItem("unix");
localStorage.setItem("previousURL", window.location.href);

iAmNotNamingFunctionsCorrectlyUnlessImLegallyObligatedSo(spamRefresh, unixTS);

function iAmNotNamingFunctionsCorrectlyUnlessImLegallyObligatedSo(spamRefresh, unixTS){
    if (spamRefresh === null) {
        spamRefresh = 0;
        localStorage.setItem('spamRefresh', 0);
    };
    
    if (spamRefresh >= 5) {
        window.location.href = window.location.origin + "/c";
        return
    };
    
    if (unixTS == null) {
        unixTS = Math.floor(Date.now() / 1000);
        localStorage.setItem("unix", unixTS);
    };
    
    unixCHK = unixTS + 60;
    
    if (unixTS > unixCHK) {
        spamRefresh = 0;
        localStorage.setItem('spamRefresh', 0);
        unixTS = Math.floor(Date.now() / 1000);
        localStorage.setItem("unix", unixTS);
        return;
    };

    spamRefresh++;
    localStorage.setItem('spamRefresh', spamRefresh);
};

