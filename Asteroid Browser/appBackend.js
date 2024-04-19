 

function GetContentLang() {
    try {
        webPage.Execute("document.documentElement.lang", TranslateContent);
    } catch (t) {
        panel.Dismiss(), toast = app.CreatePopUp(), toast.SetType("toast"), toast.SetText("[fa-info-circle] No  Resource Loaded", "Bottom"), toast.SetMargins(0.05, 0.02, 0.05, 0.1), toast.Align("bottom"), toast.SetColor("#262628"), toast.Duration("short"), toast.AnimateIn(""), toast.AnimateOut(""), toast.Show();
    }
}

function TranslateContent(t) {
    let e = "https://translate.google.com/translate?sl=auto&tl=" + t + "&u=" + webPage.GetUrl();
    webPage.LoadUrl(e) || panel.Dismiss();
}


function webOnUrl(url) {
    if (isUrl(url) === true && isDownloadable(url) === true) {
        startDownload(url);
    }
        
    if(isTel(url)){
        app.Call(extractPhoneNumber(url))
    } 
    
     if(isMailToScheme(url)){
    let email = extractEmail(webPage.GetUrl());
        let subject = extractSubject(webPage.GetUrl());
        let body = extractBody(webPage.GetUrl());
        app.SendMail(email, subject, body);
    }
    if (isSmsScheme(url)) {
        let number = extractSmsNumber(webPage.GetUrl());
        let body = extractSmsBody(webPage.GetUrl());
        app.SendSMS(body, number);
    } 
    
    if(isUrl(url)){
        webPage.LoadUrl(url); 
    }
    
    
}
function isText(str) {
    // Regular expression to match URLs
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    // Check if the string matches the URL regex
    if (urlRegex.test(str)) {
        return false; // It's a URL
    } else {
        return true; // It's text
    }
}
function isMailToScheme(str) {
    const mailtoPattern = /^mailto:/i;
    return mailtoPattern.test(str);
}

// CHATGPT USED HERE FOR ISURL FUNCTION && ISDOMAIN
function isUrl(text) {
    // Use regular expression to check if the string contains a domain name
    const domainRegex = /^(?:\w+\.)+\w+$/i;
    const hasDomain = domainRegex.test(text);

    // Use regular expression to check if the string starts with a protocol
    // (http, https, ftp, etc.) followed by a colon and two slashes, or just
    // a double-slash (which indicates a protocol-relative URL)
    const protocolRegex = /^((https?|ftp):\/\/|\/\/)/i;
    const hasProtocol = protocolRegex.test(text);

    // Use regular expression to extract the domain from the URL
    const domainMatch = domainRegex.exec(text);
    const domain = domainMatch ? domainMatch[0] : '';

    // Use regular expression to check if the domain has a valid TLD (top-level domain)
    const tldRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    const hasValidTLD = tldRegex.test(domain);

    // Return true if either the domain, the protocol, or the domain TLD is valid
    return hasDomain || hasProtocol || hasValidTLD;
}

function isDomain(text) {
    // Use regular expression to check if the string starts with a protocol
    // (http, https, ftp, etc.) followed by a colon and two slashes
    const protocolRegex = /^(https?|ftp):\/\/+/i;
    const hasProtocol = protocolRegex.test(text);

    // Use regular expression to extract the domain from the URL
    const domainRegex = /(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/i;
    const domainMatch = domainRegex.exec(text);
    const domain = domainMatch ? domainMatch[1] : '';

    // Use regular expression to check if the domain has a valid TLD (top-level domain)
    const tldRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    const hasValidTLD = tldRegex.test(domain);

    // Return true only if the protocol is http or https and the domain has a valid TLD
    return hasProtocol && hasValidTLD;
}

function IsDocument(url) {
    const documentRegex = /\.(pdf|docx|pptx|xlsx)$/i;
    return documentRegex.test(url);
}

function IsFile(url) {
    try {
        var fileExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'apk', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'mp3', 'wav', 'ogg', 'mp4', 'avi', 'mov', 'wmv', 'zip', 'rar', '7z', 'csv', 'exe', 'dll', 'jar', 'ttf', 'otf'];
        var fileExtension = url.split('.').pop().toLowerCase();

        if (fileExtensions.includes(fileExtension)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {}
}

function FileName(url) {
    const match = url.match(/\/([^\/?&]+)[^\/]*$/);
    if (match) {
        return match[1];
    }
    // If no filename found using regex, use the last part of the URL as the filename
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}

function IsExtended(url) {
    var queryParams = url.split('?')[1];
    if (queryParams) {
        return true;
    } else {
        return false;
    }
}

function FastQuery() {
    if (isUrl(app.GetClipboardText())) addTab(app.GetClipboardText(), true);
    else addTab(app.GetClipboardText(), false);
}

function getDomainName(url) {
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


function extractEmail(url) {
    const mailtoPattern = /^mailto:(.+)/i;
    const match = url.match(mailtoPattern);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

function MalwareKiller() {
    let list = app.ReadFile('malwarelist.txt');

    let listArray = list.split('\n');
    if (listArray.includes(getDomainName())) {
        web.LoadUrl('webSafety.html')
    }

}

var processedFiles = [];

let currentDomain = '';
let siteText = null; // Define siteText with a default value of null

function webOnRequest(url, method, isMain, isAsync) {
    var domainName = getDomainName();
    if (domainName !== currentDomain) {
        if (siteText) { // Check if siteText is defined before removing it
            siteLinear.RemoveChild(siteText);
        }
        siteText = app.CreateText(domainName, 1, null, null, null, "Can be Thin");
        siteText.SetOnTouch(editBar)
        //siteText.SetPosition(0.4, 0, 1, 0.5);
        if (theme === 'Dark') siteText.SetTextColor('#f5f5f5')
        siteLinear.AddChild(siteText);
       
        currentDomain = domainName;
    }

}

function isDownloadable(url) {
    try {
        const downloadExtensions = [
            '7z', 'aac', 'apk', 'avi', 'bmp', 'css', 'csv', 'doc', 'docx', 'flac', 'flv', 'gif', 'gz', 'gzip',
            'ics', 'iso', 'jar', 'jpeg', 'jpg', 'js', 'json', 'm4a', 'm4v', 'mid', 'mov', 'mp3', 'mp4', 'mpeg', 'mpg',
            'odp', 'ods', 'odt', 'ogg', 'ogv', 'pdf', 'png', 'ppt', 'pptx', 'rar', 'rtf', 'sh', 'svg', 'swf', 'tar',
            'tif', 'tiff', 'ts', 'wav', 'webm', 'webp', 'woff', 'woff2', 'xls', 'xlsx', 'xml', 'xul', 'zip'
        ];

        const downloadableHostnames = [
            // Add your downloadable hostnames here
        ];

        const urlObject = new URL(url);

        // Check if the URL is from a downloadable hostname
        if (downloadableHostnames.includes(urlObject.hostname)) {
            return true;
        }

        // Check if the URL has a downloadable file extension
        const urlPath = urlObject.pathname.toLowerCase();
        if (downloadExtensions.some(ext => new RegExp(`\\.${ext}$`).test(urlPath))) {
            return true;
        }

        // ... (rest of the checks)

        // Use DroidScript's app.HttpRequest for performing a HEAD request and check response headers
        let isDownloadable = false;
        app.HttpRequest('HEAD', url, null, null, function (error, reply) {
            if (error) {
                // Handle any errors here if needed
            } else {
                const contentType = reply.headers['Content-Type'];
                const contentDisposition = reply.headers['Content-Disposition'];

                if (contentType && contentType.includes('application') ||
                    contentDisposition && contentDisposition.includes('attachment')) {
                    isDownloadable = true;
                }
            }
        });

        return isDownloadable;

    } catch (e) {
        // Handle any errors here if needed
        return false;
    }
}

function isTel(str) {
    const regex = /^tel:/;
    return regex.test(str);
}

function extractPhoneNumber(str) {
    const regex = /^tel:(\+?\d+)/;
    const match = str.match(regex);
    if (match) {
        return match[1];
    } else {
        return null;
    }
}

function getDownloadUrl(url) {
    const downloadableHostnames = [

    ];

    const urlObject = new URL(url);
    const hostname = urlObject.hostname;

    if (downloadableHostnames.includes(hostname)) {
        // If the URL is from a downloadable hostname, return the original URL
        return url;
    }
    
    var downloadExtensions = ['7z', 'aac', 'abw', 'apk', 'asf', 'avi', 'bat', 'bmp', 'bz', 'bz2', 'cab', 'cmd', 'com', 'cpio', 'csv', 'cr2', 'css', 'cw', 'cwk', 'deb', 'dif', 'dmg', 'dll', 'doc', 'docm', 'docx', 'dot', 'dotm', 'eps', 'epub', 'exr', 'f4v', 'flac', 'flv', 'fodg', 'fodp', 'fodt', 'gif', 'gz', 'gzip', 'hwp', 'html', 'ics', 'ico', 'ind', 'ipa', 'iso', 'jar', 'j2k', 'jp2', 'jpf', 'jpx', 'jpeg', 'jpg', 'js', 'json', 'key', 'lha', 'lzh', 'lzma', 'm2v', 'm4a', 'm4p', 'm4v', 'mdb', 'midi', 'mht', 'mhtl', 'mhtml', 'mov', 'mp3', 'mp4', 'mpeg', 'mpeg2', 'mpg', 'mpg2', 'msg', 'nef', 'odp', 'ods', 'odt', 'ogg', 'ogm', 'ogv', 'or', 'orf', 'ott', 'pages', 'pdf', 'pkg', 'png', 'pps', 'ppsm', 'ppsx', 'ppt', 'pptm', 'pptx', 'psd', 'py', 'qt', 'ra', 'ram', 'rar', 'rar5', 'raw', 'rmvb', 'rpm', 'rtf', 'sea', 'sh', 'sdd', 'sit', 'sitx', 'snd', 'spk', 'svg', 'svgz', 'swf', 'tar', 'tbz', 'tbz2', 'tif', 'tiff', 'ts', 'txt', 'vb', 'vbs', 'vob', 'war', 'wav', 'webm', 'webp', 'wma', 'wmv', 'wpd', 'wps', 'ws', 'wsf', 'xla', 'xlam', 'xls', 'xlsb', 'xlsm', 'xlsx', 'xlt', 'xltx', 'xml', 'xpi', 'xps', 'xwp', 'zip', 'zst'];

    // Check for query parameters that indicate a downloadable file
    const queryParams = urlObject.searchParams;
    if (queryParams.has('download') || queryParams.has('dl') || queryParams.has('attach')) {
        // Return the URL with the query parameters removed
        const urlWithoutQueryParams = url.split('?')[0];
        return urlWithoutQueryParams;
    }

    // Check for a file extension in the URL
    const path = urlObject.pathname;
    const parts = path.split('/');
    const lastPart = parts[parts.length - 1];
    const extensionIndex = lastPart.lastIndexOf('.');
    if (extensionIndex > -1) {
        const extension = lastPart.slice(extensionIndex + 1);
        if (downloadExtensions.includes(extension)) {
            // Return the URL with the filename replaced by "download"
            const filenameWithoutExtension = lastPart.slice(0, extensionIndex);
            const urlWithoutFilename = url.replace(lastPart, '');
            const downloadUrl = urlWithoutFilename + 'download.' + extension;
            return downloadUrl;
        }
    }

    // If no downloadable URL is found, return the original URL
    return url;
}

function startDownload(url) {
    let dloadUrl = url;
    downloadFile(dloadUrl)
    toasta = app.CreatePopUp();
    toasta.SetType("toast");
    toasta.SetText("[fa-info-circle] Downloading File", "Bottom");
    toasta.SetMargins(0.05, 0.02, 0.05, 0.1);
    toasta.SetColor("#262628");
    toasta.Duration("short");
    toasta.AnimateIn("");
    toasta.AnimateOut("slidetoright");
    toasta.Show();

}


function downloadFile(SourceFileURL) {
    var fileuri = SourceFileURL;
    let uri = getDownloadUrl(fileuri)  
    var docName = FileName(fileuri)
    var targetDir = app.GetSpecialFolder('Downloads')
    var newDest = targetDir + '/' + docName;

    app.DownloadFile(SourceFileURL, newDest, docName, null, 'NoDialog')
}
 
function extractSubject(url) {
    const mailtoPattern = /^mailto:([^?]+)\?(.*)$/i;
    const match = url.match(mailtoPattern);
    if (match) {
        const subjectParamPattern = /subject=([^&]+)/i;
        const subjectParamMatch = match[2].match(subjectParamPattern);
        if (subjectParamMatch) {
            return decodeURIComponent(subjectParamMatch[1].replace(/\+/g, ' '));
        }
    }
    return null;
}

function extractBody(url) {
    const mailtoPattern = /^mailto:([^?]+)\?(.*)$/i;
    const match = url.match(mailtoPattern);
    if (match) {
        const bodyParamPattern = /body=([^&]+)/i;
        const bodyParamMatch = match[2].match(bodyParamPattern);
        if (bodyParamMatch) {
            return decodeURIComponent(bodyParamMatch[1].replace(/\+/g, ' '));
        }
    }
    return null;
}

function isSmsScheme(str) {
    const smsPattern = /^sms:/i;
    return smsPattern.test(str);
}



function extractSmsNumber(str) {
    const smsPattern = /^sms:(\+?\d+)/i;
    const match = str.match(smsPattern);
    if (match) {
        return match[1];
    }
    return null;
}

function extractSmsBody(str) {
    const smsPattern = /^sms:(\+?\d+)(\?.*)?$/i;
    const match = str.match(smsPattern);
    if (match) {
        const queryParamPattern = /body=([^&]+)/i;
        const queryParamMatch = match[2] && match[2].match(queryParamPattern);

        if (queryParamMatch) {
            return decodeURIComponent(queryParamMatch[1].replace(/\+/g, ' '));
        }
    }
    return null;
};


function hasTel(url) {
    return url.startsWith('tel:');
}

function extractPhoneNumber(link) {
    const urlStartIndex = link.indexOf('tel:');
    if (urlStartIndex !== -1) {
        const url = link.slice(urlStartIndex);
        const phoneNumber = url.slice(4); // Remove the 'tel:' prefix
        return phoneNumber;
    }
    return null;
}

// UTF-8 Support.
!function(qrcode) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
}(qrcode);

const QRCode = {};

// Add text
QRCode.SetText = function( txt ) {
    this.qr.addData( txt ); // add text to qr
    this.qr.make(); // draw qr
    // QR quality and margin
    var url = this.qr.createDataURL( 7, 10 );
    this.img.SetPixelData( url );
    this.qr = qrcode( 4, "L" );
};

// New instance
QRCode.Init = function( imgObj ) {
    this.img = imgObj;
    // Level and error ....
    this.qr = qrcode( 4, "L" );
};

// Save sdcard
QRCode.Save = function( path ) {
    this.img.Save( path );
    app.ScanFile( path ); // Say the gallery this is new image
};
