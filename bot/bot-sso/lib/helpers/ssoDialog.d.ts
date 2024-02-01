import { ComponentDialog } from "botbuilder-dialogs";
import { Storage, TurnContext } from "botbuilder";
import "isomorphic-fetch";
export declare class SSODialog extends ComponentDialog {
    private requiredScopes;
    private dedupStorage;
    private dedupStorageKeys;
    private operationWithSSO;
    constructor(dedupStorage: Storage);
    setSSOOperation(handler: (arg0: any, arg1: string) => Promise<any> | undefined): void;
    resetSSOOperation(): void;
    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} dialogContext
     */
    run(context: TurnContext, dialogState: any): Promise<void>;
    ssoStep(stepContext: any): Promise<any>;
    dedupStep(stepContext: any): Promise<any>;
    executeOperationWithSSO(stepContext: any): Promise<any>;
    onEndDialog(context: TurnContext): Promise<void>;
    shouldDedup(context: TurnContext): Promise<boolean>;
    getStorageKey(context: TurnContext): string;
}
