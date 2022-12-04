"use-strict";

import { SelectorType } from "../../../../types/types";
import { Cample } from "../../../cample";

const cample = (
    selector: SelectorType
) : Cample =>{
    return new Cample(selector);
}

export {cample};