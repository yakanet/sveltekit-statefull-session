export type TTL = `${number}s` | `${number}m` | `${number}h`


export class TTLParser {
    private second: number;
    private now = Date.now();
    constructor(ttl: TTL) {
        const unit = ttl.slice(-1);
        const amount = Number(ttl.slice(0, -1));
        if (!isNaN(amount)) {
            switch (unit) {
                case 's':
                    this.second = amount;
                    return;
                case 'm':
                    this.second = amount * 60;
                    return;
                case 'h':
                    this.second = amount * 60 * 60;
                    return;
            }
        }
        throw new Error(`Illegal TTL format : ${ttl}`);
    }

    toSecond(): number {
        return this.second;
    }

    toMilliSecond(): number {
        return this.toSecond() * 1000;
    }

    toDate(): Date {
        return new Date(this.now + this.toMilliSecond());
    }
}