import { TTLParser } from "$lib/ttl.js";
import { describe, expect, test, vi } from "vitest";

describe('ttl', () => {
    test('#constructor', () => {
        expect(() => new TTLParser('something else' as any)).toThrowError();
    })

    test('#toSecond', () => {
        expect(new TTLParser('5s').toSecond()).toBe(5);
        expect(new TTLParser('5m').toSecond()).toBe(300);
        expect(new TTLParser('5h').toSecond()).toBe(18_000);
    })

    test('#toMilliSecond', () => {
        expect(new TTLParser('5s').toMilliSecond()).toBe(5_000);
        expect(new TTLParser('5m').toMilliSecond()).toBe(300_000);
        expect(new TTLParser('5h').toMilliSecond()).toBe(18_000_000);
    })

    test('#toDate', () => {
        const today = Date.UTC(2023, 5, 1, 1, 1, 1, 1)
        const spy = vi.spyOn(Date, 'now')
        spy.mockReturnValue(today);
        
        expect(new TTLParser('5s').toDate()).toStrictEqual(new Date("2023-06-01T01:01:06.001Z"));
        expect(new TTLParser('5m').toDate()).toStrictEqual(new Date("2023-06-01T01:06:01.001Z"));
        expect(new TTLParser('5h').toDate()).toStrictEqual(new Date("2023-06-01T06:01:01.001Z"));
    })
})