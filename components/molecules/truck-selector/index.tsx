import React from "react";
import { TruckSelectorProps } from "./types";

export function TruckSelector(props: TruckSelectorProps) {
  const [val, setVal] = React.useState<string>("");
  const { onTruckSelected } = props;
  const onButtonPressed = () => {
    onTruckSelected(val);
  };
  return (
    <>
      <input
        placeholder="type truck here"
        className="bg-yellow-100"
        onChange={(el) => setVal(el.target.value)}
      />
      <button className="btn bg-green-100" onClick={onButtonPressed}>
        Get location
      </button>
    </>
  );
}
