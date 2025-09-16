/**
 * @file This script handles all the interactive logic for the Compiler Lab Helper application.
 * It manages tabbed navigation, dynamically renders problem content, and integrates
 * with the Gemini API to provide AI-powered code explanations and grammar conversions.
 */

// --- 1. CONSTANTS & DOM ELEMENTS ---

// IMPORTANT: Add your Gemini API Key here for the application to work when hosted.
// Get a free key from Google AI Studio: https://aistudio.google.com/app/apikey
const API_KEY = "AIzaSyATJYlOIRBIY5VltCmoU-Sz3-bL_Ez7RXI"; 

// Main UI elements that we will interact with.
const mainNav = document.querySelector('nav');
const contentSections = document.querySelectorAll('.content-section');
const problemNav = document.getElementById('problem-nav');
const problemContent = document.getElementById('problem-content');

// --- 2. APPLICATION DATA ---

/**
 * An object containing all the data for the Cycle II problems.
 * Each key is a problem number, and the value is an object with
 * the title, explanation, and solution HTML content.
 */
const problemData = {
    '1': {
        title: 'Design and implement a lexical analyzer for given language using C and the lexical analyzer should ignore redundant spaces, tabs and newlines.',
        explanation: `This problem asks you to build a lexical analyzer from scratch in C. The core idea is to read a file character by character and identify tokens based on predefined rules. You need to handle keywords, identifiers, operators, and constants, while explicitly skipping whitespace. This is what Lex does automatically, but here you implement the logic yourself to understand the process.`,
        solution: `
<div class="code-wrapper">
    <h4 class="text-xl font-bold mt-6 mb-2">lex_analyzer.c</h4>
    <div class="code-block" data-code-id="1-c">
<pre>#include &lt;stdio.h&gt;
#include &lt;string.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;ctype.h&gt;

int isKeyword(char buffer[]){
    char keywords[32][10] = {"auto","break","case","char","const","continue","default",
                            "do","double","else","enum","extern","float","for","goto",
                            "if","int","long","register","return","short","signed",
                            "sizeof","static","struct","switch","typedef","union",
                            "unsigned","void","volatile","while"};
    int i, flag = 0;
    for(i = 0; i < 32; ++i){
        if(strcmp(keywords[i], buffer) == 0){
            flag = 1;
            break;
        }
    }
    return flag;
}
 
int main(){
    char ch, buffer[15], operators[] = "+-*/%=";
    FILE *fp;
    int i,j=0;
    fp = fopen("input.txt","r");
    if(fp == NULL){
        printf("error while opening the file\\n");
        exit(0);
    }
    printf("Create an 'input.txt' file with some C code in it.\\n\\n");

    while((ch = fgetc(fp)) != EOF){
        for(i = 0; i < 6; ++i){
            if(ch == operators[i])
                printf("%c is operator\\n", ch);
        }
        
        if(isalnum(ch)){
            buffer[j++] = ch;
        }
        else if((ch == ' ' || ch == '\\n' || ch == '\\t') && (j != 0)){
            buffer[j] = '\\0';
            j = 0;
            if(isKeyword(buffer) == 1)
                printf("%s is keyword\\n", buffer);
            else
                printf("%s is identifier\\n", buffer);
        }
    }
    fclose(fp);
    return 0;
}</pre>
    </div>
    <div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="1-c">✨ Explain This Code</button></div>
    <div class="explanation-container mt-4 hidden"></div>
</div>`
    },
    '2': {
        title: 'Write a lex program to recognize all strings which does not contain first four characters of your name as a substring.',
        explanation: `Let's assume the first four characters of your name are "ANNA". The goal is to accept any string unless it contains "ANNA". The strategy in Lex is to define a pattern for the unwanted substring and print a message for it. Then, a more general pattern ('.*' or separate patterns for characters and newlines) will match everything else, which we can consider "accepted".`,
        solution: `
<div class="code-wrapper">
<h4 class="text-xl font-bold mt-6 mb-2">no_substring.l</h4>
<div class="code-block" data-code-id="2-l"><pre>%{
#include &lt;stdio.h&gt;
%}

%%
.*ANNA.* { printf("String contains 'ANNA', rejected.\\n"); }
.*\\n      { printf("String accepted.\\n"); }
.          { /* Absorb other characters */ }
%%

int main() {
    printf("Enter strings. Strings with 'ANNA' will be rejected.\\n");
    yylex();
    return 0;
}

int yywrap() {
    return 1;
}</pre></div>
<div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="2-l">✨ Explain This Code</button></div>
<div class="explanation-container mt-4 hidden"></div>
</div>
<h4 class="text-xl font-bold mt-6 mb-2">How to Compile and Run:</h4>
<div class="code-block"><pre>lex no_substring.l
cc lex.yy.c -o no_substring
./no_substring</pre></div>`
    },
    '3': {
        title: 'Write a YACC program to recognize a valid variable which starts with a letter followed by any number of letters or digits.',
        explanation: `This task requires both Lex and YACC. Lex will identify potential identifiers using a regular expression. YACC will define the grammar, which in this case is extremely simple: a program is just a valid identifier.`,
        solution: `
<div class="code-wrapper">
<h4 class="text-xl font-bold mt-6 mb-2">var_checker.l (Lex File)</h4>
<div class="code-block" data-code-id="3-l"><pre>%{
#include "y.tab.h" // Generated by YACC
%}
%%
[a-zA-Z][a-zA-Z0-9]* { return VALID_VAR; }
.                      { return yytext[0]; }
\\n                    { return 0; /* End of input */ }
%%
int yywrap() { return 1; }</pre></div>
<div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="3-l">✨ Explain Lex File</button></div>
<div class="explanation-container mt-4 hidden"></div>
</div>

<div class="code-wrapper mt-6">
<h4 class="text-xl font-bold mt-6 mb-2">var_checker.y (YACC File)</h4>
<div class="code-block" data-code-id="3-y"><pre>%{
#include &lt;stdio.h&gt;
int yylex();
void yyerror(char const *s);
%}

%token VALID_VAR

%%
program:
    VALID_VAR { printf("Valid Variable.\\n"); }
    ;
%%

int main() {
    printf("Enter a variable name to check:\\n");
    yyparse();
    return 0;
}

void yyerror(char const *s) {
    printf("Invalid Variable.\\n");
}</pre></div>
<div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="3-y">✨ Explain YACC File</button></div>
<div class="explanation-container mt-4 hidden"></div>
</div>
<h4 class="text-xl font-bold mt-6 mb-2">How to Compile and Run:</h4>
<div class="code-block"><pre>yacc -d var_checker.y
lex var_checker.l
cc y.tab.c lex.yy.c -o var_checker
./var_checker</pre></div>`
    },
    '4': {
        title: 'Implementation of Calculator using LEX and YACC.',
        explanation: `This is a classic Lex/YACC exercise. Lex is responsible for tokenizing the input into numbers, operators (+, -, *, /), and parentheses. YACC is responsible for parsing these tokens according to the rules of arithmetic precedence and associativity, and then performing the calculation.`,
        solution: `
<div class="code-wrapper">
<h4 class="text-xl font-bold mt-6 mb-2">calculator.l (Lex File)</h4>
<div class="code-block" data-code-id="4-l"><pre>%{
#include "y.tab.h"
extern int yylval;
%}
%%
[0-9]+      { yylval = atoi(yytext); return NUMBER; }
[\\t ]+     ; /* ignore whitespace */
\\n         return 0;
.           return yytext[0];
%%
int yywrap() { return 1; }</pre></div>
<div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="4-l">✨ Explain Lex File</button></div>
<div class="explanation-container mt-4 hidden"></div>
</div>
<div class="code-wrapper mt-6">
<h4 class="text-xl font-bold mt-6 mb-2">calculator.y (YACC File)</h4>
<div class="code-block" data-code-id="4-y"><pre>%{
#include &lt;stdio.h&gt;
int yylex();
void yyerror(char *s);
%}

%token NUMBER
%left '+' '-'
%left '*' '/'

%%
program:
    program expression '\\n' { printf("= %d\\n", $2); }
    | /* empty */
    ;

expression:
    NUMBER          { $$ = $1; }
    | expression '+' expression { $$ = $1 + $3; }
    | expression '-' expression { $$ = $1 - $3; }
    | expression '*' expression { $$ = $1 * $3; }
    | expression '/' expression { $$ = $1 / $3; }
    | '(' expression ')'      { $$ = $2; }
    ;
%%
void yyerror(char *s) {
    fprintf(stderr, "Error: %s\\n", s);
}
int main() {
    printf("Enter expressions:\\n");
    yyparse();
    return 0;
}</pre></div>
<div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="4-y">✨ Explain YACC File</button></div>
<div class="explanation-container mt-4 hidden"></div>
</div>
<h4 class="text-xl font-bold mt-6 mb-2">How to Compile and Run:</h4>
<div class="code-block"><pre>yacc -d calculator.y
lex calculator.l
cc y.tab.c lex.yy.c -o calculator
./calculator</pre></div>`
    },
    '5': {
        title: 'Convert the BNF rules into YACC form and write code to generate abstract syntax tree.',
        explanation: `This is a more theoretical problem. The first code block shows the YACC grammar for a sample BNF and the C code for building the AST nodes. Below that, try our new interactive tool to convert your own BNF grammar to YACC format!`,
        solution: `
<div class="code-wrapper">
<h4 class="text-xl font-bold mt-6 mb-2">ast.y (YACC File with AST logic)</h4>
<div class="code-block" data-code-id="5-y"><pre>%{
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

// Node structure for AST
typedef struct Node {
    char* token;
    struct Node *left, *right;
} Node;

Node* createNode(char* token, Node* left, Node* right);
void printAST(Node* node, int level);

#define YYSTYPE struct Node*
%}

%token ID
%left '+'
%left '*'

%%
E: E '+' T { $$ = createNode("+", $1, $3); }
 | T       { $$ = $1; }
 ;
T: T '*' F { $$ = createNode("*", $1, $3); }
 | F       { $$ = $1; }
 ;
F: '(' E ')' { $$ = $2; }
 | ID        { $$ = createNode("ID", NULL, NULL); }
 ;
%%

Node* createNode(char* token, Node* left, Node* right) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->token = token;
    newNode->left = left;
    newNode->right = right;
    return newNode;
}

void printAST(Node* node, int level) {
    if (node == NULL) return;
    for (int i = 0; i < level; i++) printf("  ");
    printf("%s\\n", node->token);
    printAST(node->left, level + 1);
    printAST(node->right, level + 1);
}

int yylex() { /* A simple lexer would return ID or operators */ return ID; }
void yyerror(char *s) { fprintf(stderr, "Error: %s\\n", s); }

int main() {
    printf("Parsing will generate an AST internally.\\n");
    yyparse();
    return 0;
}</pre></div>
<div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="5-y">✨ Explain This Code</button></div>
<div class="explanation-container mt-4 hidden"></div>
</div>

<div id="bnf-converter" class="mt-8 p-6 border-t-2 border-gray-200">
    <h3 class="text-2xl font-bold text-gray-800 mb-4">✨ Interactive BNF to YACC Converter</h3>
    <p class="mb-4">Enter your BNF grammar below. The tool will convert it to YACC format.</p>
    <textarea id="bnf-input" class="w-full h-32 p-2 border border-gray-300 rounded-md font-mono" placeholder="E -> E + T | T\nT -> T * F | F\nF -> ( E ) | id"></textarea>
    <button class="gemini-btn mt-4" data-action="convert-bnf">Convert to YACC</button>
    <div id="yacc-output-container" class="mt-4 hidden">
        <h4 class="text-xl font-bold mb-2">Generated YACC Rules:</h4>
        <div class="code-block"><pre id="yacc-output"></pre></div>
    </div>
</div>`
    },
    '6': {
        title: 'Write a YACC program to check the syntax of FOR statement in C.',
        explanation: `To check a 'for' loop, we need to define a grammar that matches its structure: 'for' keyword, opening parenthesis, three optional expressions separated by semicolons, a closing parenthesis, and a statement (which can be a single statement with a semicolon or a block in curly braces). Lex will provide the tokens for keywords, identifiers, symbols etc.`,
        solution: `
<div class="code-wrapper">
<h4 class="text-xl font-bold mt-6 mb-2">for_checker.l (Lex File)</h4>
<div class="code-block" data-code-id="6-l"><pre>%{
#include "y.tab.h"
%}
%%
"for"       { return FOR; }
[a-zA-Z]+   { return ID; }
[0-9]+      { return NUM; }
";"         { return SEMI; }
"("         { return OPAREN; }
")"         { return CPAREN; }
"{"         { return OBRACE; }
"}"         { return CBRACE; }
"="         { return ASSIGN; }
"&lt;"|"&gt;"   { return RELOP; }
"+"|"-"     { return ADDOP; }
.           ; /* ignore everything else */
\\n         ;
%%
int yywrap() { return 1; }</pre></div>
<div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="6-l">✨ Explain Lex File</button></div>
<div class="explanation-container mt-4 hidden"></div>
</div>
<div class="code-wrapper mt-6">
<h4 class="text-xl font-bold mt-6 mb-2">for_checker.y (YACC File)</h4>
<div class="code-block" data-code-id="6-y"><pre>%{
#include &lt;stdio.h&gt;
int yylex();
void yyerror(char const *s);
%}

%token FOR ID NUM SEMI OPAREN CPAREN OBRACE CBRACE ASSIGN RELOP ADDOP

%%
program:
    for_statement { printf("Valid 'for' loop syntax.\\n"); }
    ;

for_statement:
    FOR OPAREN opt_expr SEMI opt_expr SEMI opt_expr CPAREN statement
    ;

opt_expr:
    /* empty */
    | expression
    ;

expression:
    ID
    | NUM
    | ID ASSIGN expression
    | expression RELOP expression
    | expression ADDOP expression
    ;

statement:
    expression SEMI
    | OBRACE CBRACE
    ;
%%

int main() {
    printf("Enter a 'for' loop statement to check:\\n");
    yyparse();
    return 0;
}

void yyerror(char const *s) {
    printf("Invalid 'for' loop syntax.\\n");
}</pre></div>
<div class="mt-4"><button class="gemini-btn" data-action="explain-code" data-code-target-id="6-y">✨ Explain YACC File</button></div>
<div class="explanation-container mt-4 hidden"></div>
</div>
<h4 class="text-xl font-bold mt-6 mb-2">How to Compile and Run:</h4>
<div class="code-block"><pre>yacc -d for_checker.y
lex for_checker.l
cc y.tab.c lex.yy.c -o for_checker
./for_checker</pre></div>`
    },
};

// --- 3. API COMMUNICATION ---

/**
 * Calls the Gemini API to get a response for a given prompt.
 * @param {string} prompt The prompt to send to the Gemini model.
 * @returns {Promise<string>} A promise that resolves to the model's text response.
 */
async function callGemini(prompt) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}. Make sure you have entered a valid API Key.`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];
        return candidate?.content?.parts?.[0]?.text || "Sorry, the response format was unexpected.";
    } catch (error) {
        console.error("Gemini API call error:", error);
        return `An error occurred: ${error.message}. Please check the console.`;
    }
}

// --- 4. UI MANIPULATION ---

/**
 * Shows the selected content section and highlights the active navigation tab.
 * @param {string} targetId The ID of the content section to display (e.g., 'intro', 'lex').
 */
function setActiveTab(targetId) {
    contentSections.forEach(section => {
        section.classList.toggle('active', section.id === targetId);
    });

    mainNav.querySelectorAll('.nav-button').forEach(button => {
        button.classList.toggle('active', button.dataset.target === targetId);
    });
}

/**
 * Renders the content for a specific problem in the main content area.
 * @param {string} problemId The number of the problem to display.
 */
function renderProblem(problemId) {
    const data = problemData[problemId];
    if (data) {
        problemContent.innerHTML = `
            <h3 class="text-2xl font-bold mb-4 text-gray-800">${data.title}</h3>
            <p class="text-lg mb-6">${data.explanation}</p>
            <div>${data.solution}</div>
        `;

        problemNav.querySelectorAll('.problem-nav-button').forEach(button => {
            button.classList.toggle('active', button.dataset.problem === problemId);
        });
    }
}

// --- 5. EVENT HANDLERS & INITIALIZATION ---

/**
 * Handles clicks on the main navigation tabs.
 * @param {Event} event The click event object.
 */
function handleMainNavigation(event) {
    if (event.target.matches('.nav-button')) {
        setActiveTab(event.target.dataset.target);
    }
}

/**
 * Handles clicks on the problem selection navigation.
 * @param {Event} event The click event object.
 */
function handleProblemNavigation(event) {
    if (event.target.matches('.problem-nav-button')) {
        renderProblem(event.target.dataset.problem);
    }
}

/**
 * Handles clicks on Gemini-powered buttons within the problem content area.
 * Uses event delegation to manage all dynamic buttons.
 * @param {Event} event The click event object.
 */
async function handleGeminiActions(event) {
    const button = event.target.closest('.gemini-btn');
    if (!button) return;

    const action = button.dataset.action;

    if (action === 'explain-code') {
        const codeId = button.dataset.codeTargetId;
        const codeBlock = document.querySelector(`.code-block[data-code-id="${codeId}"] pre`);
        const explanationContainer = button.closest('.code-wrapper').querySelector('.explanation-container');

        if (codeBlock && explanationContainer) {
            const code = codeBlock.innerText;
            explanationContainer.classList.remove('hidden');
            explanationContainer.innerHTML = `<div class="explanation-box">Generating explanation... ✨</div>`;
            
            const prompt = `You are a helpful programming tutor specializing in compiler construction. Explain the following code block line-by-line in a clear and concise way for a computer science student. Use markdown for formatting and highlighting.\n\nCode:\n\`\`\`\n${code}\n\`\`\``;
            const explanation = await callGemini(prompt);
            
            explanationContainer.innerHTML = `<div class="explanation-box">${explanation}</div>`;
        }
    }

    if (action === 'convert-bnf') {
        const bnfInput = document.getElementById('bnf-input');
        const yaccOutputContainer = document.getElementById('yacc-output-container');
        const yaccOutput = document.getElementById('yacc-output');

        if (bnfInput.value.trim() === '') {
            alert('Please enter a BNF grammar.');
            return;
        }

        yaccOutputContainer.classList.remove('hidden');
        yaccOutput.textContent = 'Converting... ✨';
        button.disabled = true;

        const prompt = `You are an expert in compiler design. Convert the following grammar from BNF (Backus-Naur Form) into the equivalent YACC grammar rule format. Only provide the YACC rules, without the %% or any C code sections. Make sure the output is only the YACC code.\n\nBNF Grammar:\n${bnfInput.value}`;
        const yaccCode = await callGemini(prompt);

        yaccOutput.textContent = yaccCode;
        button.disabled = false;
    }
}

/**
 * Initializes the application by setting up event listeners and the default view.
 */
function initialize() {
    // Set the initial view to the 'intro' tab.
    setActiveTab('intro');

    // Add event listeners.
    mainNav.addEventListener('click', handleMainNavigation);
    problemNav.addEventListener('click', handleProblemNavigation);
    problemContent.addEventListener('click', handleGeminiActions);
}

// --- APP START ---

// Wait for the DOM to be fully loaded before running the initialization code.
document.addEventListener('DOMContentLoaded', initialize);
