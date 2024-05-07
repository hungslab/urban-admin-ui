

/**
 * 通用js方法封装处理
 */

// 封装一个钩子函数,实现懒数据加载

// hooks 封装逻辑，提供响应式数据
// 引入组件懒加载函数
// import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
// import { ref, onUnmounted } from 'vue'
// import dayjs from 'dayjs'
// // 1.自定义 数据懒加载函数
// // 参数：API函数名字
// export const useLazyData = (apiFn) => {
//     const target = ref(null)// 2.被监听的dom,表示组件的”最外层div元素“
//     const result = ref([])// 接口返回数据

//     const { stop } = useIntersectionObserver(// 监听组件是否进入可视区
//         target,
//         ([{ isIntersecting }], observerElement) => {
//             if (isIntersecting) { // 如果target对应的DOM进入可视区，就触发该回调函数
//                 stop()// 停止继续监听target对应的dom

//                 apiFn && apiFn().then(data => { // 3.调用API获取数据
//                     result.value = data.result
//                 })
//             }
//         },
//         // 配置选项，相交的比例大于0就触发
//         {
//             threshold: 0
//         }
//     )
//     // result表示接口获取的业务数据
//     // target表示被监听的DOM元素，需要在模板中被ref属性绑定
//     return { target, result }
// }

// // 2.倒计时钩子函数封装
// export const usePayTime = () => {
//     const time = ref(0)
//     const timeText = ref('')
//     const { pause, resume } = useIntervalFn(() => {
//         time.value--
//         timeText.value = dayjs.unix(time.value).format('mm分ss秒')

//         if (time.value <= 0) {
//             pause()// 暂停
//         }
//     }, 1000, false)

//     onUnmounted(() => {
//         pause()// 销毁
//     })

//     // 开启定时器--参数：倒计时时间
//     const start = (countdown) => {
//         time.value = countdown
//         timeText.value = dayjs.unix(time.value).format('mm分ss秒')
//         resume()
//     }

//     return {
//         start,
//         timeText
//     }
// }

// 日期格式化
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

// 表单重置
export function resetForm(refName) {
    if (this.$refs[refName]) {
        this.$refs[refName].resetFields();
    }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
    let search = params;
    search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
    dateRange = Array.isArray(dateRange) ? dateRange : [];
    if (typeof (propName) === 'undefined') {
        search.params['beginTime'] = dateRange[0];
        search.params['endTime'] = dateRange[1];
    } else {
        search.params['begin' + propName] = dateRange[0];
        search.params['end' + propName] = dateRange[1];
    }
    return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
    if (value === undefined) {
        return "";
    }
    var actions = [];
    Object.keys(datas).some((key) => {
        if (datas[key].value == ('' + value)) {
            actions.push(datas[key].label);
            return true;
        }
    })
    if (actions.length === 0) {
        actions.push(value);
    }
    return actions.join('');
}

// 回显数据字典（字符串、数组）
export function selectDictLabels(datas, value, separator) {
    if (value === undefined || value.length === 0) {
        return "";
    }
    if (Array.isArray(value)) {
        value = value.join(",");
    }
    var actions = [];
    var currentSeparator = undefined === separator ? "," : separator;
    var temp = value.split(currentSeparator);
    Object.keys(value.split(currentSeparator)).some((val) => {
        var match = false;
        Object.keys(datas).some((key) => {
            if (datas[key].value == ('' + temp[val])) {
                actions.push(datas[key].label + currentSeparator);
                match = true;
            }
        })
        if (!match) {
            actions.push(temp[val] + currentSeparator);
        }
    })
    return actions.join('').substring(0, actions.join('').length - 1);
}

// 字符串格式化(%s )
export function sprintf(str) {
    var args = arguments, flag = true, i = 1;
    str = str.replace(/%s/g, function () {
        var arg = args[i++];
        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

// 数据合并
export function mergeRecursive(source, target) {
    for (var p in target) {
        try {
            if (target[p].constructor == Object) {
                source[p] = mergeRecursive(source[p], target[p]);
            } else {
                source[p] = target[p];
            }
        } catch (e) {
            source[p] = target[p];
        }
    }
    return source;
};

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    var childrenListMap = {};
    var nodeIds = {};
    var tree = [];

    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }
    return tree;
}

/**
* 参数处理
* @param {*} params  参数
*/
export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}

// 验证是否为blob格式
export function blobValidate(data) {
    return data.type !== 'application/json'
}

//获取屏幕宽高
export function getClientSize() {
    let h = document.documentElement.clientHeight || document.body.clientHeight;
    let w = document.documentElement.clientWidth || document.body.clientWidth;
    return {
        width: w,
        height: h
    }
}

//获取滚动条宽度
export function getScrollWidth() {
    let noScroll, scroll, oDiv = document.createElement("DIV");
    oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
    noScroll = document.body.appendChild(oDiv).clientWidth;
    oDiv.style.overflowY = "scroll";
    scroll = oDiv.clientWidth;
    document.body.removeChild(oDiv);
    return noScroll - scroll;
}

//回到顶部
export function backToTop() {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > 0) {
        window.requestAnimationFrame(backToTop);
        window.scrollTo(0, scrollTop - (scrollTop / 5));
    }
}

//取本地储存数据
export function getLocalItem(key) {
    let value;
    try {
        value = localStorage.getItem(key);
    } catch (ex) {
        // 开发环境下提示error
        if (__DEV__) {
            console.error('localStorage.getItem报错, ', ex.message);
        }
    } finally {
        return value;
    }
}

//设置本地储存数据
export function setLocalItem(key, value) {
    try {
        // ios safari 无痕模式下，直接使用 localStorage.setItem 会报错
        localStorage.setItem(key, value);
    } catch (ex) {
        // 开发环境下提示 error
        if (__DEV__) {
            console.error('localStorage.setItem报错, ', ex.message);
        }
    }
}

//取会话储存数据
export function getSessionItem(key) {
    let value;
    try {
        value = sessionStorage.getItem(key);
    } catch (ex) {
        // 开发环境下提示error
        if (__DEV__) {
            console.error('sessionStorage.getItem报错, ', ex.message);
        }
    } finally {
        return value;
    }
}

//设置会话储存数据
export function setSessionItem(key, value) {
    try {
        // ios safari 无痕模式下，直接使用 sessionStorage.setItem 会报错
        sessionStorage.setItem(key, value);
    } catch (ex) {
        // 开发环境下提示 error
        if (__DEV__) {
            console.error('sessionStorage.setItem报错, ', ex.message);
        }
    }
}

//Unicode转中文汉字
export function decode(str) {
    str = str.replace(/(\\u)(\w{1,4})/gi, function ($0) {
        return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
    });
    str = str.replace(/(&#x)(\w{1,4});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
    });
    str = str.replace(/(&#)(\d{1,6});/gi, function ($0) {
        return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
    });

    return str;
}

//转化为00:00时间格式
export function convertTime(seconds) {
    return [
        parseInt(seconds / 60 % 60),
        parseInt(seconds % 60)
    ].join(":").replace(/\b(\d)\b/g, "0$1");
}

export function shuffle(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    return arr;
}