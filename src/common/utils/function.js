const isTrue = (value) => [1, true, "true"].includes(value);
const isFalse = (value) => [0, false, "false"].includes(value);

module.exports = {
  isFalse, isTrue
}