const { map, filter, pluck, auditTime, debounceTime, bufferTime, throttleTime } = rxjs.operators;
    
/* TESTE DE SUBSCRIPTION */
const element = document.getElementById("btn-teste");
let observable = rxjs.fromEvent(element, 'click');
const subscription = observable
    .subscribe(e => {
        document.getElementById("show-result").innerHTML = 'ESTE RESULTADO SERÁ MOSTRADO SOMENTE UMA VEZ. EVENTO: ' + e;
        subscription.unsubscribe();
    });

/* TESTE DE MAP / PLUCK */
const frame = document.getElementById("frame");
let obsframe$ = rxjs.fromEvent(frame, 'click');
obsframe$
    .pipe(
        pluck('screenX')
    )
    .subscribe(e => document.getElementById("show-result").innerHTML = 'Posição do clique em X: ' + e);

/* TESTE DE TIMERS - Descomente e comente para testar */
let tempo = 1000;
const timer = document.getElementById("btn-timer");
let timerObservable$ = rxjs.fromEvent(timer, 'click');

// ---> auditTime
tempo = 5000;
let sum = 0;
timerObservable$.pipe(auditTime(tempo)).subscribe(() => {
    sum = ++sum; 
    document.getElementById("show-result").innerHTML = `AUDIT TIME - 
        Mostrei depois de ${tempo/1000} segundo(s) o primeiro clique e ignorei os outros!
        Clique de número ${sum}`
});        

// ---> bufferTime
// tempo = 5000;
// timerObservable$.pipe(bufferTime(tempo)).subscribe((e) => document.getElementById("show-result").innerHTML = `BUFFER TIME - Mostro todos os cliques feitos em ${tempo/1000} segundo(s) em um array! ${e}`);

// ---> debounceTime
// tempo = 5000;
// timerObservable$.pipe(debounceTime(tempo)).subscribe((e) => document.getElementById("show-result").innerHTML = `DEBOUNCE TIME - Pega somente o último valor do tempo programado, ${tempo/1000} segundo(s). Bom para pesquisar por inserção de texto em um campo input! ${e}`);

// ---> throttleTime
// tempo = 5000;
// let sum = 0;
// timerObservable$.pipe(throttleTime(tempo)).subscribe((e) => { sum = ++sum; document.getElementById("show-result").innerHTML = `THROTTLE TIME - Pega somente o primeiro valor do tempo programado, ${tempo/1000} segundo(s)! Iteração número ${sum}` });

/* TESTES SUBJECT */
let inputSubj = '';

function onSubj(evt) {
    inputSubj = evt.value;
}

let subject$ = new rxjs.Subject();
let btnSubj = document.getElementById("btn-subject");
let inputOb$ = rxjs.fromEvent(btnSubj, 'click');
inputOb$.subscribe(e => subject$.next(inputSubj));

let Ob1$ = subject$.asObservable();
Ob1$.subscribe((e) => document.getElementById("show-result").innerHTML = e)

let Ob2$ = subject$.asObservable()
Ob2$.pipe(
        map(e => {
            let numero = Math.floor(Math.random() * 10 + Math.random() * 10); 
            return `
            Aqui é um exemplo de outro observable escutando o subject e fazendo uma outra operação.
            Número randomico ${numero} + ${e} = ${(parseInt(numero) + parseInt(e))}`
        })
    )
.subscribe((event) => {
    let showResult2 = document.getElementById("show-result2");
    showResult2.style.removeProperty('display');
    showResult2.innerHTML = event;
    window.scrollTo(0,document.body.scrollHeight);
    setTimeout( () => {
        showResult2 = document.getElementById("show-result2");
        showResult2.style.display = 'none';
        showResult2.innerHTML = '';
        scrollTo(0,0);
    }, 5000)
})
