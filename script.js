'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2025-06-09T17:01:17.194Z',
    '2025-06-14T23:36:17.929Z',
    '2025-06-16T10:51:36.790Z',
  ],
  currency: 'EUR',
  // username: 'js'
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
};

const accounts = [account1, account2, account3];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
    // console.log(containerMovements);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

const updateInterface = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};

createUsername(accounts);

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    time--;
  };

  let time = 300;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

let currentAccount, timer;

// currentAccount = account1;
// updateInterface(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = now.getHours();
    const min = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateInterface(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  // console.log(accounts);

  // console.log(amount, receiver);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    currentAccount.username !== receiver.username
  ) {
    receiver.movements.push(amount);
    currentAccount.movements.push(-amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());

    updateInterface(currentAccount);

    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());
      updateInterface(currentAccount);
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 3000);
  } else {
    console.log('Go and level up!');
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);

    accounts.splice(index, 1);
  }

  inputCloseUsername.value = inputClosePin.value = '';

  containerApp.style.opacity = 0;

  labelWelcome.textContent = `Good day, ${currentAccount.owner.split(' ')[0]}`;
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// console.log(accounts);

// console.log(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (let i = 0; i < movements.length; i++) {
//   console.log(`Value is ${movements[i]}`);
// }

// for (const [i, movement] of movements.entries()) {
//   console.log(`${i}: You deposited ${movement}`);
// }

// movements.forEach(function (movement, i) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// });

// const movementDesc = movements.map(function (movement, i) {
//   if (movement > 0) {
//     return `Movement ${i + 1}: You deposited ${movement}`;
//   } else {
//     return `Movement ${i + 1}: You withdrew ${Math.abs(movement)}`;
//   }
// });

// console.log(movementDesc);
// const numbers = [3, 1, 4, 3, 2];

// const doubleNum = numbers.map(function (num) {
//   return num * 2;
// });

// console.log(doubleNum);

/////////////////////////////////////////////////

// FILTER
// const deposit = movements.filter(mov => mov > 0);
const deposit = movements.filter(function (mov) {
  return mov > 0;
});
const withdrawals = movements.filter(mov => mov < 0);

// REDUCE
const totalBalance = movements.reduce(function (acc, curr) {
  return acc + curr;
}, 0);

const max = movements.reduce(function (acc, curr) {
  if (acc > curr) {
    return acc;
  } else {
    return curr;
  }
}, movements[0]);

const eurToUSD = 1.1;
const totalDepositUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUSD)
  .reduce((acc, curr) => acc + curr, 0);

// console.log(totalDepositUsd);

// 1. [5, 2, 4, 1, 15, 8, 3]
// 2. [16, 6, 10, 5, 6, 1, 4]

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter(age => age >= 18);

  // console.log(humanAges);
  // console.log(adults);

  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// console.log(max);

// console.log(totalBalance);

// console.log(deposit);
// console.log(withdrawals);

// FIND METHOD
const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jonas Schmedtmann');
// console.log(account);

// FINDINDEX METHOD
// console.log(movements);

// console.log(movements.indexOf(-400));

const firstWithdraw = movements.findIndex(function (mov) {
  return mov < 0;
});

// console.log(movements);

// console.log(movements.includes(3000));

const dpositCheck = movements.some(function (mov) {
  return mov > 0;
});

const allDepost = movements.every(mov => mov > 0);

// console.log(dpositCheck);
// console.log(allDepost);

const arrFlat = [1, 2, [3, 4], 5, 6, [7, 8]];
// console.log(arrFlat.flat());

const arrDeep = [1, 2, [3, 4, [5, 6]], 7, [8, 9, [10]]];
// console.log(arrDeep.flat(2));

// const allMovements = accounts.map(acc => acc.movements);
// console.log(allMovements);

// const overallBalance = allMovements.flat();
// console.log(overallBalance);

// const overall = overallBalance.reduce((acc, bal) => acc + bal, 0);
// console.log(overall);

const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, bal) => acc + bal, 0);

// console.log(overallBalance);

const owners = ['Gbolahan', 'Farouq', 'Samuel', 'Maleek'];
// console.log(owners.sort());
// console.log(owners);

// console.log(movements);
// console.log(movements.sort());

// movements.sort((a, b) => {
//   if (a > b) return 1;

//   if (a < b) return -1;
// });

// movements.sort((a, b) => a - b);

// console.log(movements);

// CREATING DATES IN JS
// const today = new Date();

// console.log(today);

// console.log(new Date('Jul 15 2020 19:04:23'));
// console.log(new Date('June 1, 2008'));

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2035, 6, 21, 15, 55, 25));

// console.log(new Date(2025, 9, 25));

// console.log(new Date(1960, 9, 1));

// GET DATE
// const future = new Date(2046, 5, 1, 21, 45);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2411498700000));

// console.log(Date.now());

// console.log(new Date(1750070871789));

// future.setFullYear(2026);
// console.log(future);

// const ingredients = ['olives', 'spinach'];
// const pizzaTime = setTimeout(
//   (ing1, ing2) => {
//     console.log(`Here is your pizza with ${ing1} and ${ing2}`);
//   },
//   5000,
//   ...ingredients
// );
// console.log('Waiting...');

// if (ingredients.includes('spinach')) clearTimeout(pizzaTime);

// setInterval(() => {
//   const now = new Date();
//   console.log(now);
// }, 1000);

const future = new Date(2030, 6, 30, 12, 12);
// console.log(+future);

const calcDaysPassed = function (date1, date2) {
  return Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
};

const day1 = calcDaysPassed(new Date(2030, 6, 30), new Date(2030, 6, 25));
// console.log(day1);

// ASSINMENT
// Make research on sum and every under array methods

// Learn and understand deeply the following:
// Internationalizing in JS
// Everything about numbers and math in js
// Understand deeply set-timeout and set-interval

// COUNT-DOWN STEPS
// 1. Set time to 5 minutes,
// 2. Call the timer every 5 secs
// 3. Each time you call, print the remaining time to the interface
// 4. At 0 secs, logout
