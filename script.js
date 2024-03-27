const textarea = document.getElementById('textarea');
const textDiv = document.getElementById('text');
const loadbutton = document.getElementById('loadbutton');
const savebutton = document.getElementById('savebutton');
const changetheme = document.getElementById('changetheme');
const runbutton = document.getElementById('runbutton');
const autoul = document.getElementById('autocomplete');
var theme = "light"

const modules = ['f','os','fs','time','re','random','minheap','maxheap','bits','csv'];
const keyLetters = ['C','E','F','I','L','N','R','S','T','V','X'];
const keyWords = ['in','else','fn','if','loop','null','return','switch','type','var','exception',
                    'exception.catch','exception.try','exception.try_end','F.args','F.destructor','F.virtual','fn.args','fn.destructor','fn.virtual','fn.virtual.abstract','fn.virtual.assign','fn.virtual.final','fn.virtual.new','fn.virtual.override','I.likely','I.unlikely','if.likely','if.unlikely','L.break','L.continue','L.index','L.last_iteration','L.next','L.on_break','L.on_continue','L.prev','L.remove_current_element_and_break','L.remove_current_element_and_continue','L.was_no_break','loop.break','loop.continue','loop.index','loop.last_iteration','loop.next','loop.on_break','loop.on_continue','loop.prev','loop.remove_current_element_and_break','loop.remove_current_element_and_continue','loop.was_no_break','S.break','S.fallthrough','switch.break','switch.fallthrough','T.base','T.enum','T.interface','type','type.base','type.enum','type.interface','X.catch','X.try','X.try_end',
                    'F.virtual.abstract','F.virtual.assign','F.virtual.final','F.virtual.new','F.virtual.override'].concat(keyLetters);
const functions = ['print(object = ‘’, end = "\\n")','input([prompt])','assert(expression, message = ‘’)','exit(message=N)',
                    'sleep(secs)','swap(&a, &b)','zip(iterable1, iterable2 [,iterable3])','all(iterable)','any(iterable)',
                    'cart_product(iterable1, iterable2 [,iterable3])','multiloop((iterable1, iterable2 [,iterable3], function))',
                    'multiloop_filtered(iterable1, iterable2 [,iterable3], filter_function, function)','sum(iterable)',
                    'sorted(iterable, key = N, reverse = 0B)','product(iterable)','min(iterable)','min(arg1,arg2)','max(iterable)','max(arg1,arg2)',
                    'hex(x)','bin(x)','rotl(value, shift)','rotr(value, shift)'];
const auto = keyWords.concat(functions).concat(modules);

const highlighter = function (input, output, theme) {
    output.classList.remove(output.classList[1])
    output.classList.add("text_"+theme)
    output.innerHTML = input.value;

    var text = highlight(tokenize(input.value),theme);
  
    if(text.endsWith("<br>")||text.endsWith("\n")){ //see issue #3 https://github.com/fawgio/11l-editor/issues/3
        text+="<br>";
    }

    output.innerHTML = text;
};

const adaptive = function () {
    textDiv.style.width = (textarea.offsetWidth - textarea.offsetWidth + textarea.clientWidth ) + "px";
    textDiv.style.height = (textarea.offsetHeight - textarea.offsetHeight + textarea.clientHeight - 3) + "px";
    highlighter(textarea, textDiv, theme);
    autoul.innerHTML = ''
    autoul.classList.remove('hasli')
};

textarea.addEventListener("input", () => {
    adaptive();
});

var ctrl_click
var alt_click
var F1_click
function count(text,e){
    var arr = text.split('');
    return arr.filter((elem)=>{return elem==e}).length;
}

textarea.addEventListener('keydown',(e) => {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    if (e.key == 'Tab') {
        e.preventDefault();
        textarea.value = textarea.value.substring(0, start) +
            "\t" + textarea.value.substring(end);
        textarea.selectionStart =
            textarea.selectionEnd = start + 1;
        adaptive();
    } else if (e.key == 'Control'){
        ctrl_click = true;
    } else if (e.key == 'Alt'){
        alt_click = true;
    } else if (e.key == 'F1'){
        F1_click = true;
    }  else if ((e.code == 'Space')&&ctrl_click){
        e.preventDefault();
        var temp = textarea.value.substring(0, start).replace(/(.*[\n\r\s])*([^\n\r\s]*)$/, '$2');
        var nauto = auto.filter((elem)=>{return elem.startsWith(temp)});
        nauto.forEach((elem)=>{
            var li = document.createElement('li');
            if(modules.indexOf(elem)!=-1){
                li.textContent = "module\t"
            } else if(functions.indexOf(elem)!=-1){
                li.textContent = "fn\t"
            }
            li.textContent += elem;
            li.addEventListener("click",(e2)=>{
                var pastevalue = li.textContent.replaceAll(/(?<=\().*(?=\))|fn\t|module|\t/g,'');
                textarea.value = textarea.value.substring(0, start - temp.length) +
                    pastevalue + textarea.value.substring(end);
                textarea.selectionStart =
                    textarea.selectionEnd = start + pastevalue.length-temp.length;
                if(li.textContent.startsWith("fn\t")){ //print(*cursor here*)
                    textarea.selectionStart--;
                    textarea.selectionEnd--;
                }
                adaptive();
            })
            autoul.appendChild(li);
        });
        autoul.classList.add("hasli");
        autoul.style.left = textarea.value.substring(0, start).replace(/(.*[\n\r])*([^\n\r]*)$/, '$2').length*7+5+"px"
        autoul.style.top = ((count(textarea.value.substring(0, start),"\n"))*14+2)+"px"
    } else if (((e.key=="ArrowDown")||(e.key=="ArrowUp"))&&autoul.children.length!=0){
        e.preventDefault();
        var cur_sel = autoul.getElementsByClassName('selected');
        var next;
        var n = Array.prototype.indexOf.call(autoul.children, cur_sel[0])
        if (e.key=="ArrowDown") {
            next = autoul.children[n+1];
        } else {
            next = autoul.children[n-1];
        }
        if(cur_sel.length!=0)
            cur_sel[0].classList.remove("selected")
        next.classList.add("selected")
    } else if ((e.key=="Enter")&&autoul.children.length!=0){
        e.preventDefault();
        var cur_sel = autoul.getElementsByClassName('selected')[0];
        var curselvalue = cur_sel.textContent.replaceAll(/fn\t|module|\t/g,'');
        if(F1_click){
            var href = "http://11l-lang.org/doc/";
            if(modules.indexOf(curselvalue)!=-1){
                if((curselvalue=="maxheap")||(curselvalue=="minheap"))
                    href += "built-in-modules/minmaxheap/";
                else
                    href += "built-in-modules/"+curselvalue+"/";
            } else if(functions.indexOf(curselvalue)!=-1)
                href += "built-in-functions/"
              else if(keyWords.indexOf(curselvalue)!=-1){
                keyWord = curselvalue.replaceAll(/([^.]*)\..*/g,'$1');
                var indx;
                if((indx = keyWords.indexOf(keyWord))<=11&&(indx!=-1))
                    href += keyLetters[indx]
                else
                    href += keyWord
            }
            window.open(href,"_blank");
        } else {
            cur_sel.click();
        }
    } else if ((e.code=="KeyS")&&ctrl_click){
        e.preventDefault();
        savebutton.click();
    } else if ((e.code == 'Digit9')&&alt_click) {
        e.preventDefault();
        textarea.value = textarea.value.substring(0, start) +
            "‘" + textarea.value.substring(end);
        textarea.selectionStart =
            textarea.selectionEnd = start + 1;
        adaptive();
    } else if ((e.code == 'Digit0')&&alt_click) {
        e.preventDefault();
        textarea.value = textarea.value.substring(0, start) +
            "’" + textarea.value.substring(end);
        textarea.selectionStart =
            textarea.selectionEnd = start + 1;
        adaptive();
    }
});

textarea.addEventListener('keyup', (e) => {
    if (e.key == 'Control'){
        ctrl_click = false
    } if (e.key == 'Alt'){
        alt_click = false
    } else if (e.key == 'F1'){
        F1_click = false
    }
});


changetheme.addEventListener("click", () => {
    if (theme == "dark")
        theme = "light";
    else
        theme = "dark";
    highlighter(textarea, textDiv, theme);
});

savebutton.addEventListener("click", () => {
    const file = new Blob([textarea.value]);
    console.log(file);
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(file));
    link.setAttribute('download', prompt('Enter name')+'.11l');
    link.click();
    URL.revokeObjectURL(file);
});

runbutton.addEventListener("click",()=>{
    compile(parse(tokenize(textarea.value,true)));
    run();
})

textarea.addEventListener('scroll', (e) => {
    textDiv.scrollTop = textarea.scrollTop
});

loadbutton.addEventListener("change", () => {
    const file = loadbutton.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      textarea.value = reader.result;
      adaptive()
    };
    reader.onerror = function () {
      console.error('Error reading the file:', reader.error);
    };
    reader.readAsText(file);
});

window.onload = adaptive;
window.onresize = adaptive;
