import { RemovalPolicy } from "aws-cdk-lib";
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";
import { AccountRecovery, UserPool, UserPoolClientIdentityProvider } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

export class Cognito {
    private _userPool: UserPool;
    private _authorizer: CognitoUserPoolsAuthorizer;
    constructor(scope: Construct) {
        this._userPool = new UserPool(scope, "UserPool", {
            userPoolName: "to-do_user-pool",
            removalPolicy: RemovalPolicy.DESTROY,
            selfSignUpEnabled: true,
            signInAliases: {email: true},
            passwordPolicy: {
                minLength: 6
            },
            accountRecovery: AccountRecovery.EMAIL_ONLY
        });

        this._userPool.addClient("user-pool-client", {
            authFlows: {
                adminUserPassword: true,
                userPassword: true,
                custom: true,
                userSrp: true
            },
            supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO]
        });

        this._authorizer = new CognitoUserPoolsAuthorizer(scope, "UserPoolAuthorizer", {
        authorizerName: "to-do_user-pool_authorizer",
        cognitoUserPools: [this._userPool]
        })
    }

    public get authorizer() {
        return this._authorizer;
    }
}