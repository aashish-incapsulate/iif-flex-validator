declare namespace IffFlexValidator {

    class ConditionEvaluator {
        constructor(ctx: ValidatorContext);
        message(dependentMessages: DependentMessage[]): string;
        values(dependentValues: DependentValues[]): Value[];
        evaluate(dependency: Dependency): boolean;
        allValuesWithAllResult(dependentValues: DependentValues[]): (string | string[])[];
        allMessagesWithAllResult(dependentMessages: DependentMessage[]): string[];
    }

    class ValidatorContext {
        ServiceQuestionCode: {[key: string]: any};
        OutcomeQuestionCode?: {[key: string]: any};
        Address?: {[key: string]: any};
        AddressLayer?: {[key: string]: any};
    }

    class DependentMessage {
        dependentOn: Dependency;
        message: string;
    }

    class DependentValues {
        dependentOn: Dependency;
        values: Value[];
    }

    class Dependency {
        clause: string;
        conditions: DependencyCondition[];
    }

    class DependencyCondition {
        op: string;
        left?: string;
        right?: any;
        attribute?: string;
        value?: string;
    }

    class Value {
        key: string;
        name: string;
    }
}

export default IffFlexValidator.ConditionEvaluator;
