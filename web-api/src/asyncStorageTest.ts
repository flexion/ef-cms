// import { AsyncLocalStorage } from 'node:async_hooks';
import { log, switchItUp, withTraceId } from '@web-api/somePretendLogger';

// const someLocalStorage = new AsyncLocalStorage();

// const zachUser = {
//   email: 'zrogers@Flexion.us',
//   userId: '57156595-490b-4b73-b42e-4c09cdcd9d9a',
// };

async function Wait5Seconds() {
  await new Promise(resolve => setTimeout(resolve, 5000));
  log('WAIT 5 SECONDS');
}

async function Wait1Seconds() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  log('WAIT 1 SECONDS');
}

async function Wait3Seconds() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  log('WAIT 3 SECONDS');
}

function main() {
  console.log('starting');
  withTraceId('TRACE_5_SEC', async () => {
    await Wait5Seconds().then(() => {
      switchItUp();
      log('I just switched it up');
    });
  });
  withTraceId('TRACE_1_SEC', Wait1Seconds);
  withTraceId('TRACE_3_SEC', Wait3Seconds);
}

main();
