var sum_to_n_a = function (n) {
    if (n == 0) return 0;
    return n + sum_to_n_a(n - 1 * Math.sign(n))
};

var sum_to_n_b = function (n) {
    let sum = 0;
    for (let i = n; i !== 0; i -= Math.sign(n)) {
        sum += i;
    }
    return sum;
};

var sum_to_n_c = function (n) {
    const sign = Math.sign(n);
    return (n * (n + sign)) / 2 * sign;
};

export { sum_to_n_a, sum_to_n_b, sum_to_n_c };