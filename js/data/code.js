const savedCode = localStorage.getItem("code");

let code;

if (savedCode) {
  code = JSON.parse(savedCode);
} else {
  code = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10)
  );

  localStorage.setItem("code", JSON.stringify(code));
}

export function getCodeDigit(index) {
  return code[index];
}