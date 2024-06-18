// *********************************************************************
// * IMPORANT: This file was generated, do not try to modify directly! *
// *********************************************************************
import { FC, useState, useEffect } from "react";
import { DatePicker, Input, InputNumber, Radio, Select } from "antd";

const SUM = (...values: any[]) => {
  return values.reduce((total, current) => total + +current, 0);
};

const NOT = (expression: any) => {
  return !expression;
};

const IF = (expression: any, ifTrue: any, ifFalse: any) => {
  return expression ? ifTrue : ifFalse;
};

type DataEntryMonolithProps = {
  p?: any;
};

const DataEntryMonolith: FC<DataEntryMonolithProps> = ({
  p,
}: DataEntryMonolithProps) => {
  const get_U2hlZXQx_A1: string = "Test";
  const get_U2hlZXQx_B1: string = "";
  const get_U2hlZXQx_A2: string = "";
  const get_U2hlZXQx_B2: string = "Test2";

  return (
    <div className="data-entry-mololith">
      <table>
        <tbody>
          <tr>
            <td colSpan={1} rowSpan={1}>
              Test
            </td>
            <td colSpan={1} rowSpan={1}></td>
          </tr>
          <tr>
            <td colSpan={1} rowSpan={1}></td>
            <td colSpan={1} rowSpan={1}>
              Test2
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataEntryMonolith;
