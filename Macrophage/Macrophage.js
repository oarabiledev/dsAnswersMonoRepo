cfg.MUI
cfg.Portrait
cfg.xFast
app.SetStatusBarColor('#121212');
app.LoadPlugin('Support')
var UserConfig, isNew, theme, userNetwork, ip, signalStrength, signalTLDR;
UserConfig = 'profile';
isNew = app.LoadBoolean('isNewUser', true, 'UserConfig');


//GETTING USER IP ADRESS
var baseUrl = "http://api.ipify.org";
var path = "/";
var params = null;
var headers = null;

function OnStart() {

    theme = app.LoadText('myTheme', 'Light')
    app.InitializeUIKit(MUI.colors.blue.lighten1, theme);
     // splash screen
    splashlay = MUI.CreateLayout("linear", "VCenter,FillXY");
    logo = app.CreateImage("Img/icon.png", 0.4, -1)
    //logo.Animate("fadein")
    splashlay.AddChild(logo)
    app.AddLayout(splashlay);

    setTimeout(function() {
        app.DestroyLayout(splashlay)
    }, 2000)
    if (isNew === true) NewUser();
    else Main();
}

function NewUser(){
    layWelcome = MUI.CreateLayout('Absolute', 'FillXY')
    
    logo = app.CreateImage("Img/icon.png", 0.4, -1)
    logo.SetPosition(0.3, 0.2)
    layWelcome.AddChild(logo)

    let newmsg = "Welcome To Macrophage Security, By Using Our App, You Aggree To T & C's.";
    Message = app.CreateText(newmsg, 1, 1, 'Monospace,Multiline')
    Message.SetOnTouch(ShowTerms)
    Message.SetPosition(0, 0.6)
    layWelcome.AddChild(Message)

    AgreeBtn = MUI.CreateButtonContained('Agree', 0.4, 0.1)
    AgreeBtn.SetPosition(0.3, 0.8)
    AgreeBtn.SetOnTouch(AcceptedTerms)
    layWelcome.AddChild(AgreeBtn)
    app.AddLayout(layWelcome)
}

function ShowTerms() {
    app.OpenUrl('https://asteroid.data.blog/2022/12/25/end-user-license-aggreement-eula/')
}

function AcceptedTerms() {
    app.SaveBoolean('isNewUser', false, 'UserConfig') || Main();
}

function Main(){
    sup = app.CreateSupport();
 
    swipe = sup.CreateSwipeRefreshLayout( "FillXY" );
    swipe.SetColors( color.RED, color.GREEN, color.BLUE, color.YELLOW );
    swipe.SetBackColor( "#FAFAFA" );
    swipe.SetOnRefresh( swipe_OnRefresh );
    mainLay = MUI.CreateLayout('Absolute','VCenter,FillXY');
    //AppBar Showing App Title
    appBar = MUI.CreateLayout('Linear','Center,FillXY');
    appBar.SetSize(1.0,0.08);
    appBar.SetPosition(0,0);
    swipe.AddChild(mainLay)
    //Add App Name To The Top
    displayName = app.CreateText("macrophage",1,1,"Monospace");
    displayName.SetTextSize(32);
    displayName.SetFontFile('Font/SpaceMono.ttf');
    appBar.AddChild(displayName);
    
    mainLay.AddChild(appBar);
    
    
    //Ip and Network Layout 
    networkCard = MUI.CreateLayout('Card','VCenter');
    networkCard.SetSize(0.85,0.25);
    networkCard.SetBackground('Img/dark.png');
    networkCard.SetPosition(0.08,0.1);
    
    //Information Layout
    infoLay = app.CreateLayout('Linear','VCentre,FillY');
    networkCard.AddChild(infoLay);
    

    
    app.HttpRequest("GET", baseUrl, path, params, function(error, reply) {
        if (error) {
        networkText = app.CreateText('No Internet Connection.',1,1,"Monospace,Multiline");
        networkText.SetFontFile('Font/SpaceMono.ttf');
        networkText.SetTextColor('#FFC107')
        //networkText.SetPosition(-0.1,0.001)
        infoLay.AddChild(networkText)
    } else {
        if(app.IsWifiEnabled()){ userNetwork = 'Wifi'} else{ userNetwork = 'Mobile'};
        ip = reply.trim();
        signalStrength = app.GetRSSI();
        signalTLDR = getSignalStrengthTLDR(signalStrength);
        var text = 'Network: ' + userNetwork + '\n' + 'IP Address: ' + ip + '\n' + 'Signal Strength : ' + signalStrength + ' dBm' + '\n' + 'Signal TLDR : '+ signalTLDR.tldr + '\n'+ 'Signal Usage : '+ signalTLDR.usage;
        
        //Network Text
        networkText = app.CreateText(text,1,1,"Monospace,Multiline");
        networkText.SetFontFile('Font/SpaceMono.ttf');
        networkText.SetTextColor('#FFC107')
        //networkText.SetPosition(-0.1,0.001)
        infoLay.AddChild(networkText)
    }
}, headers);
 
    mainLay.AddChild(networkCard)
    app.AddLayout(swipe)
}

function getSignalStrengthTLDR(signalStrength) {
    if (signalStrength >= -30) {
        return {
            tldr: "Amazing",
            usage: "Do You"
        };
    } else if (signalStrength >= -67) {
        return {
            tldr: "Very Good",
            usage: "VoIP/Youtube"
        };
    } else if (signalStrength >= -70) {
        return {
            tldr: "Okay",
            usage: "Email/Web"
        };
    } else if (signalStrength >= -80) {
        return {
            tldr: "Not Good",
            usage: "Unreliable"
        };
    } else if (signalStrength >= -90) {
        return {
            tldr: "Unusable",
            usage: "May Fail"
        };
    } else if (signalStrength >= -127) {
        return {
            tldr: "Disabled",
            usage: "Total Failure"
        };
    } else {
        return {
            tldr: "not available",
            usage: "N/A"
        };
    }
}

function swipe_OnRefresh()
{
 setTimeout(function(){
 Main()
 swipe.SetRefreshing( false );
 }, 3000 );
}

function getDomainName(name) {
    let url = name;
    if (!url || typeof url !== 'string') {
        // Handle the case when the URL is null, undefined, or not a string
        return null; // Or you can return an empty string, depending on your use case
    }

    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    const protocolIndex = url.indexOf("://");
    if (protocolIndex > -1) {
        domain = url.split('/')[2];
    } else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];
    //find & remove www subdomain
    domain = domain.replace(/^www\./i, '');
    //find & remove query string
    domain = domain.split('?')[0];

    return domain;
}

//RETURNS FALSE IF URL IS UNSAFE
function isUrlSafe(url){
    let unsafeDomains = app.ReadFile('MalwareList.txt');
    let listArray = unsafeDomains.split('\n');
    if(listArray.includes(getDomainName(url))){
        return false;
    } 
    else{
        return true;
    }
}

//RETURNS TRUE IF LINK IS A REFERRER SPAM
function isReferrerSpam(url){
    let unsafeLinks = app.ReadFile('ReferrerSpamList.txt');
    let unsafeLinksArray = unsafeLinks.split('\n');
    if(unsafeLinksArray.includes(getDomainName(url))){
        return true;
    }
    else {
        return false;
        }
}

//RETURNS FALSE IF EMAIL IS BAD
function isEmailSafe(email){
    let unsafeEmails = app.ReadFile('SpamEmailList.txt')
    let emailArray = unsafeEmails.split('\n');
    if(emailArray.includes(email)){
        return false;
    }
    else{
        return true;
    }
}
