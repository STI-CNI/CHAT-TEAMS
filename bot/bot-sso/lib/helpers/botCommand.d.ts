export type PredicateFunc<T> = (v: T) => boolean;
export type MatchTerm = string | RegExp | PredicateFunc<string>;
export declare abstract class BotCommand {
    matchPatterns: MatchTerm[];
    abstract run(parameters: any): any;
    validateParameters(parameters: any): boolean;
    expressionMatchesText(userInput: string): RegExpExecArray | boolean;
}
export declare class SSOCommand extends BotCommand {
    operationWithSSOToken: (arg0: any, ssoToken: string) => Promise<any> | undefined;
    validateParameters(parameters: any): boolean;
    run(parameters: any): Promise<any>;
}
