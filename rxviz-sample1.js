const { concat, defer, timer, Observable, ReplaySubject } = Rx;
const { take, switchMap } = RxOperators;

const responseDelay = 1000;
const subscriptionDelay = 500;

function getFromCacheLazy() {
  return defer(() => 'c');
}
function executeRequest() {
  var request$ = new ReplaySubject(1);
  setTimeout(() => {
    request$.next('r');
    request$.complete();
  }, responseDelay);
  return request$;
}

//1. lazy observable that emit 0 or two value created at time of subscription and then completes
const cache$ = getFromCacheLazy();

//2.  BehaviorSubject, that emits value in 1-1500ms and completes
const request$ = executeRequest(); 

//3. comine so that cache is emmited first and request second
const cacheAndRequest$ = concat(cache$, request$);



const $subscribeDelayed = timer(subscriptionDelay).pipe(
  switchMap(_ => cacheAndRequest$))


$subscribeDelayed; //last expression must be observable in order to visualize
