/* An Answer To :
   https://groups.google.com/g/androidscript/c/kfQwbqOfSIU
   MIT LICENSE @ 2024 - Till Forever
*/


cfg.MUI

cfg.Light


function OnStart(){
    lay = app.CreateLayout('Linear','FillXY');
    
    input = ui.addMessageBar('Message...',0.95,null,lay)
    input.SetMargins(null,0.9,null,null);
    
    input.SetOnImageInput(()=>{alert('Image')})
    input.SetOnInput((x)=>{alert(x)})
    
    
    app.AddLayout(lay);
}


/* Mini Ui Kit */
/* Ps Im following Instagrams UI */

let clearClr = "#00000000";
let royalBlue = "#405DE6";
let iconFont = 'Outlined-Regular.otf'


const pxToDpConversion = (pxValue) => {
    return pxValue / (app.GetScreenDensity() / 160);
}

const dsUnitsToDp = function(dsUnit, side){
    if (side == 'width' || side == 'w'){
        let dWidth = pxToDpConversion(DW());
        return dsUnit * dWidth;
    }
    else {
        let dHeight =  pxToDpConversion(DH());
        return dsUnit * dHeight;
    }
}

const dpToDsUnit = function(dpValue, side){
    if (side == 'width' || side == 'w'){
        let dWidth = pxToDpConversion(DW());
        return dpValue/dWidth;
    }
    else {
        let dHeight =  pxToDpConversion(DH());
        return dpValue/dHeight;
    }
}

const pxToDsUnit = function(unit,side){
    if(side == 'width' || side == 'w'){
        return unit/DW();
    }
    else return unit/DH();
}

const ui = {
    
    addAppBar: function(parentLay){
        return new appBarObject(parentLay);
    },
    
    addMessageBar: function (hint, width, options, parentLay){
        return new messageBarObject(hint,width, options, parentLay);
    }
};

function appBarObject(parentLay){
    
    let _appBar;
    
    /* You can add other methods like SetPosition */
    
    if(parentLay){
        _appBar = drawMessageInput(hint,width, options, parentLay);
    }
    else console.error('Add A Parent ^_~');
}


function messageBarObject(hint,width, options, parentLay){
    let _messageBar;
    
    this.SetMargins = function (left, top, right, bottom, mode){
        _messageBar.SetMargins(left, top, right, bottom, mode)
        defaultPos = top;
        
    }
    
    this.SetPosition = function(left,top,width,height,options){
        _messageBar.SetPosition(left,top,width,height,options)
        defaultPos = top;
    }
    
    /* You can add other methods  */
    
    if(parentLay){
        _messageBar = drawMessageInput(hint,width, options, parentLay);
    }
    else console.error('Add A Parent ^_~');
}

function drawMessageInput(hint,width, options, parent){
    let __container;
    let radius = 50/100 * 140;
    let imgIcon = 'add_a_photo';
    let auxIcon = 'mic';
   
    
    app.SetOnShowKeyboard(function(isShown){
        var keyboardHeight = pxToDsUnit(app.GetKeyboardHeight(),'w')
        let xTargetPos = (keyboardHeight + dpToDsUnit(56,'f')) - 0.4
        /* 0.4 Is OffSetHeight */
        
        if(isShown) __container.SetMargins(null,xTargetPos,null,null);
        
        else afterFocus()
        
    })
    
    const afterFocus = ()=>{
        /* Will Always Shrink Input To Normal Size After Focus */
        if (_textInput.GetLineCount() >= 1){
             __container.SetSize(dsUnitsToDp(width,'w'), 56, 'dp');
             __container.SetMargins(null,defaultPos,null,null);
        }
        else __container.SetMargins(null,defaultPos,null,null);
    }

    __container = app.AddLayout(parent, 'Card','Horizontal,FillXY,H/VCenter');
    __container.SetCornerRadius(26);
    __container.SetBackColor('#D3D3D3');
    __container.SetElevation(0)
    __container.SetSize(dsUnitsToDp(width,'w'), 56, 'dp');
    
    __subContainer = app.AddLayout(__container,'Linear','Horizontal')
    
    _imageInput = app.AddButton(__subContainer,imgIcon,null,null,'Custom')
    _imageInput.SetStyle(royalBlue,royalBlue,20,null,null,0)
    _imageInput.SetSize(140, 140, 'px')
    _imageInput.SetMargins(5,7.1,null,null,'dp');
    _imageInput.SetFontFile(iconFont)
    _imageInput.SetTextSize(18)
    
    let _textInputWidth = function(){
        return dsUnitsToDp(width,'w') - 120;
    }
        
    _textInput = app.AddTextEdit(__subContainer,'',null,null,'Multiline,Left')
    _textInput.SetBackColor('#d3d3d3')
    _textInput.SetMargins(null,12,null,null,'dp')
    _textInput.SetSize(_textInputWidth(), -1, 'dp');
    
    _textInput.SetCursorColor(royalBlue);
    _textInput.SetOnChange(function(){
        
        /* Change To Send Icon */
        if(this.GetText().length > 1)_audioInput.SetText('send');
        else _audioInput.SetText(auxIcon);
        
        /* Increase Text Input Container Height By 8 For EveryLine */
        for (i = this.GetLineCount(); i < 20; i++){
            if(this.GetLineCount() <= 1) return;
            
            else {
                let height = this.GetLineCount()*6+ 56
                __container.SetSize(dsUnitsToDp(width,'w'), height, 'dp');
            }
        }
        if (this.GetLineCount() >= 20){
            /* 170, I looked @ max height of past for loop height in 
               console.
            */
            __container.SetSize(dsUnitsToDp(width,'w'), 170, 'dp');
        }
    })
    
    if (hint)_textInput.SetHint(hint);
    
    _audioInput = app.AddButton(__subContainer,auxIcon,null,null,'Custom')
    _audioInput.SetStyle(royalBlue,royalBlue,20,null,null,0)
    _audioInput.SetSize(140, 140, 'px')
    _audioInput.SetMargins(18,7.1,null,null,'dp');
    _audioInput.SetFontFile(iconFont);
    _audioInput.SetFontFile(iconFont)
    _audioInput.SetTextSize(18)
    
    messageBarObject.prototype.SetOnImageInput = function(onImageInput){
        if(onImageInput){
            _imageInput.SetOnTouch(()=>{
                onImageInput()
            })
        }
    }
    
    messageBarObject.prototype.SetOnInput = function(onInput){
        if(onInput) {
            alert(_textInput.GetText().length)
            _audioInput.SetOnTouch(()=>{
                onInput(_audioInput.GetText())
            })
        }
    }
    
    
    return __container;
}
