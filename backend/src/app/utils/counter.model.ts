import { Schema, model, Document } from "mongoose";

interface ICounter extends Document<string> {
    seq: number;
}

const counterSchema = new Schema<ICounter>({
    _id: { type: String, required: true },
    seq: { type: Number, default: 9000 }, // first generated id will be 9001
});

export const CounterModel = model<ICounter>("Counter", counterSchema);

export const getNextSequence = async (
    counterName: string
): Promise<number> => {

    let counter = await CounterModel.findById(counterName);

    if (!counter) {
        counter = await CounterModel.create({
            _id: counterName,
            seq: 9000
        });
    }

    counter = await CounterModel.findByIdAndUpdate(
        counterName,
        { $inc: { seq: 1 } },
        { new: true }
    );

    return counter!.seq;
};