import { cn } from '@/lib/utils'

describe('utils', () => {
    describe('cn', () => {
        it('merges class names correctly', () => {
            expect(cn('c-1', 'c-2')).toBe('c-1 c-2')
        })

        it('handles conditional classes', () => {
            expect(cn('c-1', false && 'c-2', 'c-3')).toBe('c-1 c-3')
            expect(cn('c-1', true && 'c-2')).toBe('c-1 c-2')
        })

        it('merges tailwind classes conflict', () => {
            // tailwind-merge should resolve this to the last one
            expect(cn('px-2 py-1', 'p-4')).toBe('p-4')
        })
    })
})
