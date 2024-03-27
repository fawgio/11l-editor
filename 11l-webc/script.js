class Token{
	type;
	value;
	constructor(){
		this.type="";
		this.value="";
	}
}

function tokenize(str,ignorews=false){
	var char;
	var token;
	var tokens = [];
	function find(regex, i){
		for (var j = i+1; char.search(regex)==0 ; ){
				token.value += char;
				if (j < str.length)
					char = str[j];
				else 
					chat = str[j-1]
				j++;
				if (j > str.length) break;
		}
		return j-2;
	}
	for (var i = 0; i < str.length ; i++){
		char = str[i];
		token = new Token;
		token.value = char;
		if(char=="+"&&str[i+1]=='+'){
			token.type = "inc";
			i++;
		} else if(char=="-"&&str[i+1]=='-'){
			token.type = "dec";
			i++;
		} else if(char=="-"&&str[i+1]=='>'){
			token.type = "lambda";
			i++;
		} else if(char=="+"){
			token.type = "plus";
			if(str[++i]=="=")  token.type = "plassign";
			else i--;
	    } else if(char=="-"){
			token.type = "minus";
			if(str[++i]=="=")  token.type = "minassign";
			else i--;
		} else if(char=="="){
			token.type = "assign";
			if(str[++i]=="=")  token.type = "equals";
			else i--;
		} else if(char=="*"){
			token.type = "mul";
			if(str[++i]=="=")  token.type = "mulassign";
			else i--;
		} else if(char=="/"&&str[i+1]!='/'){
			token.type = "div";
			if(str[++i]=="=")  token.type = "divassign"
			else i--;
		} else if(char=="I"&&str[i+1]=='/'){
			token.type = "intdiv";
			i++;
			if(str[++i]=="=")  token.type = "intdivassign"
			else i--;
		} else if(char=="["&&str[i+1]=='|'&&str[i+2]==']'){
			token.type = "bitor";
			i+=2;
			if(str[++i]=="=")  token.type = "bitorassign"
			else i--;
		} else if(char=="["&&str[i+1]=='&'&&str[i+2]==']'){
			token.type = "bitand";
			i+=2;
			if(str[++i]=="=")  token.type = "bitandassign"
			else i--;
		} else if(char=="["&&str[i+1]=='+'&&str[i+2]==']'){
			token.type = "concat";
			i+=2;
			if(str[++i]=="=")  token.type = "concatassign"
			else i--;
		} else if(char=="("&&str[i+1]=='+'&&str[i+2]==')'){
			token.type = "bitxor";
			i+=2;
			if(str[++i]=="=")  token.type = "bitxorassign"
			else i--;
		} else if(char=="‘"&&str[i+1]=='’'&&str[i+2]=='='){
			token.type = "strconcatassign";
			i+=2;
		} else if(char=="."&&str[i+1]=='.'){
			token.type = "range_1";
			i++;
		} else if(char=="."&&str[i+1]=='<'){
			token.type = "range_2";
			i++;
		} else if(char=="<"&&str[i+1]=='.'){
			token.type = "range_3";
			i++;
		} else if(char=="<"&&str[i+1]=='<'){
			token.type = "lshift";
			i++;
			if(str[++i]=="=")  token.type = "lshiftassign"
			else i--;
		} else if(char==">"&&str[i+1]=='>'){
			token.type = "rshift";
			i++;
			if(str[++i]=="=")  token.type = "rshiftassign"
			else i--;
		} else if(char==" "){
			token.type = "space";
			if (ignorews) {continue;}
		} else if(char=="\t"){
			token.type = "tab";
			if (ignorews) {continue;}
		} else if(char=="("){
			token.type = "opar";
		} else if(char==")"){
			token.type = "cpar";
		} else if(char=="'"){
			token.type = "ap";			
		} else if(char=="{"){
			token.type = "obra";			
		} else if(char=="}"){
			token.type = "cbra";			
		} else if(char=="["){
			token.type = "osqr";
		} else if(char=="]"){
			token.type = "csqr";			
		} else if(char=="."){
			token.type = "dot";
		} else if(char==","){
			token.type = "comma";
		} else if(char=="\n"){
			token.type = "break";			
		} else if(char=="!"&&str[i+1]=='='){
			token.type = "noteq";
			i++;
		} else if(char=="!"){
			token.type = "not";
		} else if(char=="~"){
			token.type = "bitnot";
		} else if(char==":"){
			token.type = "colon";
		} else if(char=="|"){
			token.type = "or";
		} else if(char=="&"){
			token.type = "and";
		} else if(char=="%"){
			token.type = "mod";
			if(str[++i]=="=")  token.type = "modassign"
			else i--;
		} else if(char=="<"){
			token.type = "lt";
		} else if(char==">"){
			token.type = "gt";
		} else if(char=="<"&&str[i+1]=='='){
			token.type = "leq";
			i++;
		} else if(char==">"&&str[i+1]=='='){
			token.type = "geq";
			i++;
		} else if(char=="^"){
			token.type = "pow";
			if(str[++i]=="=")  token.type = "powassign"
			else i--;
		}else if(char.search(/[a-zA-Z]/)==0){
			find(/[a-zA-Z0-9_']/,i);
			if(!token.value.includes("'")||token.value.endsWith("'")){
			token.type = "keyword";
			char = str[i];
			token.value = "";
			i = find(/[a-zA-Z0-9_]/,i);
			if(token.value.search(/(?:C|E|else|exception|F|fn|I|if|in|L|loop|N|null|R|return|S|switch|T|V|var|X)$/)==0){
			char = str[++i]
			if(char == '.'){
			i = find(/[a-z._]/,i);
			switch(token.value){
				case 'X':
				case 'exception':
					if(token.value.search(/(?:X|exception)\.(?:try|catch|try_end)/)==-1)
						token.type = '';
					break;
				case 'F':
				case 'fn':
					if(token.value.search(/(?:F|fn)\.(?:args|destructor|(?:virtual|virtual\.(?:override|new|final|abstract|assign)))/)==-1)
						token.type = '';
					break;
				case 'I':
				case 'if':
					if(token.value.search(/(?:I|if)\.(?:unlikely|likely)/)==-1)
						token.type = '';
					break;
				case 'L':
				case 'loop':
					if(token.value.search(/(?:L|loop)\.(?:continue|break|remove_current_element_and_continue|remove_current_element_and_break|on_continue|on_break|was_no_break|index|last_iteration|next|prev)/)==-1)
						token.type = '';
					break;
				case 'S':
				case 'switch':
					if(token.value.search(/(?:L|loop)\.(?:break|fallthrough)/)==-1)
						token.type = '';
					break;
				case 'T':
				case 'type':
					if(token.value.search(/(?:L|loop)\.(?:break|fallthrough)/)==-1)
						token.type = '';
					break;
			}
			} else {
				i--;
			}
			} else {
				token.type='id';
			}
			}
		} else if((char.search(/[A-F0-9]/)==0)&&!( str[i+1]=="B")){
			token.type = "digit";
			token.value = "";
			i = find(/[A-F0-9']/,i);
			char = str[++i];
			switch(char){
				case 'b': token.value+='b'; break;
				case 'o': token.value+='o'; break;
				default: i--; break;
			}
		} else if((char.search(/[0-1]/)==0)&&(str[i+1]=="B")){
			token.type = "bool";
			token.value = char;
			i++;
		} else if(char == '"'){
			token.type = "string";
			token.value = char;
			char = str[++i]
			for (var j = i; (j < str.length) && (char!='"') ; ){
				if((char == "\\")&&(j+1 < str.length)){
					if (str[j+1] == "\"") char = "\\\"";
					j++
				}
				token.value += char;
				j++
				char = str[j];
			}
			if(char=="\"")token.value+="\"";
			i = j;
		} else if(char == "‘"){
			token.type = "string";
			token.value = "";
			i = find(/[^’]/,i);
			if(str[++i]=='’')
				token.value += char;
		} else if((char == "/"&&str[i+1]=='/')||(char == "\\"&&str[i+1]=='\\')){
			token.type = "single-line comment";
			token.value = "";
			i = find(/[^\n]/,i);
		} else if(char == "\\"&&['{','(','[','‘'].indexOf(str[i+1])!=-1){
			token.type = "multi-line comment";
			token.value = char;
			cStart = str[i+1];
			cTerminate = String.fromCharCode(cStart.codePointAt()+1);
			var nestingLevel = -1;
			for (var j = i+1; j < str.length; j++){
				char = str[j];
				if(char==cStart)
					nestingLevel++;
				else if(char==cTerminate)
					nestingLevel--;
				token.value += char;
				if (!(nestingLevel >= 0)) break;
			}
			i = j;
		}
		tokens = tokens.concat([token]);
	}
	return tokens;
}

function highlight(tokens,theme){
	var sHl = "";
	tokens.forEach((token)=>{
		if(token.type == "keyword"){
			sHl+="<span class=key_word_"+theme+">"+token.value+"</span>";
		} else if(token.type == "digit"){
			sHl+="<span class=digit_"+theme+">"+token.value+"</span>";
		} else if(token.type == "bool"){
			sHl+="<span class=key_word_"+theme+">"+token.value+"</span>";
		} else if(token.type == "string"){
			sHl+="<span class=string_"+theme+">"+token.value+"</span>";
		} else if((token.type == "single-line comment")||(token.type == "multi-line comment")){
			sHl+="<span class=comment_"+theme+">"+token.value+"</span>";
		} else if (token.type == "id"){
			sHl+=token.value;
		} else {
			sHl+="<span class=operator_"+theme+">";
		if(token.type == "inc"){
			sHl+="++";
		} else if(token.type == "dec"){
			sHl+="--";
		} else if(token.type == "lambda"){
			sHl+="->"
		} else if(token.type == "plusassign"){
			sHl+="+="
		} else if(token.type == "minusassign"){
			sHl+="-="
		} else if(token.type == "equals"){
			sHl+="=="
		} else if(token.type == "mulassign"){
			sHl+="*="
		} else if(token.type == "divassign"){
			sHl+="/="
		} else if(token.type == "intdiv"){
			sHl+="I/"
		} else if(token.type == "intdivassign"){
			sHl+="I/="
		} else if(token.type == "bitor"){
			sHl+="[|]"
		} else if(token.type == "bitorassign"){
			sHl+="[|]="
		} else if(token.type == "bitand"){
			sHl+="[&]"
		} else if(token.type == "bitandassign"){
			sHl+="[&]="
		} else if(token.type == "concat"){
			sHl+="[+]"
		} else if(token.type == "concatassign"){
			sHl+="[+]="
		} else if(token.type == "bitxor"){
			sHl+="(+)="
		} else if(token.type == "bitxorassign"){
			sHl+="(+)="
		} else if(token.type == "strconcatassign"){
			sHl+="‘’="
		} else if(token.type == "range_1"){
			sHl+=".."
		} else if(token.type == "range_2"){
			sHl+=".<"
		} else if(token.type == "range_3"){
			sHl+="<."
		} else if(token.type == "lshift"){
			sHl+="<<"
		} else if(token.type == "lshiftassign"){
			sHl+="<<="
		} else if(token.type == "rshiftassign"){
			sHl+=">>="
		} else if(token.type == "noteq"){
			sHl+="!="
		} else if(token.type == "modassign"){
			sHl+="%="
		} else if(token.type == "powassign"){
			sHl+="^="
		} else if(token.type == "break"){
			sHl+="<br>"
		} else
			sHl+=token.value;
			sHl+="</span>";
		}
	});
	return sHl;
}


class Node{
	type;
	value;
	children;
	constructor(){
		this.type="";
		this.value="";
		this.children=[];
	}
}
class ParserError{
	message;
	constructor(message){
		this.message=message;
	}
}

var i = -1;
var	tabc = 0;
var tokens;

function term(){
	var node = new Node();
	switch(tokens[i+1].type){
		case "id": 
			i++;
			node.type = "id"
			node.value = tokens[i].value
			if(tokens[i+1].type=="opar"){
				i++;
			  	node.type = "fcall"
			  	while(tokens[i+1].type!="cpar"){
			  		node.children = node.children.concat([expr()])
			  		if(tokens[i+1].type=="comma"){
			  			i++;
			  		}
			  	}
				i++;
			}
			break;
		case "digit": 
			i++;
			node.type = "digit"
			node.value = tokens[i].value
			break;
	}
	return node;
}

function expr(){
	var node = term()
	switch(tokens[i+1].value){
		case"+": 
			i++;
			node.children = node.children.concat([structuredClone(node)]);
			node.children = node.children.concat([expr()]);
			node.type = "add"
			break;
		case"-":
			i++;
			node.children = node.children.concat([structuredClone(node)]);
			node.children = node.children.concat([expr()]);
			node.type = "sub"
			break;
	}
	return node;
}

function parse(tokens_1) {
	var main = new Node();
	i=-1;
	tabc=0;
	tokens = tokens_1.concat(new Token()); // EOF Token
	main.type = "main";
	main.children = main.children.concat([expr()]);
	return main;
}

var compiled = [];

function compile(node){
	switch(node.type){
		case "main":
			compiled = []; 
			node.children.forEach(function(e){compile(e)})
			compiled.push("EXIT");
			break;
		case "add":
			node.children.forEach(function(e){compile(e)})
			compiled.push("ADD");
			break;
		case "sub":
			node.children.forEach(function(e){compile(e)})
			compiled.push("SUB");
			break;
		case "digit":
			compiled.push("PUSH");
			compiled.push(parseInt(node.value))
			break;
		case "fcall":
			node.children.forEach(function(e){compile(e)})
			compiled.push("CALL")
			compiled.push(node.value);
			break;
	}
}

function run(){
	commands = compiled;
	var n = 0;
	var stack = [];
	while(commands[n]!="EXIT"){
		switch(commands[n]){
			case "PUSH":
				stack.push(commands[n+1])
				n+=2;
				break;
			case "POP":
				stack.pop()
				n+=1;
				break;
			case "ADD":
				stack.push(stack.pop()+stack.pop())
				n+=1;
				break;
			case "SUB":
				stack.push(stack.pop()-stack.pop())
				n+=1;
				break;
			case "CALL":
				switch(commands[n+1]){
					case "print":
						alert("11l says: "+stack.pop())
						break;
					case "input":
						stack.push(prompt("11l asks:"))
						break;
				}
				n+=2;
				break;
		}
	}
}
