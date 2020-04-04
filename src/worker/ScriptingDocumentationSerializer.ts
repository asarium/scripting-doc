import {ScriptingDocumentation} from "fso-ts-generator";
import {JsonSerializable, SerializerImplementation} from "threads/dist/serializers";

export class ScriptingDocumentationSerializer implements SerializerImplementation {
    deserialize(
        message: JsonSerializable,
        defaultDeserialize: (msg: JsonSerializable) => any): any {
        try {
            return ScriptingDocumentation.parseAndValidate(message);
        } catch (_e) {
            return defaultDeserialize(message);
        }
    }

    serialize(
        input: any,
        defaultSerialize: (inp: ScriptingDocumentation) => JsonSerializable): JsonSerializable {
        if (input instanceof ScriptingDocumentation) {
            return input.serialize();
        } else {
            return defaultSerialize(input);
        }
    }
}
