import * as React from "react";
import { Button, Form } from "semantic-ui-react";
import { parseNumListWithPadding } from "../helpers";
import TupleInputPart from "./TupleInputPart";

interface TupleInputProps {
    value: string,
    minLen: number,
    maxLen: number,
    fieldName: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
}

const TupleInput: React.FC<TupleInputProps> = ({ value, minLen, maxLen, fieldName, setFieldValue }) => {

    const tupleInputValue = parseNumListWithPadding(value, minLen);

    const tupleInputRefsArray = React.useRef<HTMLInputElement[]>([]);

    const tupleInputChangeHandle = (idx: number, val: string) => {
      const newTupleInputValue = [...tupleInputValue];
      newTupleInputValue[idx] = val;
      setFieldValue(fieldName, newTupleInputValue.toString());
    };

    const commaPressHandle = (idx: number) => {
      if(idx===(tupleInputValue.length-1)) {
        newTupleDim();
      } else {
          tupleInputRefsArray.current[idx+1].focus();
      }
    }

    const newTupleDim = () => {
      if(tupleInputValue.length < maxLen) {
        const newTupleInputValue = [...tupleInputValue];
        newTupleInputValue.push("");
        setFieldValue(fieldName, newTupleInputValue.toString());
      }
    }

    React.useEffect(() => {
      if(tupleInputValue.length > minLen) {
        tupleInputRefsArray.current[tupleInputValue.length-1].focus();
      }
    }, [tupleInputValue.length, minLen]);

    const delTupleDim = () => {
      if(tupleInputValue.length > minLen) {
        const newTupleInputValue = [...tupleInputValue];
        newTupleInputValue.pop();
        setFieldValue(fieldName, newTupleInputValue.toString());
      }
    }

    return (
      <>
        <Form.Group>
          {tupleInputValue.map((val, idx) => {
            const tupleRef = (ref:HTMLInputElement) => { tupleInputRefsArray.current[idx] = ref; }
            return <Form.Field width={2} key={idx}><TupleInputPart tupleKey={idx} name={fieldName + "_" + idx} id={"id_" + fieldName + "_" + idx} value={val} tupleRef={tupleRef} tupleInputChangeHandle={tupleInputChangeHandle} commaPressHandle={commaPressHandle} /></Form.Field>
          })}
          <Form.Field hidden={minLen === maxLen}>
            <Button onClick={newTupleDim} disabled={tupleInputValue.length === maxLen} type="button" icon="add" title="Add dimension" basic={false} />
            <Button onClick={delTupleDim} disabled={tupleInputValue.length === minLen} type="button" icon="minus" title="Remove dimension" basic={false} />
          </Form.Field>
        </Form.Group>
      </>
    );
}

export default TupleInput;