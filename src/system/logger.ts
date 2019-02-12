import chalk from 'chalk';

export class Logger {
    private readonly prefix: string = '';

    constructor(name?: string, color?: string) {
        if (!name) return;
        this.prefix = `[${name}] `;

        if (!color) return;
        this.prefix = chalk[color](this.prefix);
    }

    public log(text: string) {
        console.log(this.prefix + text);
    }

    public error(text: string) {
        console.log(this.prefix + chalk.red(text));
    }

    public success(text: string) {
        console.log(this.prefix + chalk.greenBright(text));
    }


}