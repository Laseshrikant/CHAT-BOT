const display = document.getElementById('display');
const buttons = document.querySelector('.grid');

let current = '0';
let stored = null; // number
let pendingOp = null; // '+', '-', '*', '/'
let entering = false; // user is typing a number

function setDisplay(val){
  display.textContent = val;
}

function normalizeNumberString(s){
  if (s === '' || s === '-') return '0';
  if (s === '.') return '0.';
  if (s.startsWith('0') && s.length > 1 && !s.startsWith('0.')){
    return String(Number(s));
  }
  return s;
}

function inputDigit(d){
  if (!entering){
    current = d;
    entering = true;
  } else {
    current = current === '0' ? d : current + d;
  }
  setDisplay(current);
}

function inputDecimal(){
  if (!entering){
    current = '0.';
    entering = true;
  } else if (!current.includes('.')){
    current += '.';
  }
  setDisplay(current);
}

function clearAll(){
  current = '0';
  stored = null;
  pendingOp = null;
  entering = false;
  setDisplay('0');
}

function backspace(){
  if (!entering) return;
  if (current.length <= 1){
    current = '0';
    entering = false;
    setDisplay('0');
    return;
  }
  current = current.slice(0, -1);
  current = normalizeNumberString(current);
  if (!current.includes('.') && current === '0') entering = false;
  setDisplay(current);
}

function applyOp(a, op, b){
  switch(op){
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function chooseOp(op){
  const curNum = Number(current);

  if (pendingOp && stored !== null && entering){
    stored = applyOp(stored, pendingOp, curNum);
  } else if (stored === null){
    stored = curNum;
  }

  if (Number.isNaN(stored)){
    setDisplay('Error');
    current = '0';
    stored = null;
    pendingOp = null;
    entering = false;
    return;
  }

  pendingOp = op;
  entering = false;
  current = '0';
  setDisplay(String(stored));
}

function equals(){
  if (!pendingOp || stored === null) return;

  const b = Number(current);
  const result = applyOp(stored, pendingOp, b);

  if (Number.isNaN(result) || !Number.isFinite(result)){
    setDisplay('Error');
    stored = null;
    pendingOp = null;
    current = '0';
    entering = false;
    return;
  }

  const text = Number.isInteger(result) ? String(result) : String(result);
  setDisplay(text);

  current = text;
  stored = null;
  pendingOp = null;
  entering = false;
}

buttons.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const digit = btn.getAttribute('data-digit');
  const op = btn.getAttribute('data-op');
  const action = btn.getAttribute('data-action');

  if (digit !== null){
    inputDigit(digit);
    return;
  }

  if (op){
    chooseOp(op);
    return;
  }

  if (action === 'clear') return clearAll();
  if (action === 'back') return backspace();
  if (action === 'decimal') return inputDecimal();
  if (action === 'equals') return equals();
});

window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key >= '0' && key <= '9') inputDigit(key);
  else if (key === '.') inputDecimal();
  else if (key === 'Backspace') backspace();
  else if (key === 'Escape') clearAll();
  else if (key === '+' || key === '-' || key === '*' || key === '/') chooseOp(key);
  else if (key === 'Enter' || key === '=') equals();
});

setDisplay('0');

