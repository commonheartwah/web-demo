import './popup.css';
interface AlertOption {
    type?       : string;
    title?     : string;
    msg?       : string;
    okText?    : string;
    cancelText?: string;
    hideCancel?: boolean;
    isRandom?: boolean;
}
interface MaskOption {
    type?: string;
    msg?: string;
}
interface RetryOption {
    type?: string;
    msg?: string;
    okText?: string;
}
interface ToastOption {
    type?: string;
    pinyin?: string;
    msg?: string;
    time?: number;
    hasCloseBtn?: boolean;
}

let getInstance  = function () {
    let instance : any;
    return function () {

        if (!instance) {
            instance = new Popup();
        }
        return instance;
    };
}();

let getAlertTPL = function (option? : AlertOption) {

    option = option || {};
    let type       = option.type || 'alert_normal';
    let id         = type;
    let title      = option.title || '';
    let msg        = option.msg || '系统提示';
    let okText     = option.okText || '确定';
    let cancelText = option.cancelText || '取消';
    let hideCancel = option.hideCancel ? 'none' : '';

    let alertReciteFailed = title === '未达标' ? 'failed' : '';

    let randomHTML = function (okClass, cancelClass) {
        let randomNum = Math.floor(Math.random() * 10 + 1);
        if (randomNum % 2 === 0) {
            return `<a id="${id}_ok" href="javascript:void(0)" class=${okClass}>${okText}</a>
                <a id="${id}_cancel" style="display:${hideCancel}" href="javascript:void(0);" class=${cancelClass}>${cancelText}</a>`
        } else {
            return `<a id="${id}_cancel" style="display:${hideCancel}" href="javascript:void(0);" class=${cancelClass}>${cancelText}</a>
                <a id="${id}_ok" href="javascript:void(0)" class=${okClass}>${okText}</a>`
        }
    };
    let template = {

        alert_normal: `<div class="w-layer">
                    <div class="w-layer-confirm">
                        <div class="head">${title}</div>
                        <div class="text">${msg}</div>
                        <div class="w-footer no-fixed">
                            <div class="inner">
                                <div class="btn-box">
                                    <a id="${id}_cancel" style="display:${hideCancel}" href="javascript:void(0);" class="btn light-blue">${cancelText}</a>
                                    <a id="${id}_ok" href="javascript:void(0);" class="btn">${okText}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
        alert_recite: `<div class="textRead-popup">
                            <!--达标了/未达标-->
                            <div class="inner">
                                <div class="fkIcon ${alertReciteFailed}"></div>
                                <div class="fkTxt">
                                    <p class="state">${title}</p>
                                    <p>${msg}</p>
                                </div>
                                <a href="javascript:void(0)" id="${id}_ok" class="fkBtn">${okText}</a>
                            </div>`,
        alert_recite_tip: `
                        <div class="recordTip-popup" style="display: block">
                        <div class="rtp-main">
                            <div class="closeBtn" id="${id}_cancel" ></div>
                            <div class="ld-icon05"></div>
                            <div class="text center">
                                <p class="font30">${title}</p>
                                <p class="font30">${msg}</p>
                            </div>
                            <a id="${id}_ok" href="javascript:void(0);" class="noTips-btn">${okText}</a>
                        </div>
                    </div>`,
        alert_one_more: `<div class="anResult-popup">
                            <div class="arp-title">${title}</div>
                            <div class="arp-main">${msg}</div>
                            <div class="arp-btnBox">
                                ${randomHTML('arp-btn','arp-btn')}
                            </div>
                        </div>`,
    };

    if (!template[type]) {
        console.error('该警告框类型不存在！');
    }

    return template[type] || template['alert_normal'];
};

let getRetryTPL = function (option?: RetryOption) {
    option = option || {};
    let type = option.type || 'retry_normal';
    let msg = option.msg || '访问失败，请稍后再试～';
    let okText = option.okText || '确定';
    let template = {
        retry_normal: `<div class="w-layer" style="background-color: #fff;">
                            <div class="w-layer-onroad">${msg}</div>
                            <div class="w-footer no-bg">
                                <div class="inner">
                                    <div class="btn-box">
                                        <a id="${type}_ok" href="javascript:;" class="btn tail">${okText}</a>
                                    </div>
                                </div>
                            </div>
                        </div>`,
    };

    if (!template[type]) {
        console.error('该重试类型不存在！');
    }

    return template[type] || template['retry_normal'];
};

let getMaskTPL = function (option?: MaskOption) {
    option = option || {};
    let type = option.type || 'mask_normal';
    let msg = option.msg || '请稍候';
    let template = {

        mask_normal: `
            <div class="w-layer bg-blue" style="background-color: #fff">
                <div class="w-layer-submit bg-transparent">
                    <div class="icon-round"><em class="round"></em></div>
                    <div class="text">${msg}</div>
                </div>
            </div>`,
    };

    if (!template[type]) {
        console.error('该遮罩类型不存在！');
    }

    return template[type] || template['mask_normal'];
};

let getToastTPL = function (option?: ToastOption) {
    option = option || {};
    let type = option.type || 'toast_normal';
    let id         = type;
    let pinyin = option.pinyin || '';
    let msg = option.msg || '欢迎访问17zuoye';
    let hasCloseBtn = option.hasCloseBtn ? '' : 'none';
    let template = {

        toast_normal: `<div class="w-toast">${msg}</div>`,
        toast_white_with_pinyin: `
            <div class="popupToast">
                <div class="toastInner">
                    <span id="${id}_close" style="display:${hasCloseBtn}" class="close"></span>
                    <div class="main">
                        <p class="txt">${pinyin}</p>
                        <p class="txt txtSpacing">${msg}</p>
                    </div>
                </div>
            </div>`,
    };

    if (!template[type]) {
        console.error('该toast类型不存在！');
    }

    return template[type] || template['toast_normal'];
};

let removeNodeById = function (id: string) {

    let node = document.getElementById(id);
    node && document.body.removeChild(node);
};

class Popup {

    constructor() { }

    public alert(option?: AlertOption, ok?, cancel?) {
        option = option || {};
        let isRandom = option.isRandom || false;
        let id   = option.type || 'alert_normal';
        let html = getAlertTPL(option);

        let el       = document.createElement('div');
        el.id        = id;
        el.innerHTML = html;
        document.body.appendChild(el);


        let okEle = document.getElementById(id + '_ok') as HTMLElement;
        let cancelEle = document.getElementById(id + '_cancel') as HTMLElement;

        okEle.onclick = function () {
            ok && ok();
            removeNodeById(id);
        };

        if (cancelEle) {

            cancelEle.onclick = function () {

                cancel && cancel();
                removeNodeById(id);
            };
        }
    }
    public toast(option?: ToastOption) {
        option = option || {};
        let time = option.time || 2000;
        let id   = option.type || 'toast_normal';
        let html = getToastTPL(option);

        let el       = document.createElement('div');
        el.id        = id;
        el.innerHTML = html;
        document.body.appendChild(el);

        let cancelEle = document.getElementById(id + '_close') as HTMLElement;

        if (cancelEle) {
            cancelEle.onclick = function () {
                clearTimeout(t);
                removeNodeById(id);
            };
        }
        let t = setTimeout(function () {
            removeNodeById(id);
        }, time);
    }
    public showMask(option?: MaskOption) {
        let id   = 'mask_normal';
        let html = getMaskTPL(option);

        let el       = document.createElement('div');
        el.id        = id;
        el.innerHTML = html;
        document.body.appendChild(el);

    }
    public hideMask() {
        removeNodeById('mask_normal');
    }
    public retry(option?: RetryOption, okCallback?) {
        option = option || {};
        let id   = option.type || 'retry_normal';
        let html = getRetryTPL(option);

        let el       = document.createElement('div');
        el.id        = id;
        el.innerHTML = html;
        document.body.appendChild(el);

        let okEle = document.getElementById(id + '_ok') as HTMLElement;
        okEle.onclick = function () {
            if (typeof okCallback === 'function') {
                okCallback();
            } else {
                // 默认刷新页面
                // pageQueueRefresh();
            }
            removeNodeById(id);
        };
    }
}

export default getInstance();


