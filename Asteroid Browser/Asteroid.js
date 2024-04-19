cfg.MUI
cfg.Fast


app.LoadPlugin('UIExtras');
app.LoadPlugin('PopUp');
app.LoadPlugin('Support');
app.EnableBackKey(false);
app.SetOnShowKeyboard(adjustWebPageSize)

/*Do not modify the arrangment of app.Script,
  It is used to avoid erros which say variables
  are not declared
*/
app.Script('qrcode.js');
app.Script('appBackend.js');


app.SetStatusBarColor('')
var aspectRatio = app.GetDisplayWidth() / app.GetDisplayHeight()
var userConfig,isNew,theme;
isNew = app.LoadBoolean('isNewUser',true,'userConfig');

var quickSearchBtn = function(){
    if (isUrl(app.GetClipboardText())) {
        CpdBtn = MUI.CreateButtonText('Copied Link')
        //CpdBtn.SetBackAlpha(0)
        CpdBtn.SetPosition(0.07, 0.42)
        CpdBtn.SetOnTouch(FastQuery)
        mainUi.AddChild(CpdBtn)
    }
    else{
        CpdBtn = MUI.CreateButtonText('Copied Text')
        //CpdBtn.SetBackAlpha(0)
        CpdBtn.SetPosition(0.07, 0.42)
        CpdBtn.SetOnTouch(FastQuery)
        mainUi.AddChild(CpdBtn)
    }
}

var factFile = app.ReadFile("factIndex.txt");
var lines = factFile.split("\n");
var randomIndex = Math.floor(Math.random() * lines.length);
var fact = lines[randomIndex];

function OnStart() {
    theme = app.LoadText('myTheme', 'Dark')
    app.InitializeUIKit(MUI.colors.blue.darken2, theme);
    support = app.CreateSupport();
    if (app.GetOrientation() === 'Landscape') {
        app.SetOrientation('Portrait')
    }

    if (isNew === true) NewUser();
    else appPage();
}

function NewUser() {
    
    layWelcome = MUI.CreateLayout('Absolute', 'FillXY')

    logo = app.CreateImage("Img/icon.png", 0.4, -1)
    logo.SetPosition(0.3, 0.2)
    layWelcome.AddChild(logo)

    let newmsg = "Welcome To Asteroid Browser, By Using Our Browser, You Aggree To T & C's.";
    Message = app.CreateText(newmsg, 1, 1, 'Monospace,Multiline')
    Message.SetOnTouch(function(){
        app.OpenUrl('https://asteroid.data.blog/2022/12/25/end-user-license-agreement-eula/');
    })
    Message.SetPosition(0, 0.6)
    layWelcome.AddChild(Message)

    AgreeBtn = MUI.CreateButtonContained('Agree', 0.4, 0.1)
    AgreeBtn.SetPosition(0.3, 0.8)
    AgreeBtn.SetOnTouch(function(){
        app.SaveBoolean('isNewUser', false, 'userConfig') || addNewTab();
    })
    layWelcome.AddChild(AgreeBtn)
    app.AddLayout(layWelcome)
}


function appPage(){
    lay = MUI.CreateLayout('Absolute','FillXY');
    
    mainPage();
    feedPage();
    swipeUi = support.CreatePageViewer();
    swipeUi.AddPages(mainUi,feedUi);
    lay.AddChild(swipeUi);
    
    app.AddLayout(lay)
}


function appSettings(){
    
}
function mainPage(){
    mainUi = MUI.CreateLayout('Absolute','Vcenter,FillXY');
    mainUi.SetBackground('Img/walls/f.jpg','ScaleCenter')
    logo = app.CreateImage("Img/icon.png", 0.5, -1)
    logo.SetPosition(0.25, 0.05)
    mainUi.AddChild(logo)
    
    searchBox = MUI.CreateTextEditSearch(0.85, "Left,NoSpell,Elegant", "Search Or Enter Address")
    searchBox.SetOnEnter(addTab)
    searchBox.SetPosition(0.07, 0.3)
    mainUi.AddChild(searchBox)
    
    quickSearchBtn();

    AIBtn =  MUI.CreateButtonFlat('Hayzhel AI')
    //AIBtn.SetBackAlpha(0)
    AIBtn.SetPosition(0.42, 0.42)
    AIBtn.SetOnTouch(function(){
        app.ShowPopup('Not Available Yet');
    })
    mainUi.AddChild(AIBtn);
    
    barcodeSearch = MUI.CreateButtonFlat('qrcode')
    //barcodeSearch.SetBackAlpha(0)
    barcodeSearch.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    barcodeSearch.SetPosition(0.74, 0.42)
    barcodeSearch.SetOnTouch(imageSearch)
    mainUi.AddChild(barcodeSearch)
    
    widgetUi = MUI.CreateLayout('Frame','Transparent');
    widgetUi.SetPosition(0.07, 0.52, 0.5)
    widgetUi.SetBackAlpha(0)
    mainUi.AddChild(widgetUi);
    
    quickSiteLay = MUI.CreateLayout("Card");
    quickSiteLay.SetBackAlpha(0)
    quickSiteLay.SetElevation(0)
    quickSiteLay.SetSize(0.85, 0.25);
    quickSiteLay.SetCornerRadius(2)
    quickSiteLay.SetPosition(0.07, 0.52, 0.5);
    quickSiteLay.SetVisibility('Hide')
    quickSiteLay.SetOnTouch(function(){
        quickSiteLay.SetVisibility('Hide');
        factCardLay.SetVisibility('Show');
        factCardLay.Animate('TaDa');
    })
    widgetUi.AddChild(quickSiteLay)
    
    
    
    
    
    bookmarks = MUI.CreateButtonElegant('bookmark', 0.19, 0.08)
    bookmarks.SetPosition(0.054, 0.83)
    //bookmarks.SetOnTouch(bookmarkViewer)
    bookmarks.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    mainUi.AddChild(bookmarks)

    recents = MUI.CreateButtonElegant('book', 0.19, 0.08)
    recents.SetPosition(0.29, 0.83)
    recents.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    mainUi.AddChild(recents)

    bhistory = MUI.CreateButtonElegant('gobackward', 0.19, 0.08)
    bhistory.SetPosition(0.51, 0.83)
    bhistory.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    mainUi.AddChild(bhistory)

    collections = MUI.CreateButtonElegant('archivebox', 0.19, 0.08)
    collections.SetPosition(0.74, 0.83)
    collections.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    mainUi.AddChild(collections)
    
    nextPageBtn = MUI.CreateButtonElegant('Next Page',0.65);
    nextPageBtn.SetPosition(0.05,0.93)
    nextPageBtn.SetOnTouch(function(){
        swipeUi.SetCurrentPage(1)
    })
    mainUi.AddChild(nextPageBtn)
    
    settingsIcon = MUI.CreateButtonElegant('gear_alt',0.2)
    settingsIcon.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    settingsIcon.SetOnTouch(settingsMenu)
    settingsIcon.SetPosition(0.73,0.93)
    mainUi.AddChild(settingsIcon)
}

function feedPage(){
    feedUi = MUI.CreateLayout('Absolute','VCenter,FillXy');
     
    //AppBar Showing App Title
    appBar = MUI.CreateLayout('Linear','Center,FillXY');
    appBar.SetSize(1.0,0.08);
    appBar.SetPosition(0,0);
    
    //Add App Name To The Top
    displayName = app.CreateText("Feed Page",1,1,"Monospace");
    displayName.SetTextSize(32);
    displayName.SetFontFile('Fonts/Teko.ttf');
    appBar.AddChild(displayName);
    feedUi.AddChild(appBar)
}

function settingsMenu(){
    var menuItems = 'Incognito, App Theme,Browser Tabs,More Settings';
    menu = MUI.CreateMenu(menuItems,null,null,'Bottom,Right')
    menu.SetBackAlpha(0)
    menu.SetOnSelect(function (choice){
    if(choice === 'Incognito') {
    }
    if(choice === 'App Theme') {
        if(theme === 'Dark') setLightTheme();
        else setDarkTheme();
        }
    else appSettings();
    })
    menu.Show();
    
}


function appTheming(){
    
}

function imageSearch(){
    app.LoadPlugin( "BarcodeReader" );
    qrdisplay = support.CreateBottomSheet();
    qrlay = app.CreateLayout('Absolute','VCenter,FillXY')
    qrlay.SetSize(1,0.72)
    qrdisplay.AddChild(qrlay)
    
    qrreader = app.CreateObject( "BarcodeReader" );
    cam = app.CreateCameraView( 1, 0.72, "VGA, UseYUV" );
    cam.SetOnReady( cam_OnReady );
    qrlay.AddChild( cam );
    
    flashBtn = MUI.CreateButtonFlat("lightbulb", 0.19, 0.08)
    flashBtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    flashBtn.SetPosition(0.4, 0.6)
    flashBtn.SetOnTouch(function(){
        flashOn(true);
        })
    flashBtn.Show()
    qrlay.AddChild( flashBtn );
    
    flashBtnOff = MUI.CreateButtonFlat("lightbulb_slash", 0.19, 0.08)
    flashBtnOff.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    flashBtnOff.SetPosition(0.4, 0.6)
    flashBtnOff.SetOnTouch(function(){
        flashOn(false);
        })
    flashBtnOff.Hide()
    qrlay.AddChild( flashBtnOff );
    qrdisplay.Show();
    
}

function flashOn(val){
    if(val === true){
    cam.SetFlash(true)
    flashBtn.Hide()
    flashBtnOff.Show()
    }
    else{
        cam.SetFlash(false)
        flashBtnOff.Hide()
        flashBtn.Show()
    }
}
function cam_OnReady()
{
  cam.StartPreview();
  DecodeFromCamera();
}

function DecodeFromCamera()
{
  var result = qrreader.Decode( cam );

  if( result != null )
  {
    app.Vibrate( "0,100,30,100,50,300" );
    cam.StopPreview()
    qrdisplay.Dismiss()
    let data = result.content;
    let searchdata = "https://www.google.com/search?q=" +data;
    if( isUrl(result.content)){
        webSearch(result.content)
    }
    else{
        webSearch(searchdata);
    }
    
  }
else
  {
    //Decode again in 200 milliseconds.
    setTimeout( DecodeFromCamera, 200 );
  }
 
}
function webControls() {
    sup = app.CreateSupport();
    var panel = sup.CreateBottomSheet(0, 0, "NoDim")
    panellay = MUI.CreateLayout("Absolute", "VCenter,FillXY")
    panellay.SetSize(1, 0.35)
    panel.AddChild(panellay)

    if (theme === 'Dark') {
        themebtn = MUI.CreateButtonFlat("sun_max_fill", 0.35)
        themebtn.SetPosition(0.1, 0, 0.2, 0.1)
        themebtn.SetOnTouch(setLightTheme)
        themebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    } else {
        themebtn = MUI.CreateButtonFlat("moon", 0.35)
        themebtn.SetPosition(0.1, 0, 0.2, 0.1)
        themebtn.SetOnTouch(setDarkTheme)
        themebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")
    }

    htbtn = MUI.CreateButtonFlat("goforward", 0.35)
    htbtn.SetPosition(0.3, 0, 0.2, 0.1)
    htbtn.SetOnTouch(webReload)
    htbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    tlebtn = MUI.CreateButtonFlat("doc_append", 0.35)
    tlebtn.SetPosition(0.5, 0, 0.2, 0.1)
    tlebtn.SetOnTouch(GetContentLang)
    tlebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    pinbtn = MUI.CreateButtonFlat("bookmark", 0.35)
    pinbtn.SetPosition(0.7, 0, 0.2, 0.1)
    pinbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    sharebtn = MUI.CreateButtonFlat("square_arrow_up_on_square", 0.35)
    sharebtn.SetPosition(0.1, 0.11, 0.2, 0.1)
    sharebtn.SetOnTouch(ShareContent)
    sharebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    readerbtn = MUI.CreateButtonFlat("doc_plaintext", 0.35)
    readerbtn.SetPosition(0.3, 0.11, 0.2, 0.1)
    //readerbtn.SetOnTouch(ReaderView)
    readerbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    findbtn = MUI.CreateButtonFlat("doc_text_search", 0.35)
    findbtn.SetPosition(0.5, 0.11, 0.2, 0.1)
    //findbtn.SetOnTouch(FindInPage)
    findbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    downloadbtn = MUI.CreateButtonFlat("cloud_download", 0.35)
    downloadbtn.SetPosition(0.7, 0.11, 0.2, 0.1)
    downloadbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    stngsbtn = MUI.CreateButtonFlat("gear_alt", 0.35)
    stngsbtn.SetPosition(0.5, 0.25, 0.2, 0.1)
    //stngsbtn.SetOnTouch(SettingsPanel)
    stngsbtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    closebtn = MUI.CreateButtonFlat("power", 0.35)
    closebtn.SetPosition(0.7, 0.25, 0.2, 0.1)
    closebtn.SetOnTouch(ExitApp)
    closebtn.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    panellay.AddChild(closebtn);
    panellay.AddChild(stngsbtn);
    panellay.AddChild(downloadbtn);
    panellay.AddChild(findbtn);
    panellay.AddChild(readerbtn);
    panellay.AddChild(sharebtn);
    panellay.AddChild(themebtn);
    panellay.AddChild(htbtn);
    panellay.AddChild(tlebtn);
    panellay.AddChild(pinbtn);
    panel.Show();

}

function addTab(url,main){
    
    searchUi = MUI.CreateLayout('Absolute','FillXY');
    searchUi.SetSize(1,1);
    searchUi.Show();
    
    searchBarUi = MUI.CreateLayout('Absolute','FillXY');
    searchBarUi.SetPosition(0, 0.93, 1)
    searchBarUi.SetSize(1,0.2)
    searchBarUi.Hide();
    searchUi.AddChild(searchBarUi)
    
    editBar = MUI.CreateTextEditSearch(0.8, "Left",null)
    searchBarUi.AddChild(editBar)
        
    navigationUi = MUI.CreateLayout("Absolute", "FillXY")
    navigationUi.SetPosition(0, 0.93, 1, 0.09)
    
    webPage = app.CreateWebView(1,0.905,"IgnoreSSLErrors,IgnoreErrors,NoPause,AllowZoom,ScrollFade,AllowCapture");
    webPage.SetOnRequest(webPageRequest)
    webPage.SetOnUrl(webOnUrl)
    webPage.SetContextMenus( "Copy URL", "Download Image" )
    webPage.SetOnContextMenu(function(item,url,img,type){
        if(item === 'Copy URL') app.SetClipboardText(webPage.GetUrl());
        else app.DownloadFile(url,app.GetSpecialFolder('DCIM'),'image',null,'NoDialog');
        })
    //webPage.SetInject('pageScript.js')
    searchUi.AddChild(webPage);
    
    pageNameUi = MUI.CreateLayout('Linear', "Horizontal,HCenter")
    pageNameUi.SetSize(1, 0.025)
    pageNameUi.SetPosition(0, 0.905, 1, 0.025);
    searchUi.AddChild(pageNameUi)
    
    domainName = app.CreateText('searching...',null,null,'Monospace');
    domainName.SetOnTouchUp(function() {
    editBar.SetText(webPage.GetUrl());
    if ("Show" === navigationUi.GetVisibility()) {
        navigationUi.Hide();
        searchBarUi.Show();
    } else {
        searchBarUi.Hide();
        navigationUi.Show();
    }
});
    pageNameUi.AddChild(domainName)
   
    back = MUI.CreateButtonFlat("chevron_left", 0.19, 0.08)
    back.SetPosition(0, 0, 0.19, 0.08)
    back.SetOnTouch(webOnBack)
    back.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    forward = MUI.CreateButtonFlat("chevron_right", 0.19, 0.08)
    forward.SetPosition(0.2, 0, 0.19, 0.08)
    forward.SetOnTouch(webOnForward)
    forward.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    panel = MUI.CreateButtonFlat("slider_horizontal_3", 0.19, 0.08)
    panel.SetPosition(0.4, 0, 0.19, 0.08);
    panel.SetFontFile("Fonts/Framework7Icons-Regular.ttf");
    panel.SetOnTouch(webControls)

    tabdrawer = MUI.CreateButtonFlat("rectangle_stack", 0.19, 0.08)
    //tabdrawer.SetOnTouch(showTabDrawer)
    tabdrawer.SetPosition(0.6, 0, 0.19, 0.08)
    tabdrawer.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    home = MUI.CreateButtonFlat("house", 0.19, 0.08)
    home.SetPosition(0.8, 0, 0.19, 0.08)
    home.SetOnTouch(goToHome)
    home.SetFontFile("Fonts/Framework7Icons-Regular.ttf")

    navigationUi.AddChild(back)
    navigationUi.AddChild(forward)
    navigationUi.AddChild(panel)
    navigationUi.AddChild(tabdrawer)
    navigationUi.AddChild(home)
    searchUi.AddChild(navigationUi)
    
    app.AddLayout(searchUi);
    
    try {
        // Get the text from the input
        var query = this.GetText();
        
        // Hide the keyboard and a layout if needed
        app.HideKeyboard() || lay.SetVisibility('Hide');

        // Generate search URLs
        let fixedquery = 'https://' + query;
        let searchquery = "https://www.google.com/search?q=" + query;
        
        // Check if it's a URL and a domain
        if (isUrl(query) === true && isDomain(query) === true) {
            webPage.LoadUrl(query);
        } else if (isUrl(query) === true && isDomain(query) === false) {
            webPage.LoadUrl(fixedquery);
        } else {
            webPage.LoadUrl(searchquery);
        }
    } catch (err) {}

    // Generate a search URL based on the clipboard text
    var fastsearchquery = "https://www.google.com/search?q=" + app.GetClipboardText();

    // Check if it's a URL and a domain
    if (isUrl(url) && isDomain(url) === true) {
        webPage.LoadUrl(url);
    }

    // Check if it's not a URL and not a domain
    else if (isText(url) === false && isDomain(url) === false) {
        let fixedquery = 'https://' + url;
        webPage.LoadUrl(fixedquery);
    }

    // Check if it's text and not the main URL
    if (isText(url) === true && main === false) {
        webPage.LoadUrl(fastsearchquery);
    }
    domainName.SetText(getDomainName(webPage.GetUrl));
}

function webPageRequest(url, method, isMain, isAsync) {
    let webPageDomain = getDomainName(webPage.GetUrl())
    if (webPageDomain !== currentDomain) {
        if (siteText) { // Check if siteText is defined before removing it
            siteLinear.RemoveChild(siteText);
        }
        
       domainName.SetText(webPageDomain)
        currentDomain = webPageDomain;
    }

}

function adjustWebPageSize(keyboardVisible) {
    var keyboardHeight = app.GetKeyboardHeight();
    var displayHeight = app.GetDisplayHeight();
    var webPageHeight = displayHeight - keyboardHeight;
    var adjustedHeight = (webPageHeight / displayHeight) * 1 - 0.001;
    var adjustedHeightWithOffset = (webPageHeight / displayHeight) * 1 + 6.58;

    // Use try-catch to handle potential errors when keyboard controls are not supported
    try {
        if (keyboardVisible === true && navigationUi.IsVisible()) {
            webPage.SetSize(1, adjustedHeight);
        } else {
            webPage.SetSize(1, 0.905);
        }
    } catch (error) {
        // Handle any potential errors gracefully
        return null;
    }
}

//In These Theme function try & catch are used cuz, we hv mainUi, it dont got a panel
function setDarkTheme() {
    try {
        panel.Dismiss();
        app.SaveText("myTheme", "Dark");
        setTimeout(OnStart, 0.01);
        currentDomain = 'somedomain.lfsfc';
    } catch (error) {
        app.SaveText("myTheme", "Dark");
        setTimeout(OnStart, 0.01);
    }
}

function setLightTheme() {
    try {
        panel.Dismiss();
        app.SaveText("myTheme", "Light");
        setTimeout(OnStart, 0.01);
        currentDomain = 'somedomain.lfsfc';
    } catch (error) {
        app.SaveText("myTheme", "Light");
        setTimeout(OnStart, 0.01);
    }
}


function ShareContent(){
    shareIndex = support.CreateBottomSheetList('Other,Copy,Share Qr Code','Sharing Index');
    shareIndex.SetOnTouch(shareOpt);
    shareIndex.Show();
}

function shareOpt(option) {
    if (option === "Copy") {
        shareIndex.Dismiss() || app.SetClipboardText(webPage.GetUrl());
    } else if (option === "Other") {
         shareIndex.Dismiss() ||app.SendText(webPage.GetUrl(), webPage.GetTitle(), "Choose an app");
    } else if (option === 'Share Qr Code') {
        //panel.Dismiss() || shareIndex.Dismiss();
        qr = support.CreateBottomSheet();
        qrCodeUi = MUI.CreateLayout('Linear', 'HCenter,VCenter');
        qrCodeUi.SetSize(1, 0.3);
        qr.AddChild(qrCodeUi);

        qrImage = app.CreateImage(null, 0.5, aspectRatio * 0.5);
        qrCodeUi.AddChild(qrImage);
        qr.Show();
        QRCode.Init(qrImage);
        QRCode.SetText(webPage.GetUrl());
    }
}

function OnBack() {
    try {
        if (lay.IsVisible()) ExitApp();
        if (searchUi.IsVisible() && webPage.CanGoBack()) webOnBack();
        else {
            goToHome();
        }
    } catch (err) {
        console.log(err);
    }
}


function OnData(isStartUp) {
    var intent = app.GetIntent();
    if (intent) {
        if (isUrl(intent.data)) webSearch(intent.data);

    }
}

function webOnBack() {
    try {
        if (webPage.CanGoBack()) webPage.Back();
        else {
            goToHome();
        }
    
    } catch (err) {
        goToHome();
    }
}


function goToHome() {
    try {
        webPage.LoadUrl('https://www.$$@@.vroom')
        app.DestroyLayout(searchUi) || lay.Show();
        
    } catch (err) {
        return null;
    }
    
}

function webReload() {
    try {

        let url = webPage.GetUrl();
        webPage.LoadUrl(url) || panel.Dismiss();
        popup = app.CreatePopUp();
        popup.SetText("[fa-info-circle] Reloading Page:");
        popup.SetMargins(0, 0.02, 0, 0)
        popup.Align('bottom');
        popup.Duration("short");
        popup.Show();

    } catch (err) {}

}

function webOnForward() {
    try {

        if (webPage.CanGoForward()) webPage.Forward();
        else DoNothing()
    } catch (err) {
        return null;
    }
}

function ExitApp() {
    app.Exit();
}
