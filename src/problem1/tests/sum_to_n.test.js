import { describe, it, expect } from 'vitest'
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from '../sum_to_n.js'

describe('Sum to N Functions', () => {
    // Test data with expected results
    const testCases = [
        { input: 1, expected: 1, description: 'n = 1' },
        { input: 2, expected: 3, description: 'n = 2 (1 + 2)' },
        { input: 3, expected: 6, description: 'n = 3 (1 + 2 + 3)' },
        { input: 4, expected: 10, description: 'n = 4 (1 + 2 + 3 + 4)' },
        { input: 5, expected: 15, description: 'n = 5 (1 + 2 + 3 + 4 + 5)' },
        { input: 10, expected: 55, description: 'n = 10' },
        { input: 100, expected: 5050, description: 'n = 100' },
        { input: 1000, expected: 500500, description: 'n = 1000' }
    ]

    // Edge cases
    const edgeCases = [
        { input: 0, expected: 0, description: 'n = 0 (edge case)' }
    ]

    // Negative number test cases - proper sum from n to -1
    const negativeTestCases = [
        { input: -1, expected: -1, description: 'n = -1 (sum: -1 = -1)' },
        { input: -2, expected: -3, description: 'n = -2 (sum: -2 + -1 = -3)' },
        { input: -3, expected: -6, description: 'n = -3 (sum: -3 + -2 + -1 = -6)' },
        { input: -5, expected: -15, description: 'n = -5 (sum: -5 + -4 + -3 + -2 + -1 = -15)' },
        { input: -10, expected: -55, description: 'n = -10 (sum: -10 + ... + -1 = -55)' }
    ]

    describe('sum_to_n_a (First Implementation)', () => {
        testCases.forEach(({ input, expected, description }) => {
            it(`should return ${expected} for ${description}`, () => {
                expect(sum_to_n_a(input)).toBe(expected)
            })
        })

        edgeCases.forEach(({ input, expected, description }) => {
            it(`should handle ${description}`, () => {
                expect(sum_to_n_a(input)).toBe(expected)
            })
        })

        negativeTestCases.forEach(({ input, expected, description }) => {
            it(`should handle ${description}`, () => {
                expect(sum_to_n_a(input)).toBe(expected)
            })
        })
    })

    describe('sum_to_n_b (Second Implementation)', () => {
        testCases.forEach(({ input, expected, description }) => {
            it(`should return ${expected} for ${description}`, () => {
                expect(sum_to_n_b(input)).toBe(expected)
            })
        })

        edgeCases.forEach(({ input, expected, description }) => {
            it(`should handle ${description}`, () => {
                expect(sum_to_n_b(input)).toBe(expected)
            })
        })

        negativeTestCases.forEach(({ input, expected, description }) => {
            it(`should handle ${description}`, () => {
                expect(sum_to_n_b(input)).toBe(expected)
            })
        })

        it('should handle large numbers efficiently', () => {
            expect(sum_to_n_b(10000)).toBe(50005000)
        })
    })

    describe('sum_to_n_c (Third Implementation)', () => {
        testCases.forEach(({ input, expected, description }) => {
            it(`should return ${expected} for ${description}`, () => {
                expect(sum_to_n_c(input)).toBe(expected)
            })
        })

        edgeCases.forEach(({ input, expected, description }) => {
            it(`should handle ${description}`, () => {
                expect(sum_to_n_c(input)).toBe(expected)
            })
        })

        negativeTestCases.forEach(({ input, expected, description }) => {
            it(`should handle ${description}`, () => {
                expect(sum_to_n_c(input)).toBe(expected)
            })
        })

        it('should handle large numbers efficiently', () => {
            expect(sum_to_n_c(10000)).toBe(50005000)
        })
    })

    describe('Function Consistency', () => {
        it('all three implementations should return the same result for the same positive input', () => {
            const testValues = [1, 2, 3, 4, 5, 10, 50, 100]

            testValues.forEach(n => {
                const resultA = sum_to_n_a(n)
                const resultB = sum_to_n_b(n)
                const resultC = sum_to_n_c(n)

                expect(resultA).toBe(resultB)
                expect(resultB).toBe(resultC)
                expect(resultA).toBe(resultC)
            })
        })

        it('all three implementations should return the same result for negative inputs', () => {
            const negativeValues = [-1, -2, -3, -5, -10]

            negativeValues.forEach(n => {
                const resultA = sum_to_n_a(n)
                const resultB = sum_to_n_b(n)
                const resultC = sum_to_n_c(n)

                expect(resultA).toBe(resultB)
                expect(resultB).toBe(resultC)
                expect(resultA).toBe(resultC)
            })
        })
    })

    describe('Performance and Type Validation', () => {
        it('should return numbers for all implementations', () => {
            const testValue = 5

            expect(typeof sum_to_n_a(testValue)).toBe('number')
            expect(typeof sum_to_n_b(testValue)).toBe('number')
            expect(typeof sum_to_n_c(testValue)).toBe('number')
        })
    })

    describe('Mathematical Formula Verification', () => {
        it('should match the mathematical formula n*(n+1)/2 for positive numbers', () => {
            const testValues = [1, 2, 3, 4, 5, 10, 25, 50, 100]

            testValues.forEach(n => {
                const expected = (n * (n + 1)) / 2

                expect(sum_to_n_a(n)).toBe(expected)
                expect(sum_to_n_b(n)).toBe(expected)
                expect(sum_to_n_c(n)).toBe(expected)
            })
        })
    })

    describe('Negative Number Sum Behavior', () => {
        it('should correctly calculate sum from negative n to -1', () => {
            // For n = -3: sum of -3 + -2 + -1 = -6
            expect(sum_to_n_a(-3)).toBe(-6)
            expect(sum_to_n_b(-3)).toBe(-6)
            expect(sum_to_n_c(-3)).toBe(-6)

            // For n = -5: sum of -5 + -4 + -3 + -2 + -1 = -15
            expect(sum_to_n_a(-5)).toBe(-15)
            expect(sum_to_n_b(-5)).toBe(-15)
            expect(sum_to_n_c(-5)).toBe(-15)
        })

        it('should verify the mathematical relationship for negative sums', () => {
            // For negative numbers, the sum from n to -1 follows the same pattern
            // as positive numbers but with negative values
            const testCases = [
                { n: -1, sum: -1 },  // -1 = -1
                { n: -2, sum: -3 },  // -2 + -1 = -3
                { n: -3, sum: -6 },  // -3 + -2 + -1 = -6
                { n: -4, sum: -10 }, // -4 + -3 + -2 + -1 = -10
                { n: -5, sum: -15 }  // -5 + -4 + -3 + -2 + -1 = -15
            ]

            testCases.forEach(({ n, sum }) => {
                expect(sum_to_n_a(n)).toBe(sum)
                expect(sum_to_n_b(n)).toBe(sum)
                expect(sum_to_n_c(n)).toBe(sum)
            })
        })
    })
})
