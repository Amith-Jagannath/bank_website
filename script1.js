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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// To display time
// console.log('hello');
// //fake login
// const now = new Date();
// const month = `${now.getMonth() + 1}`.padStart(2, 0);
// const year = now.getFullYear();
// const day = `${now.getDay()}`.padStart(2, 0);
// const hours = `${now.getHours()}`.padStart(2, 0);
// const minutes = `${now.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${day}/${month}/${year} ${hours}:${minutes}`;
//Alternate method to display time
// const lang = navigator.language;
// console.log(lang);
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  weekday: 'short',
};
const now = new Date();
labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
//display();
const display = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const moc = sort ? movements.slice().sort((a, b) => a - b) : movements;
  moc.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    
 
  <div class="movements__value">${Math.abs(mov).toFixed(2)}
  </div></div>
 `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const update = function (currentAcc) {
  display(currentAcc.movements, sort);
  //to display balance
  printBalance(currentAcc);
  //summary
  summary(currentAcc);
};

//fake login

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
createUsername(accounts);

const printBalance = function (accs) {
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = ` ${accs.balance.toFixed(2)} Euro`;
};

//summary
const summary = function (accs) {
  //income
  const income = accs.movements
    .filter(mov => mov >= 0)
    .reduce((acc, mov) => acc + mov, 0);
  // console.log(income);
  labelSumIn.textContent = `${income.toFixed(2)}`;

  //expenditure
  const expenditure = accs.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(expenditure).toFixed(2)}€`;
  //interest
  const interest = accs.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accs.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//to start timer
let timer;
const startTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'login to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  let time = 20;
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

//login
let currentAcc;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //to find the user object
  currentAcc = accounts.find(acc => acc.username == inputLoginUsername.value);
  // console.log(currentAcc);
  if (currentAcc?.pin == Number(inputLoginPin.value)) {
    //to display
    labelWelcome.textContent = `welcome, ${currentAcc.owner.split(' ')[0]}`;

    //to empty the input field
    inputLoginPin.value = inputLoginUsername.value = '';

    //to display
    containerApp.style.opacity = 100;
    //timer
    if (timer) clearInterval(timer);
    timer = startTimer();
    update(currentAcc);
  }
});

//loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const condition = currentAcc.movements.some(
    mov => mov >= 0.1 * Number(inputLoanAmount.value)
  );
  if (condition) {
    console.log('pass');
    currentAcc.movements.push(Number(Math.floor(inputLoanAmount.value)));
    update(currentAcc);
  }
  clearInterval(timer);
  timer = startTimer();
});

//transfer......
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    accs => accs.username === inputTransferTo.value
  );
  // console.log(amount);
  if (
    amount > 0 &&
    currentAcc.balance >= amount &&
    recieverAcc.username != currentAcc.username
  ) {
    recieverAcc.movements.push(amount);
    currentAcc.movements.push(-amount);
    // console.log(recieverAcc);
    // console.log(currentAcc);
    update(currentAcc);
  }
  clearInterval(timer);
  timer = startTimer();
});

//close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value == currentAcc.username &&
    inputClosePin.value == currentAcc.pin
  ) {
    console.log('acc deleted');
    const idx = accounts.findIndex(acc => acc.username === currentAcc.username);
    accounts.splice(idx, 1);
    containerApp.style.opacity = 0;
  }
});

//sort
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  display(currentAcc.movements, !sort);
  sort = !sort;
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// const options1 = {
//   unit: 'mile-per-hour',
//   // currency style: 'currency',
// };
// const num = 3245671.6542;
// console.log(new Intl.NumberFormat('en-US', options1).format(num));
// console.log(new Intl.NumberFormat('de-DE', options1).format(num));
// console.log(new Intl.NumberFormat('ar-SY', options1).format(num));
